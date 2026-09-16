<#
.SYNOPSIS
  Safety net for the SOLIDWORKS Resource Monitor: kills sldProcMon.exe within five seconds of it
  appearing, so it can never sit at 100 % CPU again, even after a SOLIDWORKS update restores the
  executable that solidworks-quiet.ps1 renamed. Needs no administrator rights.

.DESCRIPTION
  -Install    registers a per-user scheduled task "SOLIDWORKS Resource Monitor watchdog" that runs
              this file (from where it is now) at every sign-in, and starts it right away. A
              PowerShell console may flash for a moment at sign-in; the loop then runs hidden.
              The task also re-launches the loop every 10 minutes if it is not running (verified:
              a killed loop came back on the next tick), so a killed loop comes back on its own.
              The restart-on-failure setting only covers failed launches, not a killed loop.
              Keep this file where it is; moving it breaks the task (re-run -Install after moving).
  -Uninstall  removes the task and stops the watchdog.
  -Status     shows whether the task exists and the watchdog is running, plus the last kills.
  -Run        the watchdog loop itself (used by the scheduled task).

  Idle cost: one Get-Process call every 5 seconds, no measurable CPU. Every kill is written to
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
    [switch]$Status,
    [switch]$Run
)

$ErrorActionPreference = 'Stop'

$TaskName = 'SOLIDWORKS Resource Monitor watchdog'
$Log      = Join-Path $PSScriptRoot 'solidworks-watchdog.log'
$User     = "$env:USERDOMAIN\$env:USERNAME"

function Get-WatchdogProcess {
    Get-CimInstance Win32_Process -Filter "Name='powershell.exe' OR Name='pwsh.exe'" |
        Where-Object { $_.CommandLine -match 'solidworks-monitor-watchdog\.ps1' -and $_.CommandLine -match '-Run' }
}

function Show-Status {
    $task = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
    Write-Host ('Scheduled task : ' + $(if ($task) { "installed, state $($task.State), $($task.Triggers.Count) triggers" } else { 'not installed' }))
    $wp = @(Get-WatchdogProcess)
    Write-Host ('Watchdog loop  : ' + $(if ($wp) { "running (PID $($wp[0].ProcessId))" } else { 'not running' }))
    if (Test-Path $Log) {
        Write-Host 'Last entries   :'
        Get-Content -LiteralPath $Log -Tail 5 | ForEach-Object { Write-Host "  $_" }
    } else {
        Write-Host 'Last entries   : none logged yet'
    }
}

function Write-Log([string]$text) {
    if ((Test-Path $Log) -and (Get-Item $Log).Length -gt 200KB) {
        Get-Content -LiteralPath $Log -Tail 100 | Set-Content -LiteralPath $Log
    }
    Add-Content -LiteralPath $Log -Value ('{0:yyyy-MM-dd HH:mm:ss}  {1}' -f (Get-Date), $text)
}

if ($Run) {
    $mutex = New-Object System.Threading.Mutex($false, 'Local\SolidWorksQuietWatchdog')
    if (-not $mutex.WaitOne(0)) { return }   # another watchdog is already running
    try { [Console]::TreatControlCAsInput = $true } catch { }   # stray Ctrl+C must not end the loop
    Write-Log "watchdog started (PID $PID)"
    while ($true) {
        try {
            foreach ($p in @(Get-Process -Name sldProcMon -ErrorAction SilentlyContinue)) {
                $started = try { $p.StartTime.ToString('HH:mm:ss') } catch { '?' }
                $cpu     = try { [math]::Round($p.CPU, 0) } catch { '?' }
                Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue
                Write-Log "killed sldProcMon.exe PID $($p.Id) (started $started, $cpu CPU-s)"
            }
        } catch { }
        Start-Sleep -Seconds 5
    }
}

if ($Install) {
    $action     = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument ('-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "{0}" -Run' -f $PSCommandPath)
    $atLogon    = New-ScheduledTaskTrigger -AtLogOn -User $User
    # daily trigger that repeats every 10 minutes for the whole day = "every 10 minutes, forever"
    # (an unbounded RepetitionDuration is rejected by Task Scheduler on this Windows build)
    $every10min = New-ScheduledTaskTrigger -Daily -At '00:00'
    $every10min.Repetition = (New-ScheduledTaskTrigger -Once -At '00:00' -RepetitionInterval (New-TimeSpan -Minutes 10) -RepetitionDuration (New-TimeSpan -Days 1)).Repetition
    $settings   = New-ScheduledTaskSettingsSet -ExecutionTimeLimit ([TimeSpan]::Zero) -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -MultipleInstances IgnoreNew -RestartCount 99 -RestartInterval (New-TimeSpan -Minutes 1)
    $principal  = New-ScheduledTaskPrincipal -UserId $User -LogonType Interactive -RunLevel Limited
    Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger @($atLogon, $every10min) -Settings $settings -Principal $principal -Description ('Kills the SOLIDWORKS Resource Monitor (sldProcMon.exe) whenever it appears, because it spins one CPU core at 100 %. Runs {0}; run that script with -Uninstall to remove.' -f $PSCommandPath) -Force | Out-Null

    Start-ScheduledTask -TaskName $TaskName
    Start-Sleep -Seconds 3
    Write-Host "Task registered to run $PSCommandPath at sign-in and every 10 minutes if not already running."
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
