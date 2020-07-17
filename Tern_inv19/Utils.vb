Imports Newtonsoft.Json
Imports System.Net
Imports System.Text
Imports System.IO
Imports System.Collections.Generic
Imports System.Collections
Imports System.ComponentModel
Imports System.Data
Imports System.Drawing
Imports System.Diagnostics
Imports Symbol
Imports Symbol.RFID3
Imports Symbol.ResourceCoordination
Imports System.Threading




Module Utils

    Public Const TimeoutConst As Integer = 25000

    Public Const RWTimeoutConst As Integer = 15000

    Public Const KeepAliveConst As Boolean = False

    Dim CellCache As Dictionary(Of String, String)

    Dim PartCache As Dictionary(Of String, String)

    Dim TagCache As Dictionary(Of String, ComboInfo)



    Public Function GetCell(ByVal code As String) As String
        If CellCache Is Nothing Then
            CellCache = New Dictionary(Of String, String)
        End If

        If CellCache.Keys.Contains(code) Then
            Return CellCache(code)
        End If


        Dim request As HttpWebRequest = HttpWebRequest.Create(ServiceURL + "terminal/cell/" + code)
        request.Method = "GET"
        request.ProtocolVersion = HttpVersion.Version11
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

            Dim resp As TerminalMessage = JsonConvert.DeserializeObject(Of TerminalMessage)(sStr)



            If Not resp.message.StartsWith("Ошибка") Then
                If Not CellCache.Keys.Contains(code) Then
                    CellCache.Add(code, resp.message)
                End If

            End If

            Return resp.message

        Catch ex As Exception
            Return ""
        End Try
    End Function



    Public Function GetPart(ByVal code As String) As String

        If PartCache Is Nothing Then
            PartCache = New Dictionary(Of String, String)
        End If

        If PartCache.Keys.Contains(code) Then
            Return PartCache(code)
        End If

        Dim request As HttpWebRequest = HttpWebRequest.Create(ServiceURL + "terminal/item/" + code)
        request.Method = "GET"
        request.ProtocolVersion = HttpVersion.Version11
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

            Dim resp As TerminalMessage = JsonConvert.DeserializeObject(Of TerminalMessage)(sStr)


            If Not resp.message.StartsWith("Ошибка") Then
                If Not PartCache.Keys.Contains(code) Then
                    PartCache.Add(code, resp.message)
                End If

            End If

            Return resp.message

        Catch ex As Exception
            Return ""
        End Try
    End Function


    Public Function GetTagInfo(ByVal tag As String) As ComboInfo

        If TagCache Is Nothing Then
            TagCache = New Dictionary(Of String, ComboInfo)
        End If

        If TagCache.Keys.Contains(tag) Then
            Return TagCache(tag)
        End If


        Dim request As HttpWebRequest = HttpWebRequest.Create(ServiceURL + "terminal/tag/" + tag)
        request.Method = "GET"
        request.ProtocolVersion = HttpVersion.Version11
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

            Dim tList As List(Of ComboInfo) = JsonConvert.DeserializeObject(Of List(Of ComboInfo))(sStr)
            If tList.Count > 0 Then
                If Not TagCache.Keys.Contains(tag) Then
                    TagCache.Add(tag, tList(0))
                End If
                Return tList(0)
            End If
            Return Nothing

        Catch ex As Exception
            Return Nothing

        End Try
    End Function



    

End Module
