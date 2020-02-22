using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace inv19.models { 
	/* invi -  Запчасть */ 

 public class  invp_data { // Описание
	 public System.Guid  invp_dataId{ get; set; } // Идентификатор (первичный ключ)
	[Required]
	public string  name{ get; set; } // Название
	[Required]
	public string  RFID{ get; set; } // Метка RFID
	public System.Guid  groupid { get; set; } //Группа
	[ForeignKey("groupid")]
	public invg_grp invg_grp { get; set; } // Объект - Группа
	public System.Guid  subgroupid { get; set; } //Подгруппа
	[ForeignKey("subgroupid")]
	public invg_subgrp invg_subgrp { get; set; } // Объект - Подгруппа
	public System.Guid  departmentid { get; set; } //Отдел
	[ForeignKey("departmentid")]
	public invd_dep invd_dep { get; set; } // Объект - Отдел
	public System.Guid  machineid { get; set; } //Машина
	[ForeignKey("machineid")]
	public invd_machine invd_machine { get; set; } // Объект - Машина
 }
}