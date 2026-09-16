<#
.SYNOPSIS
  Silence the SOLIDWORKS Resource Monitor (sldProcMon.exe) in every installed SOLIDWORKS version
  and stop the SOLIDWORKS Background Downloader from autostarting. -Undo reverses both.
  -List shows the current state without changing anything.

.DESCRIPTION
  The Resource Monitor is a tray helper that SOLIDWORKS launches when it starts and that keeps
  running after SOLIDWORKS closes. It only shows warnings about low memory, low disk space and
  uncertified graphics drivers. The SOLIDWORKS 2020 build of it spins one CPU core at 100 % on
  this Windows 11 machine, so this script renames the executable to sldProcMon.exe.disabled.
  SOLIDWORKS starts and works normally without it.

  The Background Downloader (sldBgDwld.exe) is started from the machine-wide Startup folder at
  every sign-in. Its Task Manager > Startup apps state lives under HKLM, so disabling it also
  needs administrator rights. This script writes the same "Disabled" value Task Manager writes.

  Renaming files under C:\Program Files and writing HKLM need administrator rights, so the script
  re-launches itself elevated (Windows shows a UAC prompt) and reports in the new window.

  A SOLIDWORKS service-pack update or repair puts sldProcMon.exe back; just run the script again.
  Nothing is ever deleted: disabling is a rename, -Undo is the rename in reverse.

.EXAMPLE
  powershell -NoProfile -ExecutionPolicy Bypass -File .\solidworks-quiet.ps1          # disable
  powershell -NoProfile -ExecutionPolicy Bypass -File .\solidworks-quiet.ps1 -Undo    # restore
  powershell -NoProfile -ExecutionPolicy Bypass -File .\solidworks-quiet.ps1 -List    # dry run
#>
[CmdletBinding()]
param(
    [switch]$Undo,
    [switch]$List
)

$ErrorActionPreference = 'Stop'

$StartupApprovedKey = 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\StartupApproved\StartupFolder'
$DownloaderLnkName  = 'SOLIDWORKS Background Downloader.lnk'
$DownloaderLnkPath  = Join-Path $env:ProgramData "Microsoft\Windows\Start Menu\Programs\StartUp\$DownloaderLnkName"

function Get-MonitorDirs {
    Get-ChildItem 'C:\Program Files' -Directory -Filter 'SOLIDWORKS Corp*' |
        Get-ChildItem -Recurse -Depth 1 -File -Filter 'sldProcMon.exe*' |
        Group-Object DirectoryName |
        ForEach-Object {
            $dir = $_.Name
            $vi  = (Get-Item $_.Group[0].FullName).VersionInfo
            [pscustomobject]@{
                Dir      = $dir
                Version  = "$($vi.ProductName) $($vi.FileVersion)".Trim()
                Enabled  = Test-Path (Join-Path $dir 'sldProcMon.exe')
                Disabled = Test-Path (Join-Path $dir 'sldProcMon.exe.disabled')
            }
        }
}

function Get-DownloaderAutostart {
    # $true = enabled (or no override recorded), $false = disabled, $null = shortcut not installed
    if (-not (Test-Path $DownloaderLnkPath)) { return $null }
    $v = (Get-ItemProperty -Path $StartupApprovedKey -Name $DownloaderLnkName -ErrorAction SilentlyContinue).$DownloaderLnkName
    if ($null -eq $v) { return $true }
    return ($v[0] -ne 3)
}

$dirs = @(Get-MonitorDirs)

if ($List) {
    if (-not $dirs) { Write-Host 'No sldProcMon.exe found under C:\Program Files\SOLIDWORKS Corp*' }
    foreach ($d in $dirs) {
        $state = if ($d.Enabled) { 'ENABLED ' } else { 'disabled' }
        Write-Host ("{0}  {1,-40} {2}" -f $state, $d.Version, $d.Dir)
    }
    $auto = Get-DownloaderAutostart
    $txt = if ($null -eq $auto) { 'not installed' } elseif ($auto) { 'ENABLED ' } else { 'disabled' }
    Write-Host ("{0}  SOLIDWORKS Background Downloader autostart" -f $txt)
    return
}

$principal = [Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()
if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    $argList = @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-NoExit', '-File', ('"{0}"' -f $PSCommandPath))
    if ($Undo) { $argList += '-Undo' }
    Start-Process -FilePath (Get-Process -Id $PID).Path -Verb RunAs -ArgumentList $argList -Wait
    Write-Host 'Re-launched with administrator rights; results were shown in the elevated window.'
    return
}

# ---- Resource Monitor executables -------------------------------------------------------------
$running = @(Get-Process sldProcMon -ErrorAction SilentlyContinue)
if ($running) {
    $running | Stop-Process -Force
    Start-Sleep -Seconds 1
    Write-Host "Stopped $($running.Count) running Resource Monitor process(es)."
}

if (-not $dirs) { Write-Host 'No sldProcMon.exe found under C:\Program Files\SOLIDWORKS Corp*' }
foreach ($d in $dirs) {
    $exe = Join-Path $d.Dir 'sldProcMon.exe'
    $off = Join-Path $d.Dir 'sldProcMon.exe.disabled'
    if ($Undo) {
        if ($d.Enabled) {
            Write-Host ("Already enabled : {0,-40} {1}" -f $d.Version, $d.Dir)
        } else {
            Move-Item -LiteralPath $off -Destination $exe
            Write-Host ("Restored        : {0,-40} {1}" -f $d.Version, $d.Dir)
        }
    } else {
        if ($d.Enabled) {
            # -Force overwrites a stale .disabled copy left by an earlier run (after an update/repair)
            Move-Item -LiteralPath $exe -Destination $off -Force
            Write-Host ("Disabled        : {0,-40} {1}" -f $d.Version, $d.Dir)
        } else {
            Write-Host ("Already disabled: {0,-40} {1}" -f $d.Version, $d.Dir)
        }
    }
}

# ---- Background Downloader autostart (same value Task Manager > Startup apps writes) -----------
if (Test-Path $DownloaderLnkPath) {
    if (-not (Test-Path $StartupApprovedKey)) { New-Item -Path $StartupApprovedKey -Force | Out-Null }
    if ($Undo) {
        $bytes = [byte[]](2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
    } else {
        $bytes = [byte[]](3, 0, 0, 0) + [BitConverter]::GetBytes([DateTime]::Now.ToFileTime())
        Get-Process sldBgDwld -ErrorAction SilentlyContinue | Stop-Process -Force
    }
    New-ItemProperty -Path $StartupApprovedKey -Name $DownloaderLnkName -Value $bytes -PropertyType Binary -Force | Out-Null
    Write-Host ("{0}        : SOLIDWORKS Background Downloader autostart (Task Manager > Startup apps)" -f $(if ($Undo) { 'Enabled ' } else { 'Disabled' }))
} else {
    Write-Host 'Background Downloader startup shortcut not present; nothing to do there.'
}

Write-Host ''
if ($Undo) {
    Write-Host 'Done. SOLIDWORKS will launch the Resource Monitor again the next time it starts, and the Background Downloader autostarts at sign-in.'
} else {
    Write-Host 'Done. SOLIDWORKS will no longer launch the Resource Monitor, and the Background Downloader no longer autostarts. Run with -Undo to restore.'
}
Write-Host 'You can close this window.'
