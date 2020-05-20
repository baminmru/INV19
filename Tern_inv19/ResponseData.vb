Imports System
Imports System.Collections.Generic

Public Class BaseResponseSimple(Of I)
    Public Sub New()
    End Sub

    Public apiVersion As Integer
    Public requestDate As String
    Public requestId As String
    Public code As I
    Public message As String
    Public description As String
End Class

Public Class BaseResponse(Of Y, I)
    Inherits BaseResponseSimple(Of I)

    Public Sub New()
        errors = New List(Of Y)
    End Sub

    Public errors As List(Of Y)
End Class

Public Class BaseResponseData(Of T, Y, I)
    Inherits BaseResponse(Of Y, I)

    Public Sub New()
        errors = New List(Of Y)()
    End Sub

    Public data As T
End Class

Public Class BaseResponseOnlyData(Of T, I)
    Inherits BaseResponseSimple(Of I)

    Public Sub New()
    End Sub

    Public data As T
End Class

Public Class ResponseData(Of T)
    Inherits BaseResponseSimple(Of Integer)

    Public Sub New()
    End Sub

    Public data As T
End Class

