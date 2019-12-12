using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace inv19.models { 
	/* invd -  Справочник */ 

 public class  invd_dep { // Отдел
	 public System.Guid  invd_depId{ get; set; } // Primary key field
	[Required]
	public string  name{ get; set; } // Название
 }

 public class  invd_machine { // Машина
	 public System.Guid  invd_machineId{ get; set; } // Primary key field
	[Required]
	public string  name{ get; set; } // Название
 }

 public class  invd_zone { // Зона склада
	 public System.Guid  invd_zoneId{ get; set; } // Primary key field
	[Required]
	public string  name{ get; set; } // Название
 }
}