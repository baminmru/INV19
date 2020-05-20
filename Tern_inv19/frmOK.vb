Public Class frmOK
    Public ft As String
    Private Sub Button1_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles Button1.Click
        Timer1.Enabled = False
        Try
            StopReadingTags()
        Catch ex As Exception

        End Try
        Try
            Me.DialogResult = Windows.Forms.DialogResult.Cancel
        Catch ex As Exception

        End Try
        Try
            Me.Close()
        Catch ex As Exception

        End Try


    End Sub

    Private Sub MenuItem1_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles MenuItem1.Click
        Timer1.Enabled = False
        Try
            StopReadingTags()
        Catch ex As Exception

        End Try
        Try
            Me.DialogResult = Windows.Forms.DialogResult.Cancel
        Catch ex As Exception

        End Try
        Try
            Me.Close()
        Catch ex As Exception

        End Try

    End Sub

    Private Sub frmOK_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles MyBase.Load

        'WakeUp()
        Timer1.Enabled = True

    End Sub

    Private Sub Timer1_Tick(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles Timer1.Tick
        Timer1.Enabled = False
        Try
            StopReadingTags()
        Catch ex As Exception

        End Try
        Try
            Me.DialogResult = Windows.Forms.DialogResult.OK
        Catch ex As Exception

        End Try
        Try
            Me.Close()
        Catch ex As Exception

        End Try

    End Sub
End Class