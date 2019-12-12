using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace inv19.models { 
	/* invwh -  Структура склада */ 

 public class  invwh_loc { // Стеллаж
	 public System.Guid  invwh_locId{ get; set; } // Primary key field
	 public List<invwh_cell>  invwh_cell { get; set; } // Ячейка
	[Required]
	public string  name{ get; set; } // Название
	public System.Guid  whZone { get; set; } //Зона
 }

 public class  invwh_cell { // Ячейка
	 public System.Guid  invwh_cellId{ get; set; } // Primary key field
	[Required]
	 public System.Guid  invwh_locId { get; set; } // Id for Стеллаж
	[Required]
	public string  name{ get; set; } // Название
	public string  SHCODE{ get; set; } // Штрихкод ячейки
 }
}