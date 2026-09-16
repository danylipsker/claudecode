<#
.SYNOPSIS
  Safety net for the SOLIDWORKS Resource Monitor: kills sldProcMon.exe within five seconds of it
  appearing, so it can never sit at 100 % CPU again, even after a SOLIDWORKS update restores the
  executable that solidworks-quiet.ps1 renamed. Needs no administrator rights.

.DESCRIPTION
  -Install    registers a per-user scheduled task "SOLIDWORKS Resource Monitor watchdog" that runs
              this file (from where it is now) at every sign-in, and starts it right away. A
              PowerShell console may flash for a moment at sign-in; the loop then runs hidden.
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
    Write-Host ('Scheduled task : ' + $(if ($task) { "installed, state $($task.State)" } else { 'not installed' }))
    $wp = @(Get-WatchdogProcess)
    Write-Host ('Watchdog loop  : ' + $(if ($wp) { "running (PID $($wp[0].ProcessId))" } else { 'not running' }))
    if (Test-Path $Log) {
        Write-Host 'Last kills     :'
        Get-Content -LiteralPath $Log -Tail 5 | ForEach-Object { Write-Host "  $_" }
    } else {
        Write-Host 'Last kills     : none logged yet'
    }
}

if ($Run) {
    $mutex = New-Object System.Threading.Mutex($false, 'Local\SolidWorksQuietWatchdog')
    if (-not $mutex.WaitOne(0)) { return }   # another watchdog is already running
    while ($true) {
        try {
            foreach ($p in @(Get-Process -Name sldProcMon -ErrorAction SilentlyContinue)) {
                $started = try { $p.StartTime.ToString('HH:mm:ss') } catch { '?' }
                $cpu     = try { [math]::Round($p.CPU, 0) } catch { '?' }
                Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue
                if ((Test-Path $Log) -and (Get-Item $Log).Length -gt 200KB) {
                    Get-Content -LiteralPath $Log -Tail 100 | Set-Content -LiteralPath $Log
                }
                Add-Content -LiteralPath $Log -Value ('{0:yyyy-MM-dd HH:mm:ss}  killed sldProcMon.exe PID {1} (started {2}, {3} CPU-s)' -f (Get-Date), $p.Id, $started, $cpu)
            }
        } catch { }
        Start-Sleep -Seconds 5
    }
}

if ($Install) {
    $action    = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument ('-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "{0}" -Run' -f $PSCommandPath)
    $trigger   = New-ScheduledTaskTrigger -AtLogOn -User $User
    $settings  = New-ScheduledTaskSettingsSet -ExecutionTimeLimit ([TimeSpan]::Zero) -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -MultipleInstances IgnoreNew
    $principal = New-ScheduledTaskPrincipal -UserId $User -LogonType Interactive -RunLevel Limited
    Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Description ('Kills the SOLIDWORKS Resource Monitor (sldProcMon.exe) whenever it appears, because it spins one CPU core at 100 %. Runs {0}; run that script with -Uninstall to remove.' -f $PSCommandPath) -Force | Out-Null

    Start-ScheduledTask -TaskName $TaskName
    Start-Sleep -Seconds 3
    Write-Host "Task registered to run $PSCommandPath at sign-in."
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
