using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace inv19.models { 
	/* invg -  Группы */ 

 public class  invg_grp { // Группа
	 public System.Guid  invg_grpId{ get; set; } // Идентификатор (первичный ключ)
	 public List<invg_subgrp>  invg_subgrp { get; set; } // дочерний раздел: Подгруппа
	[Required]
	public string  name{ get; set; } // Название
 }

 public class  invg_subgrp { // Подгруппа
	 public System.Guid  invg_subgrpId{ get; set; } // Идентификатор (первичный ключ)
	[Required]
	 public System.Guid  invg_grpId { get; set; } // обратная ссылка на: Группа
	[Required]
	public string  name{ get; set; } // Название
 }
}