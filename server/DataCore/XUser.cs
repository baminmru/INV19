using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace inv19.models { 
	/* XUser -  Пользователь */ 

 public class  XUserInfo { // Описание
	 public System.Guid  XUserInfoId{ get; set; } // Primary key field

	[Required]
	public string  Family{ get; set; } // Фамилия
	[Required]
	public string  Login{ get; set; } // Имя для входа
	[Required]
	public string  SurName{ get; set; } // Отчество
	public string  EMail{ get; set; } // e-mail
	public string  Phone{ get; set; } // Телефон
	[Required]
	public string  Name{ get; set; } // Имя
	public DateTime?  Birthday{ get; set; } // Дата рождения
	public string  Password{ get; set; } // Пароль
	public string  City{ get; set; } // Город

 }

 
}