Imports System.Xml
Imports System.Text
Imports Symbol.RFID3
Imports System.IO
Imports System.Reflection
Imports System.Net
Imports System.Collections.Generic
Imports Symbol.Fusion




Module Module1

    Public LastSavedTag As String

    Public Const SW_HIDE As Integer = 0

    Public Const SW_SHOWNORMAL As Integer = 1

    Public Const SW_SHOW As Integer = 5

    Public DeptList As List(Of ComboInfo) = Nothing

    Public InvList As List(Of ComboInfo) = Nothing

    Public PartList As List(Of ComboInfo) = Nothing

    Public CurrentINV As ComboInfo

    <System.Runtime.InteropServices.DllImport("coredll.dll")> _
    Public Function FindWindow(ByVal lpClassName As String, ByVal lpWindowName As String) As IntPtr
    End Function


    <System.Runtime.InteropServices.DllImport("coredll.dll")> _
    Public Function ShowWindow(ByVal hWnd As IntPtr, ByVal visible As Integer) As IntPtr
    End Function


    '[System.RuntiInteropServices.DllImport("coredll.dll", CharSet=System.RuntiInteropServices.CharSet.Auto)]

    'private static extern bool EnableWindow(IntPtr hwnd, bool enabled);

    Public MachineType As String
    Public MachineNUM As String
    Public FilterCode As String
    Public FilterNum As Integer
    Public UID As Guid
 

    Public ServiceURL As String = "http://192.168.1.90:8080/api/"
    'Public ServiceURL As String = "http://localhost:8080/api/"
    Public ClosePassword As String = "12345"

    Public GoodNet As String = "No"


    Public myScanSampleAPI As TERM_INV19.BarcodeAPI = Nothing


  Public m_ReaderAPI As RFIDReader
  Public m_ReaderMgmt As ReaderManagement

    Public Function IsGoodNet() As Boolean
        Return GoodNet.ToLower() = "yes"
    End Function


    Private Sub CheckWLAN()

        Dim myWlan As Symbol.Fusion.WLAN.WLAN
        Dim myAdapter As Symbol.Fusion.WLAN.Adapter
        Try
            myWlan = New Symbol.Fusion.WLAN.WLAN()
            Dim i As Integer
            Dim WLAN_ok As Boolean
            WLAN_ok = False

            For i = 0 To myWlan.Adapters.Length - 1
                myAdapter = myWlan.Adapters(i)


                If myAdapter.PowerState = Symbol.Fusion.WLAN.Adapter.PowerStates.ON Then
                    WLAN_ok = True
                End If
            Next

            If Not WLAN_ok Then
                For i = 0 To myWlan.Adapters.Length - 1
                    myAdapter = myWlan.Adapters(i)
                    Try
                        myAdapter.PowerState = Symbol.Fusion.WLAN.Adapter.PowerStates.ON
                    Catch ex As Exception

                    End Try
                Next
                Dim cnt As Integer
                cnt = 0
                WLAN_ok = False
                While cnt < 10 And WLAN_ok = False
                    System.Threading.Thread.Sleep(2000)
                    Application.DoEvents()

                    For i = 0 To myWlan.Adapters.Length - 1
                        myAdapter = myWlan.Adapters(i)
                        If myAdapter.PowerState = Symbol.Fusion.WLAN.Adapter.PowerStates.ON Then
                            WLAN_ok = True
                            Exit For
                        End If
                    Next
                    cnt = cnt + 1
                End While



            End If
            myWlan.Dispose()
        Catch ex As Exception

        End Try

    End Sub

    Public Sub RestartWLAN()

        Dim myWlan As Symbol.Fusion.WLAN.WLAN
        Dim myAdapter As Symbol.Fusion.WLAN.Adapter
        Try
            myWlan = New Symbol.Fusion.WLAN.WLAN()
            Dim i As Integer
            Dim cnt As Integer
            
            For i = 0 To myWlan.Adapters.Length - 1
                myAdapter = myWlan.Adapters(i)
                If myAdapter.PowerState = Symbol.Fusion.WLAN.Adapter.PowerStates.ON Then
                    myAdapter.PowerState = Symbol.Fusion.WLAN.Adapter.PowerStates.OFF
                    System.Threading.Thread.Sleep(100)
                    Application.DoEvents()
                End If
            Next
            For i = 0 To myWlan.Adapters.Length - 1
                myAdapter = myWlan.Adapters(i)
                Try
                    myAdapter.PowerState = Symbol.Fusion.WLAN.Adapter.PowerStates.ON
                Catch ex As Exception

                End Try
            Next
            Dim WLAN_ok As Boolean
            WLAN_ok = False
            While cnt < 10 And WLAN_ok = False
                System.Threading.Thread.Sleep(2000)
                Application.DoEvents()

                For i = 0 To myWlan.Adapters.Length - 1
                    myAdapter = myWlan.Adapters(i)
                    If myAdapter.PowerState = Symbol.Fusion.WLAN.Adapter.PowerStates.ON Then
                        WLAN_ok = True
                        Exit For
                    End If
                Next
                cnt = cnt + 1
            End While

            myWlan.Dispose()
        Catch ex As Exception

        End Try

    End Sub

Public Sub WakeUp()
        CheckWLAN()
        'Dim disp As Symbol.Display.StandardDisplay = Nothing
        'Dim dev As Symbol.Display.Device = Nothing
        'Dim i As Integer
        'For i = 0 To Symbol.Display.Device.AvailableDevices.Count - 1
        '    Try
        '        dev = CType(Symbol.Display.Device.AvailableDevices(i), Symbol.Display.Device)
        '        Exit For
        '    Catch ex As Exception
        '        dev = Nothing
        '    End Try
        'Next
        'If Not dev Is Nothing Then
        '    disp = New Symbol.Display.StandardDisplay(dev)
        '    If Not disp Is Nothing Then
        '        disp.BacklightState = Symbol.Display.BacklightState.ON
        '    End If
        'End If


End Sub


Public Function IsOn() As Boolean
        'Dim disp As Symbol.Display.StandardDisplay = Nothing
        ' Dim dev As Symbol.Display.Device = Nothing
        ' Dim i As Integer
        'For i = 0 To Symbol.Display.Device.AvailableDevices.Count - 1
        '  Try
        '    dev = CType(Symbol.Display.Device.AvailableDevices(i), Symbol.Display.Device)
        '    Exit For
        '  Catch ex As Exception
        '    dev = Nothing
        '  End Try
        'Next
        'If Not dev Is Nothing Then
        '  disp = New Symbol.Display.StandardDisplay(dev)
        '  If Not disp Is Nothing Then
        '    Return disp.BacklightState = Symbol.Display.BacklightState.ON
        '  End If
        'End If
            Return True
End Function

Public Sub StartReadTags()
  Try
    If (m_ReaderAPI.Actions.TagAccess.OperationSequence.Length > 0) Then
        m_ReaderAPI.Actions.TagAccess.OperationSequence.PerformSequence()
    Else
      Try
        m_ReaderAPI.Actions.PurgeTags()
      Catch ex As Exception

      End Try
      Try
        m_ReaderAPI.Actions.Inventory.Perform()
      Catch ex As Exception

      End Try

    End If
  Catch ioe As InvalidOperationException
    'notifyUser(("InvalidOperationException" & ioe.Message), "Read Operation")
  Catch ex As OperationFailureException
    'notifyUser(("OperationFailureException:" & ex.VendorMessage), "Read Operation")
  Catch iue As InvalidUsageException
    'notifyUser(("InvalidUsageException:" & iue.Info), "Read Operation")
  Catch ex As Exception
    'notifyUser(("Exception:" & ex.Message), "Read Operation")
  End Try
  System.Threading.Thread.Sleep(100)
End Sub


    Public Sub StopReadingTags()

        Try
            If (m_ReaderAPI.Actions.TagAccess.OperationSequence.Length > 0) Then
                m_ReaderAPI.Actions.TagAccess.OperationSequence.StopSequence()
            Else
                m_ReaderAPI.Actions.Inventory.Stop()
            End If
        Catch ioe As InvalidOperationException
            'notifyUser(("InvalidOperationException" & ioe.Message), "Stop Operation")
        Catch ofe As OperationFailureException
            'notifyUser(("OperationFailureException:" & ofe.VendorMessage), "Stop Read")
        Catch iue As InvalidUsageException
            'notifyUser(("InvalidUsageException:" & iue.Info), "Stop Read")
        Catch ex As Exception
            'notifyUser(("Exception:" & ex.Message), "Stop Read")
        End Try
    End Sub
    'Public Function PackFilter(ByVal LBL As String, ByVal FilterID As ULong) As String
    '    Dim TagID As String
    '    Dim fStr As String
    '    fStr = Hex(FilterID)
    '    While (fStr.Length < 10)
    '        fStr = "0" + fStr
    '    End While
    '    TagID = LBL.Substring(0, 12) + fStr
    '    TagID = TagID + Calc24(TagID)
    '    Return TagID
    'End Function

    'Public Function Calc12(ByVal LBL As String) As String
    '    Dim TagID As String
    '    Dim hh As String
    '    Dim s As Int32
    '    TagID = LBL.Substring(0, 10)
    '    s = 0
    '    For i = 0 To 8 Step 2
    '        hh = TagID.Substring(i, 2)
    '        s = s + Byte.Parse(hh, Globalization.NumberStyles.HexNumber)
    '        s = s And &HFF
    '    Next

    '    If s < &HAA Then
    '        s = &HAA - s
    '    Else
    '        s = &HAA + 256 - s
    '    End If

    '    s = s And &HFF

    '    hh = Hex(s)
    '    If hh.Length < 2 Then
    '        hh = "0" + hh
    '    End If
    '    Return hh
    'End Function

    'Public Function Calc24(ByVal LBL As String) As String
    '    Dim TagID As String
    '    Dim hh As String
    '    Dim s As Int32
    '    TagID = LBL.Substring(0, 22)
    '    s = 0
    '    For i = 0 To 20 Step 2
    '        hh = TagID.Substring(i, 2)
    '        s = s + Byte.Parse(hh, Globalization.NumberStyles.HexNumber)
    '        s = s And &HFF
    '    Next

    '    If s < &H55 Then
    '        s = &H55 - s
    '    Else
    '        s = &H55 + 256 - s
    '    End If
    '    s = s And &HFF
    '    hh = Hex(s)
    '    If hh.Length < 2 Then
    '        hh = "0" + hh
    '    End If
    '    Return hh
    'End Function


    Public Function FileIsLocked() As Boolean
        'Dim strAppDir As String = Path.GetDirectoryName( _
        'Assembly.GetExecutingAssembly().GetName().CodeBase)
        'Dim strFullPathToMyFile As String = Path.Combine(strAppDir, "CMConfig.xml")
        Dim strFullPathToMyFile As String = "\FRTTPACKConfig.xml"
        Dim isLocked As Boolean = False
        Dim fileObj As System.IO.FileStream = Nothing

        Try
            fileObj = New System.IO.FileStream( _
                                strFullPathToMyFile, _
                                System.IO.FileMode.Open, _
                                System.IO.FileAccess.ReadWrite, _
                                System.IO.FileShare.None)
        Catch
            isLocked = True
        Finally
            If fileObj IsNot Nothing Then
                fileObj.Close()
            End If
        End Try
        Return isLocked
    End Function

    Public LockFileObj As System.IO.FileStream

    Public Function FileLock() As Boolean
        'Dim strAppDir As String = Path.GetDirectoryName( _
        'Assembly.GetExecutingAssembly().GetName().CodeBase)
        'Dim strFullPathToMyFile As String = Path.Combine(strAppDir, "CMConfig.xml")
        Dim strFullPathToMyFile As String = "\FRTTPACKConfig.xml"
        Try
            LockFileObj = New System.IO.FileStream( _
                                strFullPathToMyFile, _
                                System.IO.FileMode.Open, _
                                System.IO.FileAccess.ReadWrite, _
                                System.IO.FileShare.None)
        Catch
            Return False
        End Try
        Return True
    End Function

    Public Sub FileUnLock()
        Try
            If LockFileObj IsNot Nothing Then
                LockFileObj.Close()
                LockFileObj = Nothing
            End If

        Catch ex As Exception

        End Try

    End Sub

    

 
End Module
