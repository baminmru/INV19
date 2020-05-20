<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Partial Public Class frm19Main
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
        Me.cmdOpIN = New System.Windows.Forms.Button
        Me.cmdOpMove = New System.Windows.Forms.Button
        Me.cmdOpOut = New System.Windows.Forms.Button
        Me.cmdOpInv = New System.Windows.Forms.Button
        Me.Button1 = New System.Windows.Forms.Button
        Me.SuspendLayout()
        '
        'mainMenu1
        '
        Me.mainMenu1.MenuItems.Add(Me.MenuItem1)
        '
        'MenuItem1
        '
        Me.MenuItem1.Text = "Выход"
        '
        'cmdOpIN
        '
        Me.cmdOpIN.Location = New System.Drawing.Point(3, 39)
        Me.cmdOpIN.Name = "cmdOpIN"
        Me.cmdOpIN.Size = New System.Drawing.Size(210, 32)
        Me.cmdOpIN.TabIndex = 0
        Me.cmdOpIN.Text = "Приемка"
        '
        'cmdOpMove
        '
        Me.cmdOpMove.Location = New System.Drawing.Point(3, 74)
        Me.cmdOpMove.Name = "cmdOpMove"
        Me.cmdOpMove.Size = New System.Drawing.Size(210, 32)
        Me.cmdOpMove.TabIndex = 1
        Me.cmdOpMove.Text = "Перемещение"
        '
        'cmdOpOut
        '
        Me.cmdOpOut.Location = New System.Drawing.Point(3, 110)
        Me.cmdOpOut.Name = "cmdOpOut"
        Me.cmdOpOut.Size = New System.Drawing.Size(210, 32)
        Me.cmdOpOut.TabIndex = 2
        Me.cmdOpOut.Text = "Отгрузка"
        '
        'cmdOpInv
        '
        Me.cmdOpInv.Location = New System.Drawing.Point(3, 146)
        Me.cmdOpInv.Name = "cmdOpInv"
        Me.cmdOpInv.Size = New System.Drawing.Size(210, 32)
        Me.cmdOpInv.TabIndex = 3
        Me.cmdOpInv.Text = "Инвентаризация"
        '
        'Button1
        '
        Me.Button1.Location = New System.Drawing.Point(3, 4)
        Me.Button1.Name = "Button1"
        Me.Button1.Size = New System.Drawing.Size(210, 32)
        Me.Button1.TabIndex = 4
        Me.Button1.Text = "Регистрация"
        '
        'frm19Main
        '
        Me.AutoScaleDimensions = New System.Drawing.SizeF(96.0!, 96.0!)
        Me.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Dpi
        Me.AutoScroll = True
        Me.ClientSize = New System.Drawing.Size(240, 268)
        Me.ControlBox = False
        Me.Controls.Add(Me.Button1)
        Me.Controls.Add(Me.cmdOpInv)
        Me.Controls.Add(Me.cmdOpOut)
        Me.Controls.Add(Me.cmdOpMove)
        Me.Controls.Add(Me.cmdOpIN)
        Me.Menu = Me.mainMenu1
        Me.Name = "frm19Main"
        Me.Text = "Выбор операции"
        Me.ResumeLayout(False)

    End Sub
    Friend WithEvents MenuItem1 As System.Windows.Forms.MenuItem
    Friend WithEvents cmdOpIN As System.Windows.Forms.Button
    Friend WithEvents cmdOpMove As System.Windows.Forms.Button
    Friend WithEvents cmdOpOut As System.Windows.Forms.Button
    Friend WithEvents cmdOpInv As System.Windows.Forms.Button
    Friend WithEvents Button1 As System.Windows.Forms.Button
End Class
