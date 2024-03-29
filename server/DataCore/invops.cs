﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace inv19.models {
	/* invops -  Операции */



	public class invops_register // Регистрация
	{ 
		public System.Guid thePart { get; set; } //Деталь

		[Required]
		public string rfid { get; set; } // RFID детали
		
	}



	public class invops_inventory 
	{

		[Required]
		public Guid InventoryID { get; set; } // инвентаризация

		[Required]
		public string shCode { get; set; } // штрихкод ячейки

		[Required]
		public string rfid { get; set; } // RFID детали

		[Required]
		public int quantity { get; set; } // Количество
	}


	public class invops_clearcell
	{

		[Required]
		public Guid InventoryID { get; set; } // инвентаризация

		[Required]
		public string shCode { get; set; } // штрихкод ячейки

	}


	public class  invops_in { // Приемка
	 public System.Guid  invops_inId{ get; set; } // Идентификатор (первичный ключ)
	[Required]
	public string  shCode{ get; set; } // Штрихкод ячейки
	public System.Guid  thePart { get; set; } //Деталь
	
	[Required]
	public string  rfid{ get; set; } // RFID детали
	[Required]
	public int  quantity{ get; set; } // Количество
 }

 public class  invops_move { // Перемещение
	 public System.Guid  invops_moveId{ get; set; } // Идентификатор (первичный ключ)
	[Required]
	public string  shCodeFrom{ get; set; } // Штрихкод начальной ячейки 
	[Required]
	public string  shCodeTo{ get; set; } // Штрихкод конечной ячейки
	[Required]
	public string  rfid{ get; set; } // RFID детали

	//[Required]
	//public int  quantity{ get; set; } // Количество
 }

 public class  invops_out { // Отргузка
	 public System.Guid  invops_outId{ get; set; } // Идентификатор (первичный ключ)
	[Required]
	public string  shCode{ get; set; } // Штрихкод ячейки
	[Required]
	public string  rfid{ get; set; } // RFID детали
	[Required]
	public int  quantity{ get; set; } // Количество
	public System.Guid  theDept { get; set; } //Отдел
	
 }
}