import { enums } from './enums';

export namespace invwh { 
	/* invwh -  Структура склада */ 

 export interface   invwh_loc { // Стеллаж
	invwh_locId:string; // Primary key field
	name:string; // Название
	whZone:string; //Зона -> invd_zone
	// add dereference fields 
	whZone_name :string; // dereference for invd_zone
 }

 export interface   invwh_cell { // Ячейка
	invwh_cellId:string; // Primary key field
	  invwh_locId:string; // Стеллаж
	name:string; // Название
	SHCODE:string; // Штрихкод ячейки
 }
}