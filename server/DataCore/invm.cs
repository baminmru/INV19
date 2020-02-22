using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace inv19.models { 
	/* invm -  История */ 

 public class  invm_info { // История
	 public System.Guid  invm_infoId{ get; set; } // Идентификатор (первичный ключ)
	public System.Guid  fromcell { get; set; } //Из ячейки
	[ForeignKey("fromcell")]
	public invwh_cell invwh_cell_from { get; set; } // Объект - Из ячейки
	public System.Guid  toCell { get; set; } //В ячейку
	[ForeignKey("toCell")]
	public invwh_cell invwh_cell_to { get; set; } // Объект - В ячейку
	public System.Guid  theDep { get; set; } //В отдел
	[ForeignKey("theDep")]
	public invd_dep invd_dep { get; set; } // Объект - В отдел
	public System.Guid  storepartid { get; set; } //Запчасть
	[ForeignKey("storepartid")]
	public invp_data invp_data { get; set; } // Объект - Запчасть
	[Required]
	public double  Qty{ get; set; } // Количество
	public System.Guid  theOP { get; set; } //Операция
	[ForeignKey("theOP")]
	public invd_op invd_op { get; set; } // Объект - Операция
	[Required]
	public DateTime  optime{ get; set; } // Время операции
	public System.Guid  theUser { get; set; } //Оператор
	[ForeignKey("theUser")]
	public xUserInfo xUserInfo { get; set; } // Объект - Оператор
 }
}