import { enums } from './enums';

export namespace invops { 
	/* invops -  Операции */ 

 export interface   invops_in { // Приемка
	invops_inId:string; // Primary key field
	shCode:string; // Штрихкод ячейки
	thePart:string; //Деталь -> invp_data
	rfid:string; // RFID детали
	quantity:Number; // Количество
	// add dereference fields 
	thePart_name :string; // dereference for invp_data
 }

 export interface   invops_move { // Перемещение
	invops_moveId:string; // Primary key field
	shCodeFrom:string; // Штрихкод начальной ячейки 
	shCodeTo:string; // Штрихкод конечной ячейки
	rfid:string; // RFID детали
	// quantity:Number; // Количество
 }

 export interface   invops_out { // Отгрузка
	invops_outId:string; // Primary key field
	shCode:string; // Штрихкод ячейки
	rfid:string; // RFID детали
	quantity:Number; // Количество
	theDept:string; //Отдел -> invd_dep
	// add dereference fields 
	theDept_name :string; // dereference for invd_dep
 }
}