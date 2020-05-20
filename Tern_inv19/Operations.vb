Public Class invops_in
    ' Public invops_inId As String
    Public shCode As String
    Public rfid As String
    Public quantity As Integer
End Class

Public Class invops_move
    'Public invops_moveId As String
    Public shCodeFrom As String
    Public shCodeTo As String
    Public rfid As String
    'Public quantity As Integer
End Class

Public Class invops_out
    ' Public invops_outId As String
    Public shCode As String
    Public rfid As String
    Public quantity As Integer
    Public theDept As String
End Class

Public Class TerminalMessage
    Public message As String
End Class

Public Class invops_register ' Регистрация
    Public thePart As Guid  'Деталь
    Public rfid As String  ' RFID детали
End Class

Public Class invops_inventory
    Public InventoryID As Guid  ' инвентаризация
    Public shCode As String  ' штрихкод ячейки
    Public rfid As String  ' RFID детали
    Public quantity As Integer  ' Количество
End Class


Public Class invops_clear
    Public InventoryID As Guid  ' инвентаризация
    Public shCode As String  ' штрихкод ячейки
End Class

Public Class ComboInfo
    Public id As String
    Public name As String
    Public Overrides Function ToString() As String
        Return name
    End Function
End Class

Public Class TagListInfo
    Public q As String
    Public name As String
    Public Overrides Function ToString() As String
        If q = "" Or q = "1" Then
            Return name
        Else
            Return q & " " & name
        End If

    End Function
End Class





