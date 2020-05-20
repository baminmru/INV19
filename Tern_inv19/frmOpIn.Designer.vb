<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Partial Public Class frmOpIn
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
        Me.MenuItem1 = New System.Windows.Forms.MenuItem
        Me.MenuItem2 = New System.Windows.Forms.MenuItem
        Me.Label1 = New System.Windows.Forms.Label
        Me.txtCellCode = New System.Windows.Forms.TextBox
        Me.Label2 = New System.Windows.Forms.Label
        Me.numQ = New System.Windows.Forms.NumericUpDown
        Me.Label3 = New System.Windows.Forms.Label
        Me.txtItem = New System.Windows.Forms.TextBox
        Me.cmdProcess = New System.Windows.Forms.Button
        Me.Timer1 = New System.Windows.Forms.Timer
        Me.SuspendLayout()
        '
        'mainMenu1
        '
        Me.mainMenu1.MenuItems.Add(Me.MenuItem1)
        Me.mainMenu1.MenuItems.Add(Me.MenuItem2)
        '
        'MenuItem1
        '
        Me.MenuItem1.Text = "Сброс"
        '
        'MenuItem2
        '
        Me.MenuItem2.Text = "Выйти"
        '
        'Label1
        '
        Me.Label1.Location = New System.Drawing.Point(8, 0)
        Me.Label1.Name = "Label1"
        Me.Label1.Size = New System.Drawing.Size(215, 16)
        Me.Label1.Text = "Ячейка"
        '
        'txtCellCode
        '
        Me.txtCellCode.Location = New System.Drawing.Point(8, 19)
        Me.txtCellCode.Name = "txtCellCode"
        Me.txtCellCode.Size = New System.Drawing.Size(209, 21)
        Me.txtCellCode.TabIndex = 1
        '
        'Label2
        '
        Me.Label2.Location = New System.Drawing.Point(8, 42)
        Me.Label2.Name = "Label2"
        Me.Label2.Size = New System.Drawing.Size(209, 18)
        Me.Label2.Text = "Запчасть (RFID)"
        '
        'numQ
        '
        Me.numQ.Font = New System.Drawing.Font("Tahoma", 12.0!, System.Drawing.FontStyle.Regular)
        Me.numQ.Location = New System.Drawing.Point(8, 104)
        Me.numQ.Name = "numQ"
        Me.numQ.Size = New System.Drawing.Size(209, 27)
        Me.numQ.TabIndex = 3
        '
        'Label3
        '
        Me.Label3.Location = New System.Drawing.Point(8, 86)
        Me.Label3.Name = "Label3"
        Me.Label3.Size = New System.Drawing.Size(175, 18)
        Me.Label3.Text = "Количество"
        '
        'txtItem
        '
        Me.txtItem.Location = New System.Drawing.Point(8, 61)
        Me.txtItem.Name = "txtItem"
        Me.txtItem.Size = New System.Drawing.Size(209, 21)
        Me.txtItem.TabIndex = 5
        '
        'cmdProcess
        '
        Me.cmdProcess.Location = New System.Drawing.Point(8, 137)
        Me.cmdProcess.Name = "cmdProcess"
        Me.cmdProcess.Size = New System.Drawing.Size(209, 40)
        Me.cmdProcess.TabIndex = 6
        Me.cmdProcess.Text = "Провести"
        '
        'Timer1
        '
        '
        'frmOpIn
        '
        Me.AutoScaleDimensions = New System.Drawing.SizeF(96.0!, 96.0!)
        Me.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Dpi
        Me.AutoScroll = True
        Me.ClientSize = New System.Drawing.Size(240, 268)
        Me.ControlBox = False
        Me.Controls.Add(Me.cmdProcess)
        Me.Controls.Add(Me.txtItem)
        Me.Controls.Add(Me.Label3)
        Me.Controls.Add(Me.numQ)
        Me.Controls.Add(Me.Label2)
        Me.Controls.Add(Me.txtCellCode)
        Me.Controls.Add(Me.Label1)
        Me.Menu = Me.mainMenu1
        Me.Name = "frmOpIn"
        Me.Text = "Приемка"
        Me.ResumeLayout(False)

    End Sub
    Friend WithEvents Label1 As System.Windows.Forms.Label
    Friend WithEvents txtCellCode As System.Windows.Forms.TextBox
    Friend WithEvents MenuItem1 As System.Windows.Forms.MenuItem
    Friend WithEvents Label2 As System.Windows.Forms.Label
    Friend WithEvents numQ As System.Windows.Forms.NumericUpDown
    Friend WithEvents Label3 As System.Windows.Forms.Label
    Friend WithEvents txtItem As System.Windows.Forms.TextBox
    Friend WithEvents cmdProcess As System.Windows.Forms.Button
    Friend WithEvents Timer1 As System.Windows.Forms.Timer
    Friend WithEvents MenuItem2 As System.Windows.Forms.MenuItem
End Class
