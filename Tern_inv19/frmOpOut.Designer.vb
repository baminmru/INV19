<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Partial Public Class frmOpOut
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
        Me.Label3 = New System.Windows.Forms.Label
        Me.NumQ = New System.Windows.Forms.NumericUpDown
        Me.Label2 = New System.Windows.Forms.Label
        Me.txtCellCode = New System.Windows.Forms.TextBox
        Me.Label1 = New System.Windows.Forms.Label
        Me.cmbDep = New System.Windows.Forms.ComboBox
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
        Me.cmdProcess.Location = New System.Drawing.Point(15, 140)
        Me.cmdProcess.Name = "cmdProcess"
        Me.cmdProcess.Size = New System.Drawing.Size(199, 40)
        Me.cmdProcess.TabIndex = 20
        Me.cmdProcess.Text = "Провести"
        '
        'txtItem
        '
        Me.txtItem.Location = New System.Drawing.Point(115, 20)
        Me.txtItem.Name = "txtItem"
        Me.txtItem.Size = New System.Drawing.Size(99, 21)
        Me.txtItem.TabIndex = 19
        '
        'Label3
        '
        Me.Label3.Location = New System.Drawing.Point(15, 44)
        Me.Label3.Name = "Label3"
        Me.Label3.Size = New System.Drawing.Size(210, 18)
        Me.Label3.Text = "Количество"
        '
        'NumQ
        '
        Me.NumQ.Font = New System.Drawing.Font("Tahoma", 12.0!, System.Drawing.FontStyle.Regular)
        Me.NumQ.Location = New System.Drawing.Point(15, 61)
        Me.NumQ.Name = "NumQ"
        Me.NumQ.Size = New System.Drawing.Size(199, 27)
        Me.NumQ.TabIndex = 18
        '
        'Label2
        '
        Me.Label2.Location = New System.Drawing.Point(115, 0)
        Me.Label2.Name = "Label2"
        Me.Label2.Size = New System.Drawing.Size(99, 21)
        Me.Label2.Text = "Запчасть"
        '
        'txtCellCode
        '
        Me.txtCellCode.Location = New System.Drawing.Point(15, 20)
        Me.txtCellCode.Name = "txtCellCode"
        Me.txtCellCode.Size = New System.Drawing.Size(94, 21)
        Me.txtCellCode.TabIndex = 17
        '
        'Label1
        '
        Me.Label1.Location = New System.Drawing.Point(15, -1)
        Me.Label1.Name = "Label1"
        Me.Label1.Size = New System.Drawing.Size(94, 18)
        Me.Label1.Text = "Из ячейки"
        '
        'cmbDep
        '
        Me.cmbDep.DisplayMember = "name"
        Me.cmbDep.Location = New System.Drawing.Point(15, 112)
        Me.cmbDep.Name = "cmbDep"
        Me.cmbDep.Size = New System.Drawing.Size(199, 22)
        Me.cmbDep.TabIndex = 24
        Me.cmbDep.ValueMember = "id"
        '
        'Label4
        '
        Me.Label4.Location = New System.Drawing.Point(15, 90)
        Me.Label4.Name = "Label4"
        Me.Label4.Size = New System.Drawing.Size(199, 19)
        Me.Label4.Text = "Отдел"
        '
        'Timer1
        '
        '
        'frmOpOut
        '
        Me.AutoScaleDimensions = New System.Drawing.SizeF(96.0!, 96.0!)
        Me.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Dpi
        Me.AutoScroll = True
        Me.ClientSize = New System.Drawing.Size(240, 268)
        Me.ControlBox = False
        Me.Controls.Add(Me.Label4)
        Me.Controls.Add(Me.cmbDep)
        Me.Controls.Add(Me.cmdProcess)
        Me.Controls.Add(Me.txtItem)
        Me.Controls.Add(Me.Label3)
        Me.Controls.Add(Me.NumQ)
        Me.Controls.Add(Me.Label2)
        Me.Controls.Add(Me.txtCellCode)
        Me.Controls.Add(Me.Label1)
        Me.Menu = Me.mainMenu1
        Me.Name = "frmOpOut"
        Me.Text = "Отгрузка"
        Me.ResumeLayout(False)

    End Sub
    Friend WithEvents cmdProcess As System.Windows.Forms.Button
    Friend WithEvents txtItem As System.Windows.Forms.TextBox
    Friend WithEvents Label3 As System.Windows.Forms.Label
    Friend WithEvents NumQ As System.Windows.Forms.NumericUpDown
    Friend WithEvents Label2 As System.Windows.Forms.Label
    Friend WithEvents txtCellCode As System.Windows.Forms.TextBox
    Friend WithEvents Label1 As System.Windows.Forms.Label
    Friend WithEvents cmbDep As System.Windows.Forms.ComboBox
    Friend WithEvents Label4 As System.Windows.Forms.Label
    Friend WithEvents MenuItem2 As System.Windows.Forms.MenuItem
    Friend WithEvents Timer1 As System.Windows.Forms.Timer
    Friend WithEvents MenuItem1 As System.Windows.Forms.MenuItem
End Class
