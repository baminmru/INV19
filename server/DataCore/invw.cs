using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace inv19.models { 
	/* invw -  Заполнение склада */ 

 public class  invw_info { // Заполнение
	 public System.Guid  invw_infoId{ get; set; } // Primary key field
	public System.Guid  locationid { get; set; } //Стеллаж
	public System.Guid  cellid { get; set; } //Ячейка
	public System.Guid  storepartid { get; set; } //Запчасть
	[Required]
	public double  Qty{ get; set; } // Количество
 }
}