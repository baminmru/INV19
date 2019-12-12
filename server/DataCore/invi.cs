using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace inv19.models { 
	/* invi -  Запчасть */ 

 public class  invp_data { // Описание
	 public System.Guid  invp_dataId{ get; set; } // Primary key field
	[Required]
	public string  name{ get; set; } // Название
	[Required]
	public string  RFID{ get; set; } // Метка RFID
	public System.Guid  groupid { get; set; } //Группа
	public System.Guid  subgroupid { get; set; } //Подгруппа
	public System.Guid  departmentid { get; set; } //Отдел
	public System.Guid  machineid { get; set; } //Машина
 }
}