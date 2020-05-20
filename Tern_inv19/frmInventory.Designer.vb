<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Partial Public Class frmInventory
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
        Me.cmbInv = New System.Windows.Forms.ComboBox
        Me.Label1 = New System.Windows.Forms.Label
        Me.cmdProcess = New System.Windows.Forms.Button
        Me.cmdStopInv = New System.Windows.Forms.Button
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
        'cmbInv
        '
        Me.cmbInv.Location = New System.Drawing.Point(12, 37)
        Me.cmbInv.Name = "cmbInv"
        Me.cmbInv.Size = New System.Drawing.Size(201, 22)
        Me.cmbInv.TabIndex = 0
        '
        'Label1
        '
        Me.Label1.Location = New System.Drawing.Point(10, 5)
        Me.Label1.Name = "Label1"
        Me.Label1.Size = New System.Drawing.Size(201, 27)
        Me.Label1.Text = "Инвентаризация"
        '
        'cmdProcess
        '
        Me.cmdProcess.Location = New System.Drawing.Point(12, 69)
        Me.cmdProcess.Name = "cmdProcess"
        Me.cmdProcess.Size = New System.Drawing.Size(201, 40)
        Me.cmdProcess.TabIndex = 2
        Me.cmdProcess.Text = "Сбор данных"
        '
        'cmdStopInv
        '
        Me.cmdStopInv.Location = New System.Drawing.Point(12, 115)
        Me.cmdStopInv.Name = "cmdStopInv"
        Me.cmdStopInv.Size = New System.Drawing.Size(201, 40)
        Me.cmdStopInv.TabIndex = 3
        Me.cmdStopInv.Text = "Завершить инвентаризацию"
        '
        'frmInventory
        '
        Me.AutoScaleDimensions = New System.Drawing.SizeF(96.0!, 96.0!)
        Me.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Dpi
        Me.AutoScroll = True
        Me.ClientSize = New System.Drawing.Size(240, 268)
        Me.ControlBox = False
        Me.Controls.Add(Me.cmdStopInv)
        Me.Controls.Add(Me.cmdProcess)
        Me.Controls.Add(Me.Label1)
        Me.Controls.Add(Me.cmbInv)
        Me.Menu = Me.mainMenu1
        Me.Name = "frmInventory"
        Me.Text = "Инвентаризация"
        Me.ResumeLayout(False)

    End Sub
    Friend WithEvents cmbInv As System.Windows.Forms.ComboBox
    Friend WithEvents MenuItem1 As System.Windows.Forms.MenuItem
    Friend WithEvents Label1 As System.Windows.Forms.Label
    Friend WithEvents cmdProcess As System.Windows.Forms.Button
    Friend WithEvents cmdStopInv As System.Windows.Forms.Button
End Class
