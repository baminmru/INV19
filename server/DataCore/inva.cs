using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace inv19.models { 
	/* inva -  Инвентраизация */ 

 public class  inva_info { // Описание
	 public System.Guid  inva_infoId{ get; set; } // Primary key field
	 public List<inva_real>  inva_real { get; set; } // Наличие
	 public List<inva_absnt>  inva_absnt { get; set; } // Недостача
	 public List<inva_extra>  inva_extra { get; set; } // Излишки
	[Required]
	public DateTime  invDate{ get; set; } // Дата инвентаризации
	public string  invReason{ get; set; } // Причина инвентаризации
	public enum_YesNo  isFinished{ get; set; } // Инвентаризация завершена
 }

 public class  inva_real { // Наличие
	 public System.Guid  inva_realId{ get; set; } // Primary key field
	[Required]
	 public System.Guid  inva_infoId { get; set; } // Id for Описание
	public System.Guid  storepartid { get; set; } //Запчасть
	[Required]
	public double  Qty{ get; set; } // Количество
	public System.Guid  locationid { get; set; } //Стеллаж
	public System.Guid  cellid { get; set; } //Ячейка
 }

 public class  inva_absnt { // Недостача
	 public System.Guid  inva_absntId{ get; set; } // Primary key field
	[Required]
	 public System.Guid  inva_infoId { get; set; } // Id for Описание
	public System.Guid  storepartid { get; set; } //Запчасть
	[Required]
	public double  Qty{ get; set; } // Количество
 }

 public class  inva_extra { // Излишки
	 public System.Guid  inva_extraId{ get; set; } // Primary key field
	[Required]
	 public System.Guid  inva_infoId { get; set; } // Id for Описание
	public System.Guid  storepartid { get; set; } //Запчасть
	[Required]
	public double  Qty{ get; set; } // Количество
	public System.Guid  locationid { get; set; } //Стеллаж
	public System.Guid  cellid { get; set; } //Ячейка
 }
}