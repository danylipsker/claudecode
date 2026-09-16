<#
.SYNOPSIS
  Safety net for the SOLIDWORKS Resource Monitor: a per-user scheduled task that kills
  sldProcMon.exe within five seconds of it appearing, so it can never sit at 100 % CPU again,
  even after a SOLIDWORKS update restores the executable that solidworks-quiet.ps1 renamed.
  Needs no administrator rights.

.DESCRIPTION
  The loop itself is solidworks-monitor-watchdog.vbs (next to this file), run by wscript.exe, which
  has no console window. An earlier PowerShell version of the loop kept dying from console-close
  events (exit 0xC000013A) at unpredictable moments; a Windows Script Host process cannot receive
  those. As a second layer the task starts a new copy every 5 minutes (policy Parallel) and the new
  copy retires every older copy itself (Task Scheduler's StopExisting cannot stop a window-less
  process), so whatever happens, exactly one fresh loop is running within 5 minutes.

  -Install    registers the task "SOLIDWORKS Resource Monitor watchdog" (at sign-in + every 5 min)
              pointing at the .vbs next to this file, and starts it. Keep both files where they are;
              re-run -Install after moving them.
  -Uninstall  removes the task and stops the loop.
  -Status     shows whether the task exists and the loop is running, plus the last kills.

  Idle cost: one WMI query every 5 seconds, no measurable CPU. Every kill is written to
  solidworks-watchdog.log next to this file.

.EXAMPLE
  powershell -NoProfile -ExecutionPolicy Bypass -File .\solidworks-monitor-watchdog.ps1 -Install
  powershell -NoProfile -ExecutionPolicy Bypass -File .\solidworks-monitor-watchdog.ps1 -Status
  powershell -NoProfile -ExecutionPolicy Bypass -File .\solidworks-monitor-watchdog.ps1 -Uninstall
#>
[CmdletBinding()]
param(
    [switch]$Install,
    [switch]$Uninstall,
    [switch]$Status
)

$ErrorActionPreference = 'Stop'

$TaskName = 'SOLIDWORKS Resource Monitor watchdog'
$Loop     = Join-Path $PSScriptRoot 'solidworks-monitor-watchdog.vbs'
$Log      = Join-Path $PSScriptRoot 'solidworks-watchdog.log'
$User     = "$env:USERDOMAIN\$env:USERNAME"

function Get-WatchdogProcess {
    Get-CimInstance Win32_Process -Filter "Name='wscript.exe'" |
        Where-Object { $_.CommandLine -match 'solidworks-monitor-watchdog\.vbs' }
}

function Show-Status {
    $task = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
    if ($task) {
        $info = $task | Get-ScheduledTaskInfo
        Write-Host "Scheduled task : installed, state $($task.State), next tick $($info.NextRunTime)"
    } else {
        Write-Host 'Scheduled task : not installed'
    }
    $wp = @(Get-WatchdogProcess)
    Write-Host ('Watchdog loop  : ' + $(if ($wp) { "running (wscript.exe PID $($wp[0].ProcessId), since $($wp[0].CreationDate.ToString('HH:mm:ss')))" } else { 'not running' }))
    if (Test-Path $Log) {
        Write-Host 'Last entries   :'
        Get-Content -LiteralPath $Log -Tail 5 | ForEach-Object { Write-Host "  $_" }
    } else {
        Write-Host 'Last entries   : none logged yet'
    }
}

if ($Install) {
    if (-not (Test-Path $Loop)) { throw "Loop script not found next to this file: $Loop" }
    $action    = New-ScheduledTaskAction -Execute 'wscript.exe' -Argument ('//B //Nologo "{0}"' -f $Loop)
    $atLogon   = New-ScheduledTaskTrigger -AtLogOn -User $User
    # daily trigger repeating every 5 minutes for the whole day = "every 5 minutes, forever"
    # (an unbounded RepetitionDuration is rejected by Task Scheduler on this Windows build)
    $every5min = New-ScheduledTaskTrigger -Daily -At '00:00'
    $every5min.Repetition = (New-ScheduledTaskTrigger -Once -At '00:00' -RepetitionInterval (New-TimeSpan -Minutes 5) -RepetitionDuration (New-TimeSpan -Days 1)).Repetition
    # Parallel: each tick starts a new copy; the copy itself retires the older ones (see the .vbs).
    $settings  = New-ScheduledTaskSettingsSet -ExecutionTimeLimit ([TimeSpan]::Zero) -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -DontStopOnIdleEnd -StartWhenAvailable -MultipleInstances Parallel
    $principal = New-ScheduledTaskPrincipal -UserId $User -LogonType Interactive -RunLevel Limited
    Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger @($atLogon, $every5min) -Settings $settings -Principal $principal -Description ('Kills the SOLIDWORKS Resource Monitor (sldProcMon.exe) whenever it appears, because it spins one CPU core at 100 %. Runs {0}; run solidworks-monitor-watchdog.ps1 -Uninstall to remove.' -f $Loop) -Force | Out-Null

    Start-ScheduledTask -TaskName $TaskName
    Start-Sleep -Seconds 3
    Write-Host "Task registered to run $Loop at sign-in and every 5 minutes (each new copy retires the older ones)."
    Show-Status
    return
}

if ($Uninstall) {
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue
    Get-WatchdogProcess | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
    Write-Host 'Watchdog task removed and loop stopped.'
    return
}

Show-Status
