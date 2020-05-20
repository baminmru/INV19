<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Partial Public Class frmInventoryCell
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
        Me.txtCellCode = New System.Windows.Forms.TextBox
        Me.Label1 = New System.Windows.Forms.Label
        Me.lstItems = New System.Windows.Forms.ListBox
        Me.Timer1 = New System.Windows.Forms.Timer
        Me.cmdProcess = New System.Windows.Forms.Button
        Me.numQ = New System.Windows.Forms.NumericUpDown
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
        Me.MenuItem1.Text = "Выход"
        '
        'txtCellCode
        '
        Me.txtCellCode.Location = New System.Drawing.Point(70, 3)
        Me.txtCellCode.Name = "txtCellCode"
        Me.txtCellCode.Size = New System.Drawing.Size(141, 21)
        Me.txtCellCode.TabIndex = 10
        '
        'Label1
        '
        Me.Label1.Location = New System.Drawing.Point(12, 3)
        Me.Label1.Name = "Label1"
        Me.Label1.Size = New System.Drawing.Size(52, 30)
        Me.Label1.Text = "Ячейка"
        '
        'lstItems
        '
        Me.lstItems.Location = New System.Drawing.Point(14, 26)
        Me.lstItems.Name = "lstItems"
        Me.lstItems.Size = New System.Drawing.Size(197, 72)
        Me.lstItems.TabIndex = 17
        '
        'Timer1
        '
        '
        'cmdProcess
        '
        Me.cmdProcess.Location = New System.Drawing.Point(14, 129)
        Me.cmdProcess.Name = "cmdProcess"
        Me.cmdProcess.Size = New System.Drawing.Size(197, 31)
        Me.cmdProcess.TabIndex = 20
        Me.cmdProcess.Text = "Провести"
        '
        'numQ
        '
        Me.numQ.Font = New System.Drawing.Font("Tahoma", 12.0!, System.Drawing.FontStyle.Regular)
        Me.numQ.Location = New System.Drawing.Point(14, 101)
        Me.numQ.Name = "numQ"
        Me.numQ.Size = New System.Drawing.Size(197, 27)
        Me.numQ.TabIndex = 23
        '
        'frmInventoryCell
        '
        Me.AutoScaleDimensions = New System.Drawing.SizeF(96.0!, 96.0!)
        Me.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Dpi
        Me.AutoScroll = True
        Me.ClientSize = New System.Drawing.Size(240, 268)
        Me.ControlBox = False
        Me.Controls.Add(Me.numQ)
        Me.Controls.Add(Me.cmdProcess)
        Me.Controls.Add(Me.lstItems)
        Me.Controls.Add(Me.txtCellCode)
        Me.Controls.Add(Me.Label1)
        Me.Menu = Me.mainMenu1
        Me.Name = "frmInventoryCell"
        Me.Text = "Инвентаризация ячейки"
        Me.ResumeLayout(False)

    End Sub
    Friend WithEvents txtCellCode As System.Windows.Forms.TextBox
    Friend WithEvents Label1 As System.Windows.Forms.Label
    Friend WithEvents MenuItem1 As System.Windows.Forms.MenuItem
    Friend WithEvents MenuItem2 As System.Windows.Forms.MenuItem
    Friend WithEvents lstItems As System.Windows.Forms.ListBox
    Friend WithEvents Timer1 As System.Windows.Forms.Timer
    Friend WithEvents cmdProcess As System.Windows.Forms.Button
    Friend WithEvents numQ As System.Windows.Forms.NumericUpDown
End Class
