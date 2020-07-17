using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace inv19.models { 
	/* invm -  История */ 

 public class  invm_info { // История
	 public System.Guid  invm_infoId{ get; set; } // Идентификатор (первичный ключ)
	public System.Guid  fromcell { get; set; } //Из ячейки
	
	public System.Guid  toCell { get; set; } //В ячейку

	public System.Guid  theDep { get; set; } //В отдел
	
	public System.Guid  storepartid { get; set; } //Запчасть
	
	[Required]
	public double  Qty{ get; set; } // Количество
	public System.Guid  theOP { get; set; } //Операция
	
	[Required]
	public DateTime  optime{ get; set; } // Время операции
	public System.Guid  theUser { get; set; } //Оператор
	
 }
}