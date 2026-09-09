<#
Registers the GEARS GENERATOR SolidWorks add-in for the CURRENT USER ONLY
(writes to HKCU\Software\Classes and HKCU\Software\SolidWorks, not HKLM) --
this works without administrator rights, which regasm's default (machine-wide)
registration does not. Windows merges HKCU\Software\Classes into the effective
HKEY_CLASSES_ROOT view for this user, so COM activation (CoCreateInstance /
Type.GetTypeFromProgID) works exactly the same as a machine-wide install would,
just scoped to this Windows account -- confirmed directly (Activator.CreateInstance
on the ProgID succeeds standalone, with no SolidWorks involved at all).

That COM-activation guarantee does NOT necessarily extend to SolidWorks' own
Tools > Add-Ins list, though: that dialog is populated by SolidWorks' own
(undocumented) scan of HKCU:\Software\SolidWorks\AddIns / AddInsStartup, which
is separate application logic Windows' HKCU->HKCR merging has no say over. In
this environment's testing, a correctly-registered HKCU add-in (verified: right
key name, right values, right CodeBase, and the class itself proven COM-
activatable) still did not appear in that dialog on SOLIDWORKS 2025/2026 --
consistent with (but not proven to be caused by) this SolidWorks version
requiring HKLM registration for the *listing* specifically, separate from
COM activation. If you hit the same thing: try the elevated path below and
see whether it shows up there -- that's the next real test, not yet run here
(no admin rights in this environment).

Re-run this any time you rebuild the add-in (paths/versions don't change
across a rebuild, but re-running is always safe / idempotent).

If you'd rather install it machine-wide for all users instead (or if per-user
registration doesn't make it appear in Tools > Add-Ins -- see above), run this
instead from an elevated (Run as Administrator) prompt:
    & "C:\Windows\Microsoft.NET\Framework64\v4.0.30319\RegAsm.exe" `
        "<repo>\src\GearGen.SolidWorksAddin\bin\x64\Debug\net48\GearGen.SolidWorksAddin.dll" /codebase /tlb
#>
param(
    # The project builds x64-only (PlatformTarget=x64 in the .csproj, since
    # SolidWorks 2020+ is 64-bit-only) -- MSBuild's real output therefore
    # lands under bin\x64\..., NOT the platform-less bin\Debug\... path an
    # AnyCPU project would use. A stale bin\Debug\net48\...dll can be left
    # over from before PlatformTarget was set (or from an IDE/tooling
    # artifact) and, since this script's own Test-Path check only verifies
    # SOME file exists at $DllPath, it will silently register THAT stale
    # copy without error -- found by checking what CodeBase actually got
    # written to the registry (HKCU:\Software\Classes\CLSID\{guid}\
    # InprocServer32) and comparing timestamps against the real build
    # output, not by assuming the default was right.
    [string]$DllPath = "$PSScriptRoot\src\GearGen.SolidWorksAddin\bin\x64\Debug\net48\GearGen.SolidWorksAddin.dll"
)

if (-not (Test-Path $DllPath)) {
    Write-Error "Not found: $DllPath -- build the GearGen.SolidWorksAddin project first."
    exit 1
}
$DllPath = (Resolve-Path $DllPath).Path

Add-Type -Path $DllPath
$asm = [System.Reflection.Assembly]::LoadFrom($DllPath)
$asmName = $asm.GetName()
$asmQualifiedName = "$($asmName.Name), Version=$($asmName.Version), Culture=neutral, PublicKeyToken=null"
$codeBase = "file:///" + ($DllPath -replace '\\', '/')

function Register-ComClass {
    param([string]$ClassFullName, [string]$ProgId)

    $type = $asm.GetType($ClassFullName)
    if (-not $type) { throw "Type not found in assembly: $ClassFullName" }
    $clsid = $type.GUID.ToString("B").ToUpperInvariant()

    $clsidKey = "HKCU:\Software\Classes\CLSID\$clsid"
    New-Item -Path $clsidKey -Force | Out-Null
    Set-ItemProperty -Path $clsidKey -Name "(Default)" -Value $ClassFullName

    $inproc = "$clsidKey\InprocServer32"
    New-Item -Path $inproc -Force | Out-Null
    Set-ItemProperty -Path $inproc -Name "(Default)" -Value "mscoree.dll"
    Set-ItemProperty -Path $inproc -Name "ThreadingModel" -Value "Both"
    Set-ItemProperty -Path $inproc -Name "Class" -Value $ClassFullName
    Set-ItemProperty -Path $inproc -Name "Assembly" -Value $asmQualifiedName
    Set-ItemProperty -Path $inproc -Name "RuntimeVersion" -Value "v4.0.30319"
    Set-ItemProperty -Path $inproc -Name "CodeBase" -Value $codeBase

    $progIdKey = "$clsidKey\ProgId"
    New-Item -Path $progIdKey -Force | Out-Null
    Set-ItemProperty -Path $progIdKey -Name "(Default)" -Value $ProgId

    $progIdRoot = "HKCU:\Software\Classes\$ProgId"
    New-Item -Path $progIdRoot -Force | Out-Null
    Set-ItemProperty -Path $progIdRoot -Name "(Default)" -Value $ClassFullName
    New-Item -Path "$progIdRoot\CLSID" -Force | Out-Null
    Set-ItemProperty -Path "$progIdRoot\CLSID" -Name "(Default)" -Value $clsid

    # Write-Host, NOT Write-Output: this function's return value is CAPTURED
    # by its caller ($addinClsid = Register-ComClass ...) -- Write-Output
    # here would silently join itself onto that capture (PowerShell folds a
    # function's entire output stream into the assignment, not just its
    # `return` value), turning $addinClsid into a 2-element array. String-
    # interpolating an array joins its elements with spaces, so the
    # AddIns/AddInsStartup keys built from it below got a garbled, wrong
    # name ("Registered GearGen.SolidWorksAddin.SwAddin -> {guid} {guid}")
    # instead of the clean {guid} SolidWorks actually looks for -- which is
    # why the add-in never appeared in Tools > Add-Ins at all, not just
    # failed to auto-load. Found by listing what key names actually got
    # created, not by assuming the script's own "Done" success message meant
    # it worked.
    Write-Host "Registered $ProgId -> $clsid"
    return $clsid
}

$addinClsid = Register-ComClass -ClassFullName "GearGen.SolidWorksAddin.SwAddin" -ProgId "GearGen.SolidWorksAddin.SwAddin"
Register-ComClass -ClassFullName "GearGen.SolidWorksAddin.GearPanelHost" -ProgId "GearGen.SolidWorksAddin.GearPanelHost" | Out-Null

# SolidWorks-specific: this is what makes it show up in Tools > Add-Ins.
# (Equivalent of what SwAddin's [ComRegisterFunction] would do under regasm.)
$addInsKey = "HKCU:\Software\SolidWorks\AddIns\$addinClsid"
New-Item -Path $addInsKey -Force | Out-Null
Set-ItemProperty -Path $addInsKey -Name "Title" -Value "GEARS GENERATOR"
Set-ItemProperty -Path $addInsKey -Name "Description" -Value "Parametric involute spur gears -- exact geometry, STEP/DXF/SolidWorks"

$startupKey = "HKCU:\Software\SolidWorks\AddInsStartup\$addinClsid"
New-Item -Path $startupKey -Force | Out-Null
Set-ItemProperty -Path $startupKey -Name "(Default)" -Value 1 -Type DWord

Write-Output ""
Write-Output "Done. Restart SolidWorks -- GEARS GENERATOR will be checked in Tools > Add-Ins"
Write-Output "(pre-enabled for next startup) and its panel will open as a Task Pane."
