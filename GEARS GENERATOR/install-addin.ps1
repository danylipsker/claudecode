<#
Installs (or removes) the GEARS GENERATOR SolidWorks add-in MACHINE-WIDE --
the registration SolidWorks' Tools > Add-Ins list reads. Needs administrator
rights: run it from any PowerShell (elevated or not) and it re-launches
itself elevated, so Windows shows one UAC prompt. Then start SolidWorks
(2020 ... 2026): GEARS GENERATOR is pre-checked in Tools > Add-Ins and opens
as a Task Pane -- the gear icon on the right -- with the generator on top and
the LIBRARY of created parts and assemblies underneath, ready to drag.

    .\install-addin.ps1              register the add-in (build it first: GearGen.SolidWorksAddin, x64)
    .\install-addin.ps1 -Uninstall   remove the registration

What it does: RegAsm.exe <dll> /codebase (no type library: SolidWorks finds
the add-in by its CLSID and ProgID, and the WPF types the panel uses have no
place in a TLB), which also runs the add-in's own [ComRegisterFunction] that
writes HKLM\SOFTWARE\SolidWorks\AddIns\{guid} (the listing) and AddInsStartup
(pre-checked). It then reads those keys back and says whether they are there.
The DLL stays where it was built; rebuilding it needs no re-registration.
#>
param(
    [switch]$Uninstall,
    [string]$DllPath = "$PSScriptRoot\src\GearGen.SolidWorksAddin\bin\x64\Debug\net48\GearGen.SolidWorksAddin.dll"
)

# every line this script prints also goes to install-addin.log next to it, from both halves
$logFile = Join-Path $PSScriptRoot "install-addin.log"
function Say([string]$text) { Write-Host $text; try { Add-Content -Path $logFile -Value ("{0}  {1}" -f (Get-Date -Format "HH:mm:ss"), $text) } catch { } }

$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
Say ("started (elevated: $isAdmin, PowerShell $($PSVersionTable.PSVersion), user $env:USERNAME)")
if (-not $isAdmin) {
    Say "Registering the add-in machine-wide needs administrator rights: asking Windows to elevate (one UAC prompt)..."
    $relaunch = @("-NoProfile", "-ExecutionPolicy", "Bypass", "-File", "`"$PSCommandPath`"", "-DllPath", "`"$DllPath`"")
    if ($Uninstall) { $relaunch += "-Uninstall" }
    try {
        $p = Start-Process -FilePath "powershell.exe" -ArgumentList $relaunch -Verb RunAs -Wait -PassThru
        if ($p.ExitCode -eq 0) { Say "Done. Start SolidWorks: GEARS GENERATOR is in Tools > Add-Ins and opens as a Task Pane." }
        else { Say "The elevated step reported exit code $($p.ExitCode) -- see its window and install-addin.log." }
        exit $p.ExitCode
    }
    catch {
        Say "Elevation was declined or failed: $($_.Exception.Message)"
        exit 1
    }
}

# ---- elevated from here on
$regasm = "C:\Windows\Microsoft.NET\Framework64\v4.0.30319\RegAsm.exe"
$guid = "{A3D4E5F6-1B2C-4D3E-9F8A-7C6B5A4D3E2F}"
$exit = 0
try {
    if (-not (Test-Path $regasm)) { throw "RegAsm.exe not found at $regasm (64-bit .NET Framework 4.x is needed)" }
    if (-not (Test-Path $DllPath)) { throw "Add-in not found: $DllPath -- build GearGen.SolidWorksAddin (x64) first" }
    $DllPath = (Resolve-Path $DllPath).Path
    if ($Uninstall) {
        Say "Unregistering $DllPath"
        & $regasm $DllPath /unregister 2>&1 | ForEach-Object { Say "  $_" }
        foreach ($k in @("HKLM:\SOFTWARE\SolidWorks\AddIns\$guid", "HKLM:\SOFTWARE\SolidWorks\AddInsStartup\$guid")) {
            if (Test-Path $k) { Remove-Item -Path $k -Recurse -Force }
        }
        Say "Removed. SolidWorks will no longer list GEARS GENERATOR."
    }
    else {
        Say "Registering $DllPath"
        & $regasm $DllPath /codebase 2>&1 | ForEach-Object { Say "  $_" }
        if ($LASTEXITCODE -ne 0) { throw "RegAsm exited with $LASTEXITCODE" }
        # the values SolidWorks' own add-in template writes (its loader skips an
        # AddIns entry without the (Default) DWORD), whatever the DLL's own
        # registration function did
        $listingKey = "HKLM:\SOFTWARE\SolidWorks\AddIns\$guid"
        New-Item -Path $listingKey -Force | Out-Null
        Set-ItemProperty -Path $listingKey -Name "(Default)" -Value 0 -Type DWord
        Set-ItemProperty -Path $listingKey -Name "Title" -Value "GEARS GENERATOR"
        Set-ItemProperty -Path $listingKey -Name "Description" -Value "23 gear families on exact geometry -- meshing sets as parts or assemblies, dragged in from the Task Pane"
        $startupKey = "HKCU:\Software\SolidWorks\AddInsStartup\$guid"
        New-Item -Path $startupKey -Force | Out-Null
        Set-ItemProperty -Path $startupKey -Name "(Default)" -Value 1 -Type DWord
        # the Task Pane host is created by SolidWorks as an ActiveX control: the
        # Control / MiscStatus / Version keys RegAsm does not write
        $hostGuid = "{6C6F0D3E-6E0B-4B9E-9C7D-6B6E9F4B2A11}"
        $hostKey = "HKLM:\SOFTWARE\Classes\CLSID\$hostGuid"
        if (Test-Path $hostKey) {
            foreach ($sub in "Control", "MiscStatus", "Version") { New-Item -Path "$hostKey\$sub" -Force | Out-Null }
            Set-ItemProperty -Path "$hostKey\MiscStatus" -Name "(Default)" -Value "0"
            Set-ItemProperty -Path "$hostKey\Version" -Name "(Default)" -Value "1.0"
            Say "Task Pane host registered as an ActiveX control"
        } else { Say "WARNING: the Task Pane host's CLSID was not registered by RegAsm ($hostKey)" }
        $listing = (Test-Path $listingKey) -and ((Get-ItemProperty $listingKey).'(default)' -is [int])
        $startup = Test-Path $startupKey
        $clsid = Test-Path "Registry::HKEY_CLASSES_ROOT\CLSID\$guid\InprocServer32"
        Say " "
        Say ("Tools > Add-Ins listing key : " + $(if ($listing) { "present" } else { "MISSING" }))
        Say ("pre-checked at startup (user): " + $(if ($startup) { "present" } else { "MISSING" }))
        Say ("COM class (CLSID) registered : " + $(if ($clsid) { "present" } else { "MISSING" }))
        if (-not ($listing -and $startup -and $clsid)) { throw "registration incomplete" }
        Say " "
        Say "Done. Start SolidWorks: GEARS GENERATOR is pre-checked in Tools > Add-Ins and opens as a Task Pane."
    }
}
catch {
    Say "FAILED: $($_.Exception.Message)"
    $exit = 1
}
if ($Host.Name -eq "ConsoleHost") { Say " "; Say "Press Enter to close this window."; [void](Read-Host) }
exit $exit
