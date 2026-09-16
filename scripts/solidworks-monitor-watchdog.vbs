' SOLIDWORKS Resource Monitor watchdog loop (installed as a scheduled task by
' solidworks-monitor-watchdog.ps1 -Install; run that script for -Status / -Uninstall).
'
' Every 5 seconds: terminate every sldProcMon.exe, because the SOLIDWORKS 2020 build of it
' spins one CPU core at 100 %. Runs under wscript.exe, which has no console window, so it cannot
' be ended by the console-close events that killed the earlier PowerShell version of this loop.
'
' The task starts a new copy every 5 minutes. On start, a copy retires every older copy of itself
' (Task Scheduler's StopExisting cannot stop a window-less process), so exactly one loop runs and
' any copy that died for whatever reason is replaced within 5 minutes.
' Kills are appended to solidworks-watchdog.log next to this file.

Option Explicit

Dim fso, wmi, logPath, scriptName
Set fso = CreateObject("Scripting.FileSystemObject")
Set wmi = GetObject("winmgmts:\\.\root\cimv2")
logPath = fso.BuildPath(fso.GetParentFolderName(WScript.ScriptFullName), "solidworks-watchdog.log")
scriptName = fso.GetFileName(WScript.ScriptFullName)

Sub WriteLog(text)
    On Error Resume Next
    If fso.FileExists(logPath) Then
        If fso.GetFile(logPath).Size > 200000 Then TrimLog
    End If
    Dim f
    Set f = fso.OpenTextFile(logPath, 8, True)   ' 8 = append
    f.WriteLine Stamp() & "  " & text
    f.Close
End Sub

Sub TrimLog()
    On Error Resume Next
    Dim f, lines, i, keep, n
    Set f = fso.OpenTextFile(logPath, 1)
    lines = Split(f.ReadAll, vbCrLf)
    f.Close
    n = UBound(lines)
    keep = 100
    If n < keep Then Exit Sub
    Set f = fso.OpenTextFile(logPath, 2, True)   ' 2 = overwrite
    For i = n - keep To n
        If Len(lines(i)) > 0 Then f.WriteLine lines(i)
    Next
    f.Close
End Sub

Function Stamp()
    Dim d
    d = Now
    Stamp = Year(d) & "-" & Right("0" & Month(d), 2) & "-" & Right("0" & Day(d), 2) & " " & _
            Right("0" & Hour(d), 2) & ":" & Right("0" & Minute(d), 2) & ":" & Right("0" & Second(d), 2)
End Function

Function CpuSeconds(p)
    On Error Resume Next
    CpuSeconds = Round((CDbl(p.KernelModeTime) + CDbl(p.UserModeTime)) / 10000000, 0)
End Function

' Retire every other copy of this loop. This copy has just started, so it is the one with the
' newest CreationDate; every older wscript.exe running this script file is terminated.
Sub RetireOlderCopies()
    On Error Resume Next
    Dim q, p, newest, newestId
    newest = ""
    Set q = wmi.ExecQuery("SELECT ProcessId, CreationDate FROM Win32_Process WHERE Name = 'wscript.exe' AND CommandLine LIKE '%" & scriptName & "%'")
    For Each p In q
        If p.CreationDate > newest Then
            newest = p.CreationDate
            newestId = p.ProcessId
        End If
    Next
    For Each p In q
        If p.ProcessId <> newestId Then p.Terminate()
    Next
End Sub

RetireOlderCopies

Dim p, pid, cpu
Do
    On Error Resume Next
    For Each p In wmi.ExecQuery("SELECT ProcessId, KernelModeTime, UserModeTime FROM Win32_Process WHERE Name = 'sldProcMon.exe'")
        pid = p.ProcessId
        cpu = CpuSeconds(p)
        If p.Terminate() = 0 Then
            WriteLog "killed sldProcMon.exe PID " & pid & " (" & cpu & " CPU-s)"
        Else
            WriteLog "could not terminate sldProcMon.exe PID " & pid & " (error " & Err.Number & ")"
        End If
    Next
    On Error GoTo 0
    WScript.Sleep 5000
Loop
