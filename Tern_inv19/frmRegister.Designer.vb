<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Partial Public Class frmRegister
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
        Me.cmdProcess = New System.Windows.Forms.Button
        Me.txtItem = New System.Windows.Forms.TextBox
        Me.Label2 = New System.Windows.Forms.Label
        Me.lstPart = New System.Windows.Forms.ListBox
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
        'cmdProcess
        '
        Me.cmdProcess.Location = New System.Drawing.Point(15, 125)
        Me.cmdProcess.Name = "cmdProcess"
        Me.cmdProcess.Size = New System.Drawing.Size(198, 40)
        Me.cmdProcess.TabIndex = 9
        Me.cmdProcess.Text = "Зарегистрировать"
        '
        'txtItem
        '
        Me.txtItem.Location = New System.Drawing.Point(15, 99)
        Me.txtItem.Name = "txtItem"
        Me.txtItem.Size = New System.Drawing.Size(198, 21)
        Me.txtItem.TabIndex = 8
        '
        'Label2
        '
        Me.Label2.Location = New System.Drawing.Point(15, 79)
        Me.Label2.Name = "Label2"
        Me.Label2.Size = New System.Drawing.Size(198, 18)
        Me.Label2.Text = "RFID"
        '
        'lstPart
        '
        Me.lstPart.Location = New System.Drawing.Point(15, 4)
        Me.lstPart.Name = "lstPart"
        Me.lstPart.Size = New System.Drawing.Size(198, 72)
        Me.lstPart.TabIndex = 11
        '
        'Timer1
        '
        '
        'frmRegister
        '
        Me.AutoScaleDimensions = New System.Drawing.SizeF(96.0!, 96.0!)
        Me.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Dpi
        Me.AutoScroll = True
        Me.ClientSize = New System.Drawing.Size(240, 268)
        Me.Controls.Add(Me.lstPart)
        Me.Controls.Add(Me.cmdProcess)
        Me.Controls.Add(Me.txtItem)
        Me.Controls.Add(Me.Label2)
        Me.Menu = Me.mainMenu1
        Me.Name = "frmRegister"
        Me.Text = "Регистрация метки"
        Me.ResumeLayout(False)

    End Sub
    Friend WithEvents cmdProcess As System.Windows.Forms.Button
    Friend WithEvents txtItem As System.Windows.Forms.TextBox
    Friend WithEvents Label2 As System.Windows.Forms.Label
    Friend WithEvents lstPart As System.Windows.Forms.ListBox
    Friend WithEvents MenuItem1 As System.Windows.Forms.MenuItem
    Friend WithEvents MenuItem2 As System.Windows.Forms.MenuItem
    Friend WithEvents Timer1 As System.Windows.Forms.Timer
End Class
