Imports System.Collections.Generic
Imports System.Collections
Imports System.ComponentModel
Imports System.Data
Imports System.Drawing
Imports System.Diagnostics
Imports System.Text
Imports System.Xml
Imports System.IO
Imports System.Reflection
Imports System.Windows.Forms
Imports System.Runtime.InteropServices
Imports Symbol
Imports Symbol.RFID3
Imports Symbol.RFID3.Events
Imports Symbol.ResourceCoordination
Imports System.Threading
Imports System.Net

Public Class frm19Main


    Private Function ReaderConnected()

        m_ReaderAPI = New RFIDReader("127.0.0.1", 5084, 0)

        Try
            m_ReaderAPI.Connect()
        Catch ex As System.Exception
            Return False
        End Try

        Return True
    End Function

    Private Sub ReaderDisconnected()
        Try
            If m_ReaderAPI IsNot Nothing Then
                m_ReaderAPI.Disconnect()
            End If
        Catch ex As Exception

        End Try

    End Sub



    Private Sub Shutdown()

        If m_ReaderAPI IsNot Nothing Then
            Try
                m_ReaderAPI.Disconnect()
            Catch ex As Exception

            End Try

        End If
        m_ReaderAPI = Nothing


        If Not myScanSampleAPI Is Nothing Then
            Try
                myScanSampleAPI.TermReader()
            Catch ex As Exception

            End Try

            myScanSampleAPI = Nothing
        End If
    End Sub


    Private Sub MenuItem1_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles MenuItem1.Click
        Dim f As frmPassword
        f = New frmPassword
        If f.ShowDialog() = Windows.Forms.DialogResult.OK Then
            Shutdown()
            Application.Exit()
        End If
    End Sub

    Private Sub cmdOpIN_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles cmdOpIN.Click
        Dim f As frmOpIn
        f = New frmOpIn
        f.ShowDialog()


    End Sub

    Private Sub cmdOpMove_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles cmdOpMove.Click
        Dim f As frmOpMove
        f = New frmOpMove
        f.ShowDialog()

    End Sub

    Private Sub cmdOpOut_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles cmdOpOut.Click
        Dim f As frmOpOut
        f = New frmOpOut
        f.ShowDialog()

    End Sub

    Private Sub cmdOpInv_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles cmdOpInv.Click
        Dim f As frmInventory
        f = New frmInventory
        f.ShowDialog()

    End Sub

    Private Sub frm19Main_Load(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles MyBase.Load

        WakeUp()

        ServicePointManager.DefaultConnectionLimit = 4

        Dim xml As XmlDocument
        xml = New XmlDocument
        Try
            xml.Load("\InventoryConfig.xml")
            Dim node As XmlElement
            node = xml.LastChild()

            ClosePassword = (node.Attributes.GetNamedItem("ClosePassword").Value)
            ServiceURL = (node.Attributes.GetNamedItem("ServiceURL").Value)

            Try
                GoodNet = (node.Attributes.GetNamedItem("GoodNet").Value)
            Catch ex As Exception
                GoodNet = "no"
            End Try

        Catch

        End Try


        Dim ok As Boolean = False
        Dim trycnt As Integer = 20
        While (trycnt > 0) And (Not ok)
            Try
                ok = ReaderConnected()
            Catch
                ok = False
            End Try
            If Not ok Then
                Beep()
                Thread.Sleep(1000)
                trycnt -= 1
            End If
        End While
        If ok Then
            Dim cnt As Integer
            cnt = 5
            Dim f As frm19Login
            While cnt > 0
                f = New frm19Login
                If f.ShowDialog() = DialogResult.OK Then
                    f = Nothing
                    Exit While
                Else
                    cnt -= 1
                End If
            End While

            If cnt = 0 Then
                ReaderDisconnected()
                Application.[Exit]()
            End If

        Else
            MessageBox.Show("Error: Reader not initialized", "Inventory")
            ReaderDisconnected()
            Application.[Exit]()
        End If
    End Sub


    Public Sub New()

        ' This call is required by the Windows Form Designer.
        InitializeComponent()

        ' Add any initialization after the InitializeComponent() call.
        Try

            Dim strPath As String = Assembly.GetExecutingAssembly().ManifestModule.FullyQualifiedName
            strPath = strPath.Replace(Assembly.GetExecutingAssembly().ManifestModule.Name, "DeviceReader.Config")
            Dim configStreamStr As String = String.Empty


            m_ReaderMgmt = New ReaderManagement

        Catch ex As Exception
            MessageBox.Show(ex.Message, "Inventory")
            Application.[Exit]()

        End Try

    End Sub

    Private Sub Button1_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles Button1.Click
        Dim f As frmRegister
        f = New frmRegister
        f.ShowDialog()
    End Sub
End Class