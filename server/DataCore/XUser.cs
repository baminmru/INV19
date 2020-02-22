using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace inv19.models { 
	/* XUser -  Оператор */ 

 public class  xUserInfo { // Оператор
	 public System.Guid  xUserInfoId{ get; set; } // Идентификатор (первичный ключ)
	[Required]
	public string  family{ get; set; } // Фамилия
	[Required]
	public string  name{ get; set; } // Имя
	public string  partonymic{ get; set; } // Отчество
	public string  email{ get; set; } // e-mail
	public string  phone{ get; set; } // Телефон
	[Required]
	public string  login{ get; set; } // Имя для входа
	public enum_YesNo  islocked{ get; set; } // Заблокирован
 }
}