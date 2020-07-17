Imports Newtonsoft.Json
Imports System.Net
Imports System.Text
Imports System.IO


Public Class frmRegister

    Private Sub frmRegister_Closing(ByVal sender As Object, ByVal e As System.ComponentModel.CancelEventArgs) Handles MyBase.Closing
        Timer1.Enabled = False
        StopReadingTags()
    End Sub


    Private Sub frmRegister_Load(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles MyBase.Load
        WakeUp()

        LoadParts()
        Timer1.Enabled = True
        StartReadTags()

    End Sub


    Private Sub Clear()
        txtItem.Text = ""
        txtItem.Tag = ""
    End Sub

    Private Sub MenuItem1_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles MenuItem1.Click
        Clear()
    End Sub

    Private Sub MenuItem2_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles MenuItem2.Click
        Me.DialogResult = Windows.Forms.DialogResult.Cancel
        Me.Close()
    End Sub

    Private CurrentPart As ComboInfo


    Private Sub cmdProcess_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles cmdProcess.Click

        If lstPart.SelectedIndex = -1 Then
            MsgBox("Надо выбрать запчасть", MsgBoxStyle.Critical + MsgBoxStyle.OkOnly, "Ошибка")
            Return
        End If
        If lstPart.SelectedIndex >= 0 Then

            CurrentPart = PartList(lstPart.SelectedIndex)

        End If

        If txtItem.Text = "" Then
            MsgBox("Надо считать метку ", MsgBoxStyle.Critical + MsgBoxStyle.OkOnly, "Ошибка")
            Return
        End If

        Dim request As HttpWebRequest = HttpWebRequest.Create(ServiceURL + "terminal/register/" + UID.ToString())
        request.Method = "POST"

        Dim r As invops_register
        r = New invops_register
        r.rfid = txtItem.Text
        r.thePart = New Guid(CurrentPart.id)
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
            MsgBox("Регистрация: " + ex.Message, MsgBoxStyle.OkOnly + MsgBoxStyle.Exclamation, "Ошибка")
            RestartWLAN()
        End Try





    End Sub

    Private Sub LoadParts()

        Dim request As HttpWebRequest = HttpWebRequest.Create(ServiceURL + "terminal/part")
        request.Method = "GET"
        request.ContentLength = 0
        request.ProtocolVersion = HttpVersion.Version11
        'request.ContentType = "application/json; charset=UTF-8"
        request.Accept = "application/json"
        request.Timeout = TimeoutConst
        request.ReadWriteTimeout = RWTimeoutConst
        request.KeepAlive = KeepAliveConst


        Dim sStr As String = ""

        Try
            Using objResponse As HttpWebResponse = request.GetResponse()
                Using Stream As Stream = objResponse.GetResponseStream()
                    Using sr As New StreamReader(Stream, Encoding.GetEncoding("utf-8"))
                        sStr = sr.ReadToEnd()
                        sr.Close()
                    End Using

                End Using
                objResponse.Close()
            End Using

            PartList = JsonConvert.DeserializeObject(Of List(Of ComboInfo))(sStr)


            lstPart.DataSource = PartList
        Catch ex As Exception
            MsgBox("Запчасти: " + ex.Message, MsgBoxStyle.OkOnly + MsgBoxStyle.Exclamation, "Ошибка")

        End Try
    End Sub

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

                txtItem.Text = strTagID
                txtItem.Tag = strTagID




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

End Class