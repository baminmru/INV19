using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace inv19.models { 
	/* invm -  Движение */ 

 public class  invm_info { // Движение
	 public System.Guid  invm_infoId{ get; set; } // Primary key field
	public System.Guid  fromcell { get; set; } //Из ячейки
	public System.Guid  toCell { get; set; } //В ячейку
	public System.Guid  storepartid { get; set; } //Запчасть
	[Required]
	public double  Qty{ get; set; } // Количество
	[Required]
	public DateTime  optime{ get; set; } // Время операции
 }
}