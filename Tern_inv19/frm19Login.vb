Imports Newtonsoft.Json
Imports System.Net
Imports System.Text
Imports System.IO

Public Class frm19Login


    'Private Sub reqCallback(ByVal ar As IAsyncResult)
    '    Dim state As RequestState = ar.AsyncState
    '    Dim postStream As Stream = state.request.EndGetRequestStream(ar)


    '    '// Write to the request stream.
    '    postStream.Write(state.RequestBytes, 0, state.RequestBytes.Length)
    '    postStream.Close()


    '    state.request.BeginGetResponse(New AsyncCallback(AddressOf respCallback), state)

    'End Sub

    'Private Sub respCallback(ByVal ar As IAsyncResult)
    '    Dim state As RequestState = ar.AsyncState
    '    state.response = state.request.EndGetResponse(ar)
    '    state.streamResponse = state.response.GetResponseStream
    '    state.streamResponse.BeginRead(state.ReadBuffer, 0, 1024, New AsyncCallback(AddressOf readCallback), state)
    'End Sub

    'Private Sub readCallback(ByVal ar As IAsyncResult)
    '    Dim state As RequestState = ar.AsyncState
    '    Dim read As Integer = state.streamResponse.EndRead(ar)
    '    If read > 0 Then
    '        state.responseData += Encoding.UTF8.GetString(state.ReadBuffer, 0, read)
    '        state.streamResponse.BeginRead(state.ReadBuffer, 0, 1024, AddressOf readCallback, state)
    '    Else
    '        Dim resp As ResponseData(Of String) = JsonConvert.DeserializeObject(Of ResponseData(Of String))(state.responseData)
    '        UID = New Guid(resp.data)

    '    End If
    'End Sub

    Private Sub cmdLogin_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles cmdLogin.Click

        UID = Guid.Empty


        If txtEMail.Text <> "" And txtPassword.Text <> "" Then

            'Dim state As RequestState = New RequestState()
            'state.request = HttpWebRequest.Create(ServiceURL + "account/terminallogin")
            'state.request.Method = "POST"
            'state.request.Timeout = TimeoutConst


            'state.request.ContentLength = state.RequestBytes.Length()
            'state.request.ProtocolVersion = HttpVersion.Version11
            ''request.ContentType = "application/x-www-form-urlencoded"
            'state.request.ContentType = "application/json; charset=UTF-8"
            'state.request.Accept = "application/json"

            Dim r As TermLoginRequest
            r = New TermLoginRequest
            r.email = txtEMail.Text
            r.password = txtPassword.Text


            'state.RequestBytes = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(r))

            Dim request As HttpWebRequest = HttpWebRequest.Create(ServiceURL + "account/terminallogin")
            request.Method = "POST"


            Dim byteArray As Byte() = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(r))

            request.ContentLength = byteArray.Length
            request.ProtocolVersion = HttpVersion.Version11
            request.ContentType = "application/json; charset=UTF-8"
            request.Accept = "application/json"
            request.Timeout = TimeoutConst
            request.ReadWriteTimeout = RWTimeoutConst
            request.KeepAlive = KeepAliveConst


            Try
                Dim sStr As String = ""
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




                Dim resp As ResponseData(Of String) = JsonConvert.DeserializeObject(Of ResponseData(Of String))(sStr)
                UID = New Guid(resp.data)
                If Not UID.Equals(Guid.Empty) Then
                    Me.DialogResult = Windows.Forms.DialogResult.OK
                    Me.Close()
                    Return
                End If


            Catch ex As Exception
                MsgBox("Login: " + ex.Message, MsgBoxStyle.OkOnly + MsgBoxStyle.Exclamation, "Ошибка")
                RestartWLAN()
            End Try



            'Try
            '    Dim iRes As IAsyncResult = state.request.BeginGetRequestStream(AddressOf reqCallback, state)
            '    If iRes.AsyncWaitHandle.WaitOne(5000, False) Then

            '    End If
            '    Me.DialogResult = Windows.Forms.DialogResult.Cancel
            '    Me.Close()
            'Catch ex As Exception
            '    MsgBox(ex.Message)
            '    Me.DialogResult = Windows.Forms.DialogResult.Cancel
            '    Me.Close()
            'End Try

        End If

        Me.DialogResult = Windows.Forms.DialogResult.Cancel
        Me.Close()
    End Sub
End Class