Imports Newtonsoft.Json
Imports System.Net
Imports System.Text
Imports System.IO




Public Class frmInventoryCell

    Private Sub MenuItem1_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles MenuItem1.Click
        Me.DialogResult = Windows.Forms.DialogResult.Cancel
        'Me.Close()

    End Sub

    Private Sub MenuItem2_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles MenuItem2.Click
        Timer1.Enabled = False
        ItemList.Clear()
        lstItems.Items.Clear()
        txtCellCode.Text = ""
        txtCellCode.Tag = ""
        Timer1.Enabled = True
    End Sub



    Private ItemList As Dictionary(Of String, TagListInfo) = Nothing


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
        txtCellCode.Tag = TheReaderData.Text
        txtCellCode.Text = txtCellCode.Tag
        If IsGoodNet() Then
            Dim s As String
            s = GetCell(txtCellCode.Tag)
            If s <> "" Then
                txtCellCode.Text = s & " " & txtCellCode.Tag
            End If
        End If

        If txtCellCode.Text <> "" Then
            Timer1.Enabled = True
            StartReadTags()
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

                'End If
            Next
            If Not maxRSSI_Tag Is Nothing Then

                strTagID = maxRSSI_Tag.TagID

                If Not ItemList.Keys.Contains(strTagID) Then

                    Dim ti As TagListInfo
                    ti = New TagListInfo
                    ti.q = "1"
                    ti.name = strTagID

                    If IsGoodNet() Then
                        Dim ci As ComboInfo
                        ci = GetTagInfo(strTagID)
                        If Not ci Is Nothing Then
                            ti.q = ci.id
                            ti.name = ci.name
                        End If
                    End If

                    ItemList.Add(strTagID, ti)
                    lstItems.Items.Add(ti)

                    
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

                End Try

            End If
            InTimer = False
        End If
    End Sub

#End Region

    Private Sub frmInventoryCell_Closing(ByVal sender As Object, ByVal e As System.ComponentModel.CancelEventArgs) Handles MyBase.Closing
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




    Private Sub frmInventoryCell_Load(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles MyBase.Load
        WakeUp()

        ' Initialize the API reference.
        If myScanSampleAPI Is Nothing Then
            myScanSampleAPI = New TERM_INV19.BarcodeAPI
        End If

        ItemList = New Dictionary(Of String, TagListInfo)
        lstItems.Items.Clear()


     


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

        ' start after cell scanned !!!
        'Timer1.Enabled = True
        'StartReadTags()
    End Sub


    Private Sub cmdProcess_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles cmdProcess.Click
        

        If ItemList.Count = 0 Then
            MsgBox("RFID  метки запчастей не обнаружены", MsgBoxStyle.Critical + MsgBoxStyle.OkOnly, "Ошибка")
            Return
        End If
        If txtCellCode.Tag = "" Then
            MsgBox("Надо выбрать ячейку", MsgBoxStyle.Critical + MsgBoxStyle.OkOnly, "Ошибка")
            Return
        End If

        If MsgBox("Зафиксировать собранную информацию?", MsgBoxStyle.Question + MsgBoxStyle.YesNo, "Записать") = MsgBoxResult.No Then
            Return
        End If


        Timer1.Enabled = False
        StopReadingTags()


        Dim OK As Boolean
        Dim sStr As String = ""


        Try


            ' очищаем информацию о  ячейке, чтобы можно было перезаписать данные
            Dim request1 As HttpWebRequest = HttpWebRequest.Create(ServiceURL + "terminal/clearcell/" + UID.ToString())
            request1.Method = "POST"
            request1.Timeout = TimeoutConst
            request1.ReadWriteTimeout = RWTimeoutConst
            request1.KeepAlive = KeepAliveConst

            Dim r1 As invops_clear

            r1 = New invops_clear
            r1.InventoryID = New Guid(CurrentINV.id)
            r1.shCode = txtCellCode.Tag

            Dim byteArray1 As Byte() = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(r1))

            request1.ContentLength = byteArray1.Length
            request1.ProtocolVersion = HttpVersion.Version11
            request1.ContentType = "application/json; charset=UTF-8"
            request1.Accept = "application/json"


            Try

                Using dataStream As Stream = request1.GetRequestStream()
                    dataStream.Write(byteArray1, 0, byteArray1.Length)
                    dataStream.Close()
                End Using

                Using objResponse As HttpWebResponse = request1.GetResponse()
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
                    OK = True
                Else
                    OK = False
                    MsgBox(resp.message, MsgBoxStyle.Critical + MsgBoxStyle.OkOnly, "Ошибка")
                    Return
                End If

            Catch ex As Exception
                MsgBox("Clear Cell: " + ex.Message, MsgBoxStyle.OkOnly + MsgBoxStyle.Exclamation, "Ошибка")
                RestartWLAN()
                Return
            End Try
        Catch ex1 As Exception
            MsgBox("Clear Cell: " + ex1.Message, MsgBoxStyle.OkOnly + MsgBoxStyle.Exclamation, "Ошибка")
        End Try

        If OK Then

            OK = False

            For Each Tag As TagListInfo In ItemList.Values

                sStr = ""
                Dim request As HttpWebRequest = HttpWebRequest.Create(ServiceURL + "terminal/inventory/" + UID.ToString())
                request.Method = "POST"
                request.Timeout = TimeoutConst
                request.ReadWriteTimeout = RWTimeoutConst
                request.KeepAlive = KeepAliveConst

                Try

                    Dim r As invops_inventory
                    r = New invops_inventory
                    r.InventoryID = New Guid(CurrentINV.id)
                    r.shCode = txtCellCode.Tag
                    If Tag.q = "*" Then
                        r.quantity = 1
                    Else
                        Try
                            r.quantity = Integer.Parse(Tag.q)

                        Catch ex As Exception
                            r.quantity = 1
                        End Try
                    End If
                    r.rfid = Tag.name


                    Dim byteArray As Byte() = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(r))

                    request.ContentLength = byteArray.Length
                    request.ProtocolVersion = HttpVersion.Version11
                    request.ContentType = "application/json; charset=UTF-8"
                    request.Accept = "application/json"

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
                            OK = OK Or True
                        Else
                            OK = OK Or False
                            MsgBox(resp.message, MsgBoxStyle.Critical + MsgBoxStyle.OkOnly, "Ошибка")
                        End If

                    Catch ex As Exception
                        MsgBox("Register tag" + Tag.name + " : " + ex.Message, MsgBoxStyle.OkOnly + MsgBoxStyle.Exclamation, "Ошибка")
                        RestartWLAN()
                    End Try

                Catch ex2 As Exception
                    MsgBox("Register tag" + Tag.name + " : " + ex2.Message, MsgBoxStyle.OkOnly + MsgBoxStyle.Exclamation, "Ошибка")
                End Try

                request = Nothing
            Next

        End If

        If OK Then
            Dim f As frmOK
            f = New frmOK
            f.ShowDialog()
            Clear()
        End If

        Me.DialogResult = Windows.Forms.DialogResult.OK
        'Me.Close()
    End Sub

    Private Sub Clear()
        txtCellCode.Text = ""
        txtCellCode.Tag = ""
        ItemList.Clear()
        lstItems.Items.Clear()
    End Sub

    Private Sub lstItems_SelectedIndexChanged(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles lstItems.SelectedIndexChanged
        If Not lstItems.SelectedItem Is Nothing Then
            Dim ti As TagListInfo
            Try
                ti = lstItems.SelectedItem
                numQ.Value = Integer.Parse(ti.q)
            Catch ex As Exception
                numQ.Value = 1
            End Try

        End If
    End Sub

    Private Sub numQ_ValueChanged(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles numQ.ValueChanged
        If Not lstItems.SelectedItem Is Nothing Then
            Dim ti As TagListInfo
            Try
                ti = lstItems.SelectedItem
                ti.q = numQ.Value.ToString()
            Catch ex As Exception
            End Try

        End If

    End Sub
End Class