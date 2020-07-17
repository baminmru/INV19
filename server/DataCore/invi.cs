using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace inv19.models { 
	/* invi -  Запчасть */ 

 public class  invp_data { // Описание
	 public System.Guid  invp_dataId{ get; set; } // Идентификатор (первичный ключ)
	 public List<invp_tag>  invp_tag { get; set; } // дочерний раздел: Метки
	[Required]
	public string  name{ get; set; } // Название
	public System.Guid  groupid { get; set; } //Группа
	
	public System.Guid  subgroupid { get; set; } //Подгруппа

	public System.Guid  departmentid { get; set; } //Отдел
	
	public System.Guid  machineid { get; set; } //Машина
	
 }

 public class  invp_tag { // Метки
	 public System.Guid  invp_tagId{ get; set; } // Идентификатор (первичный ключ)
	[Required]
	 public System.Guid  invp_dataId { get; set; } // обратная ссылка на: Описание
	[Required]
	public string  RFID{ get; set; } // Метка RFID
 }
}