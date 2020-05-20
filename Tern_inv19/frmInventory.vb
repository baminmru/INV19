Imports Newtonsoft.Json
Imports System.Net
Imports System.Text
Imports System.IO

Public Class frmInventory

    Private Sub cmdProcess_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles cmdProcess.Click
        If cmbInv.SelectedIndex = -1 Then
            MsgBox("Надо выбрать запись об инвентаризации", MsgBoxStyle.Critical + MsgBoxStyle.OkOnly, "Ошибка")
            Return
        End If
        If cmbInv.SelectedIndex >= 0 Then
            CurrentINV = InvList(cmbInv.SelectedIndex)
            Dim f As frmInventoryCell
            f = New frmInventoryCell
            f.ShowDialog()
        End If

    End Sub

    Private Sub MenuItem1_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles MenuItem1.Click
        Me.DialogResult = Windows.Forms.DialogResult.Cancel
        'Me.Close()
    End Sub

    Private Sub cmdStopInv_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles cmdStopInv.Click
        
        If cmbInv.SelectedIndex = -1 Then
            MsgBox("Надо выбрать запись об инвентаризации", MsgBoxStyle.Critical + MsgBoxStyle.OkOnly, "Ошибка")
            Return
        End If
        If cmbInv.SelectedIndex >= 0 Then
            CurrentINV = InvList(cmbInv.SelectedIndex)
            Dim request As HttpWebRequest = HttpWebRequest.Create(ServiceURL + "terminal/stopinventory/" + UID.ToString() + "/" + CurrentINV.id.ToString())
            request.Method = "GET"
            request.Timeout = TimeoutConst
            request.ReadWriteTimeout = RWTimeoutConst
            request.KeepAlive = KeepAliveConst

            Dim str As String = ""
            Try
                Using objResponse As HttpWebResponse = request.GetResponse()
                    Using Stream As Stream = objResponse.GetResponseStream()
                        Using sr As New StreamReader(Stream, Encoding.GetEncoding("utf-8"))
                            str = sr.ReadToEnd()
                            sr.Close()
                        End Using

                    End Using
                    objResponse.Close()
                End Using

                Dim resp As TerminalMessage = JsonConvert.DeserializeObject(Of TerminalMessage)(str)
                If resp.message = "OK" Then
                    Dim f As frmOK
                    f = New frmOK
                    f.ShowDialog()
                    LoadInv()
                Else
                    MsgBox(resp.message, MsgBoxStyle.Critical + MsgBoxStyle.OkOnly, "Ошибка")
                End If

            Catch ex As WebException
                MsgBox(ex.Message)
                RestartWLAN()
            End Try

        End If








        Me.DialogResult = Windows.Forms.DialogResult.OK
        'Me.Close()
    End Sub

    Private Sub LoadInv()

        Dim request As HttpWebRequest = HttpWebRequest.Create(ServiceURL + "terminal/inventory")
        request.Method = "GET"
        request.Timeout = TimeoutConst
        request.ReadWriteTimeout = RWTimeoutConst
        request.KeepAlive = KeepAliveConst
        request.ContentLength = 0
        request.ProtocolVersion = HttpVersion.Version11
        'request.ContentType = "application/json; charset=UTF-8"
        request.Accept = "application/json"

        Dim str As String = ""
        Try
            Using objResponse As HttpWebResponse = request.GetResponse()
                Using Stream As Stream = objResponse.GetResponseStream()
                    Using sr As New StreamReader(Stream, Encoding.GetEncoding("utf-8"))
                        str = sr.ReadToEnd()
                        sr.Close()
                    End Using
                End Using
                objResponse.Close()
            End Using

            InvList = JsonConvert.DeserializeObject(Of List(Of ComboInfo))(str)


            cmbInv.DataSource = InvList
        Catch ex As WebException
            MsgBox(ex.Message)

        End Try
    End Sub

    Private Sub frmInventory_Load(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles MyBase.Load
        WakeUp()
        LoadInv()
    End Sub
End Class