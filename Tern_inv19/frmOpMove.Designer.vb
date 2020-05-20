<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Partial Public Class frmOpMove
    Inherits System.Windows.Forms.Form

    'Форма переопределяет метод Dispose для очистки списка компонентов.
    <System.Diagnostics.DebuggerNonUserCode()> _
    Protected Overrides Sub Dispose(ByVal disposing As Boolean)
        If disposing AndAlso components IsNot Nothing Then
            components.Dispose()
        End If
        MyBase.Dispose(disposing)
    End Sub

    'Требуется для конструктора Windows Forms
    Private components As System.ComponentModel.IContainer
    Private mainMenu1 As System.Windows.Forms.MainMenu

    'Примечание: следующая процедура является обязательной для конструктора Windows Forms
    'Для ее изменения используйте конструктор Windows Forms.  
    'Не изменяйте ее в редакторе исходного кода.
    <System.Diagnostics.DebuggerStepThrough()> _
    Private Sub InitializeComponent()
        Me.mainMenu1 = New System.Windows.Forms.MainMenu
        Me.MenuItem2 = New System.Windows.Forms.MenuItem
        Me.MenuItem1 = New System.Windows.Forms.MenuItem
        Me.cmdProcess = New System.Windows.Forms.Button
        Me.txtItem = New System.Windows.Forms.TextBox
        Me.Label2 = New System.Windows.Forms.Label
        Me.txtCellCode = New System.Windows.Forms.TextBox
        Me.Label1 = New System.Windows.Forms.Label
        Me.txtToCellCode = New System.Windows.Forms.TextBox
        Me.Label4 = New System.Windows.Forms.Label
        Me.Timer1 = New System.Windows.Forms.Timer
        Me.SuspendLayout()
        '
        'mainMenu1
        '
        Me.mainMenu1.MenuItems.Add(Me.MenuItem2)
        Me.mainMenu1.MenuItems.Add(Me.MenuItem1)
        '
        'MenuItem2
        '
        Me.MenuItem2.Text = "Сброс"
        '
        'MenuItem1
        '
        Me.MenuItem1.Text = "Выйти"
        '
        'cmdProcess
        '
        Me.cmdProcess.Location = New System.Drawing.Point(11, 130)
        Me.cmdProcess.Name = "cmdProcess"
        Me.cmdProcess.Size = New System.Drawing.Size(210, 40)
        Me.cmdProcess.TabIndex = 13
        Me.cmdProcess.Text = "Провести"
        '
        'txtItem
        '
        Me.txtItem.Location = New System.Drawing.Point(11, 84)
        Me.txtItem.Name = "txtItem"
        Me.txtItem.Size = New System.Drawing.Size(210, 21)
        Me.txtItem.TabIndex = 12
        '
        'Label2
        '
        Me.Label2.Location = New System.Drawing.Point(11, 60)
        Me.Label2.Name = "Label2"
        Me.Label2.Size = New System.Drawing.Size(210, 21)
        Me.Label2.Text = "RFID"
        '
        'txtCellCode
        '
        Me.txtCellCode.Location = New System.Drawing.Point(11, 21)
        Me.txtCellCode.Name = "txtCellCode"
        Me.txtCellCode.Size = New System.Drawing.Size(98, 21)
        Me.txtCellCode.TabIndex = 10
        '
        'Label1
        '
        Me.Label1.Location = New System.Drawing.Point(11, 0)
        Me.Label1.Name = "Label1"
        Me.Label1.Size = New System.Drawing.Size(210, 18)
        Me.Label1.Text = "Из ячейки"
        '
        'txtToCellCode
        '
        Me.txtToCellCode.Location = New System.Drawing.Point(127, 21)
        Me.txtToCellCode.Name = "txtToCellCode"
        Me.txtToCellCode.Size = New System.Drawing.Size(94, 21)
        Me.txtToCellCode.TabIndex = 18
        '
        'Label4
        '
        Me.Label4.Location = New System.Drawing.Point(127, 0)
        Me.Label4.Name = "Label4"
        Me.Label4.Size = New System.Drawing.Size(94, 18)
        Me.Label4.Text = "В ячейку"
        '
        'Timer1
        '
        '
        'frmOpMove
        '
        Me.AutoScaleDimensions = New System.Drawing.SizeF(96.0!, 96.0!)
        Me.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Dpi
        Me.AutoScroll = True
        Me.ClientSize = New System.Drawing.Size(240, 268)
        Me.ControlBox = False
        Me.Controls.Add(Me.txtToCellCode)
        Me.Controls.Add(Me.Label4)
        Me.Controls.Add(Me.cmdProcess)
        Me.Controls.Add(Me.txtItem)
        Me.Controls.Add(Me.Label2)
        Me.Controls.Add(Me.txtCellCode)
        Me.Controls.Add(Me.Label1)
        Me.Menu = Me.mainMenu1
        Me.Name = "frmOpMove"
        Me.Text = "Перемещение"
        Me.ResumeLayout(False)

    End Sub
    Friend WithEvents cmdProcess As System.Windows.Forms.Button
    Friend WithEvents txtItem As System.Windows.Forms.TextBox
    Friend WithEvents Label2 As System.Windows.Forms.Label
    Friend WithEvents txtCellCode As System.Windows.Forms.TextBox
    Friend WithEvents Label1 As System.Windows.Forms.Label
    Friend WithEvents txtToCellCode As System.Windows.Forms.TextBox
    Friend WithEvents Label4 As System.Windows.Forms.Label
    Friend WithEvents MenuItem2 As System.Windows.Forms.MenuItem
    Friend WithEvents Timer1 As System.Windows.Forms.Timer
    Friend WithEvents MenuItem1 As System.Windows.Forms.MenuItem
End Class
