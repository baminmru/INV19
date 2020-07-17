Imports Newtonsoft.Json
Imports System.Net
Imports System.Text
Imports System.IO


Public Class frmOpMove

    Private Sub MenuItem1_Click(ByVal sender As System.Object, ByVal e As System.EventArgs)
        Me.DialogResult = Windows.Forms.DialogResult.Cancel
        Me.Close()
    End Sub

    Private Sub Clear()
        txtCellCode.Text = ""
        txtToCellCode.Text = ""
        txtItem.Text = ""

        txtCellCode.Tag = ""
        txtToCellCode.Tag = ""
        txtItem.Tag = ""

    End Sub

    Private Sub MenuItem2_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles MenuItem2.Click
        Clear()
    End Sub

    Private Sub MenuItem1_Click_1(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles MenuItem1.Click
        Me.DialogResult = Windows.Forms.DialogResult.Cancel
        Me.Close()
    End Sub

    Private Sub cmdProcess_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles cmdProcess.Click
        'If NumQ.Value <= 0 Then
        '    MsgBox("Задайте количество", MsgBoxStyle.Critical + MsgBoxStyle.OkOnly, "Ошибка")
        '    Return
        'End If
        If txtCellCode.Text = "" Then
            MsgBox("Надо выбрать исходную ячейку", MsgBoxStyle.Critical + MsgBoxStyle.OkOnly, "Ошибка")
            Return
        End If
        If txtToCellCode.Text = "" Then
            MsgBox("Надо выбрать целевую ячейку", MsgBoxStyle.Critical + MsgBoxStyle.OkOnly, "Ошибка")
            Return
        End If


        If txtItem.Text = "" Then
            MsgBox("Надо выбрать запчасть", MsgBoxStyle.Critical + MsgBoxStyle.OkOnly, "Ошибка")
            Return
        End If

        Dim request As HttpWebRequest = HttpWebRequest.Create(ServiceURL + "terminal/opmove/" + UID.ToString())
        request.Method = "POST"

        Dim r As invops_move

        r = New invops_move
        r.rfid = txtItem.Tag
        r.shCodeFrom = txtCellCode.Tag
        r.shCodeTo = txtToCellCode.Tag
    
        Dim byteArray As Byte() = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(r))

        request.ContentLength = byteArray.Length
        request.ProtocolVersion = HttpVersion.Version11
        request.ContentType = "application/json; charset=UTF-8"
        request.Accept = "application/json"
        request.Timeout = TimeoutConst
        request.ReadWriteTimeout = RWTimeoutConst
        request.KeepAlive = KeepAliveConst
       

        Dim sStr As String = ""
        Try
            Using dataStream As Stream = request.GetRequestStream()
                dataStream.Write(byteArray, 0, byteArray.Length)
                dataStream.Close()
            End Using
            Using objResponse As HttpWebResponse = request.GetResponse()
                Using Stream As Stream = objResponse.GetResponseStream()
                    Using sr As New StreamReader(Stream, Encoding.GetEncoding("utf-8"))
                        sStr = sr.ReadToEnd()
                        sr.Close()
                    End Using

                End Using
                objResponse.Close()
            End Using


            Dim resp As TerminalMessage = JsonConvert.DeserializeObject(Of TerminalMessage)(sStr)
            If resp.message = "OK" Then
                Dim f As frmOK
                f = New frmOK
                f.ShowDialog()
                Clear()
            Else
                MsgBox(resp.message, MsgBoxStyle.Critical + MsgBoxStyle.OkOnly, "Ошибка")
            End If

        Catch ex As Exception
            MsgBox("Перемещение: " + ex.Message, MsgBoxStyle.OkOnly + MsgBoxStyle.Exclamation, "Ошибка")
            RestartWLAN()
        End Try
    End Sub


#Region "barcode"


    Private myReadNotifyHandler As EventHandler = Nothing
    Private myStatusNotifyHandler As EventHandler = Nothing
    Private isReaderInitiated As Boolean = False
    Private MyTrigger As Symbol.ResourceCoordination.Trigger = Nothing
    Private MyTriggerHandler As Symbol.ResourceCoordination.Trigger.TriggerEventHandler = Nothing
    Private TriggerDev As Symbol.ResourceCoordination.TriggerDevice = Nothing


    Public Sub SetupTriggerResource()
        Try
            'create a trigger object
            TriggerDev = New Symbol.ResourceCoordination.TriggerDevice(Symbol.ResourceCoordination.TriggerID.ALL_TRIGGERS, DirectCast(Nothing, Symbol.ResourceCoordination.TriggerState()))

            MyTrigger = New Symbol.ResourceCoordination.Trigger(TriggerDev)

            'create an event handler and attach a handler method for trigger
            MyTriggerHandler = New Symbol.ResourceCoordination.Trigger.TriggerEventHandler(AddressOf MyTriggerH)

            AddHandler MyTrigger.Stage2Notify, MyTriggerHandler
        Catch ex As Exception
            MessageBox.Show("Failed to create Trigger: " & ex.Message, "Error")

            Me.Close()
            Return
        End Try
    End Sub

    Private Sub MyTriggerH(ByVal sender As Object, ByVal evt As Symbol.ResourceCoordination.TriggerEventArgs)
        myScanSampleAPI.StartRead(False)
    End Sub


    Private Sub HandleData(ByVal TheReaderData As Symbol.Barcode.ReaderData)
        If txtCellCode.Text = "" Then
            txtCellCode.Tag = TheReaderData.Text
            txtCellCode.Text = txtCellCode.Tag
            If IsGoodNet() Then
                Dim s As String
                s = GetCell(txtCellCode.Tag)
                If s <> "" Then
                    txtCellCode.Text = s & " " & txtCellCode.Tag
                End If
            End If

        Else
            txtToCellCode.Tag = TheReaderData.Text
            txtToCellCode.Text = txtToCellCode.Tag
            If IsGoodNet() Then
                Dim s As String
                s = GetCell(txtToCellCode.Tag)
                If s <> "" Then
                    txtToCellCode.Text = s & " " & txtToCellCode.Tag
                End If
            End If
            End If
    End Sub 'HandleData

    Private Sub myReader_ReadNotify(ByVal Sender As Object, ByVal e As EventArgs)
        Try
            ' Checks if the Invoke method is required because the ReadNotify delegate is called by a different thread
            If Me.InvokeRequired Then
                ' Executes the ReadNotify delegate on the main thread
                Try
                    Me.Invoke(myReadNotifyHandler, New Object() {Sender, e})
                Catch ex As Exception

                End Try


            Else

                ' Get ReaderData
                Dim TheReaderData As Symbol.Barcode.ReaderData = myScanSampleAPI.Reader.GetNextReaderData()

                Select Case TheReaderData.Result

                    Case Symbol.Results.SUCCESS

                        HandleData(TheReaderData)
                        myScanSampleAPI.StopRead()

                    Case Symbol.Results.E_SCN_READTIMEOUT

                        myScanSampleAPI.StartRead(False)

                    Case Symbol.Results.CANCELED

                    Case Symbol.Results.E_SCN_DEVICEFAILURE
                        myScanSampleAPI.StopRead()

                        myScanSampleAPI.StartRead(False)

                    Case Else


                        If TheReaderData.Result = Symbol.Results.E_SCN_READINCOMPATIBLE Then
                            myScanSampleAPI.StopRead()
                            myScanSampleAPI.DetachReadNotify()
                            myScanSampleAPI.DetachStatusNotify()
                            MessageBox.Show("Ошибка работы сканера штрихкодов")
                            Me.Close()
                            Return
                        End If

                End Select
            End If


        Catch ex As Exception

        End Try
    End Sub 'myReader_ReadNotify


    ''' <summary>
    ''' Status notification handler.
    ''' </summary>
    Private Sub myReader_StatusNotify(ByVal Sender As Object, ByVal e As EventArgs)
        Try

        
            ' Checks if the Invoke method is required because the StatusNotify delegate is called by a different thread
            If Me.InvokeRequired Then
                ' Executes the StatusNotify delegate on the main thread
                Try
                    Me.Invoke(myStatusNotifyHandler, New Object() {Sender, e})
                Catch ex As Exception

                End Try


            Else

                ' Get ReaderData
                Dim TheStatusData As Symbol.Barcode.BarcodeStatus = myScanSampleAPI.Reader.GetNextStatus()

                Select Case TheStatusData.State

                    Case Symbol.Barcode.States.WAITING

                        'Me.myScanSampleAPI.StopRead()
                        'Me.myScanSampleAPI.StartRead(False)


                    Case Symbol.Barcode.States.IDLE


                    Case Symbol.Barcode.States.READY


                    Case Else

                End Select
            End If
        Catch ex As Exception

        End Try
    End Sub 'myReader_StatusNotify
#End Region

#Region "RFID"

    Private Sub ProcessTags(ByVal Tag__1 As IEnumerable(Of Symbol.RFID3.TagData))


        Try
            Dim maxRSSI_Tag As Symbol.RFID3.TagData = Nothing
            Dim strTagID As String = String.Empty
            'Dim ok As Boolean

            Dim count As Integer = 0
            'Dim rdate As Date
            'rdate = Date.Now()
            For Each tag__2 As Symbol.RFID3.TagData In Tag__1
               
                System.Windows.Forms.Application.DoEvents()

                If maxRSSI_Tag Is Nothing Then
                    maxRSSI_Tag = tag__2
                Else
                    If tag__2.PeakRSSI > maxRSSI_Tag.PeakRSSI Then
                        maxRSSI_Tag = tag__2
                    End If
                End If
               
            Next
            If Not maxRSSI_Tag Is Nothing Then

                strTagID = maxRSSI_Tag.TagID

                txtItem.Tag = strTagID
                txtItem.Text = txtItem.Tag
                If IsGoodNet() Then
                    Dim s As String
                    s = GetPart(txtItem.Tag)
                    If s <> "" Then
                        txtItem.Text = s & " " & txtItem.Tag
                    End If
                End If


            End If
        Catch ex As Exception
            MessageBox.Show("Error:" & ex.Message, "Inventory")
        End Try
    End Sub


    Private Shared InTimer As Boolean = False

    Private Sub Timer1_Tick(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles Timer1.Tick
        If Not InTimer Then
            InTimer = True
            If m_ReaderAPI.IsConnected Then
                StartReadTags()
                Try

                    Dim Tags As IEnumerable(Of Symbol.RFID3.TagData) = m_ReaderAPI.Actions.GetReadTags(2)
                    If Not Tags Is Nothing Then
                        ' lblStatus.Text = "Чтение метки"
                        ProcessTags(Tags)
                    End If
                Catch ex As Exception
                    txtItem.Text = ""
                End Try

            End If
            InTimer = False
        End If
    End Sub

#End Region

    Private Sub frmOpMove_Closing(ByVal sender As Object, ByVal e As System.ComponentModel.CancelEventArgs) Handles MyBase.Closing
        Try
            If Not myScanSampleAPI Is Nothing Then
                myScanSampleAPI.StopRead()
                myScanSampleAPI.DetachReadNotify()
                myScanSampleAPI.DetachStatusNotify()
            End If
        Catch ex As Exception

        End Try

        Timer1.Enabled = False
        StopReadingTags()

        If MyTrigger IsNot Nothing Then
            MyTrigger.Dispose()
        End If
        If Not myScanSampleAPI Is Nothing Then
            myScanSampleAPI = Nothing
        End If
    End Sub

    Private Sub frmOpMove_Load(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles MyBase.Load
        WakeUp()

        ' Initialize the API reference.
        If myScanSampleAPI Is Nothing Then
            myScanSampleAPI = New TERM_INV19.BarcodeAPI
        End If

        Me.isReaderInitiated = myScanSampleAPI.InitReader()

        If Not Me.isReaderInitiated Then

            MessageBox.Show("Ошибка подключения к сканеру штрихкодов")
            Me.Close()
        Else ' If the reader has been initialized

            Me.myStatusNotifyHandler = New EventHandler(AddressOf myReader_StatusNotify)
            myScanSampleAPI.AttachStatusNotify(myStatusNotifyHandler)

            Me.myReadNotifyHandler = New EventHandler(AddressOf myReader_ReadNotify)
            myScanSampleAPI.AttachReadNotify(myReadNotifyHandler)

        End If
        SetupTriggerResource()
        Timer1.Enabled = True
        StartReadTags()
    End Sub

    
End Class