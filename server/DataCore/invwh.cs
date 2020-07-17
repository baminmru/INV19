using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace inv19.models { 
	/* invwh -  Структура склада */ 

 public class  invwh_loc { // Стеллаж
	 public System.Guid  invwh_locId{ get; set; } // Идентификатор (первичный ключ)
	 public List<invwh_cell>  invwh_cell { get; set; } // дочерний раздел: Ячейка
	public System.Guid  theStore { get; set; } //Склад
	
	[Required]
	public string  name{ get; set; } // Название
	public System.Guid  whZone { get; set; } //Зона
	
 }

 public class  invwh_cell { // Ячейка
	 public System.Guid  invwh_cellId{ get; set; } // Идентификатор (первичный ключ)
	[Required]
	 public System.Guid  invwh_locId { get; set; } // обратная ссылка на: Стеллаж
	[Required]
	public string  name{ get; set; } // Название
	public string  SHCODE{ get; set; } // Штрихкод ячейки
 }
}