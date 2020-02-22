using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace inv19.models { 
	/* invw -  Наличие */ 

 public class  invw_info { // Наличие
	 public System.Guid  invw_infoId{ get; set; } // Идентификатор (первичный ключ)
	public System.Guid  theStore { get; set; } //Склад
	
	public System.Guid  locationid { get; set; } //Стеллаж
	
	public System.Guid  cellid { get; set; } //Ячейка

	public System.Guid  storepartid { get; set; } //Запчасть
	
	[Required]
	public double  Qty{ get; set; } // Количество
	[Required]
	public string  RFID{ get; set; } // Метка RFID
 }
}