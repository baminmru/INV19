import { enums } from './enums';

export namespace invwh { 
	/* invwh -  Структура склада */ 

 export interface   invwh_loc { // Стеллаж
	invwh_locId:string; // Primary key field
	theStore:string; //Склад -> invd_store
	name:string; // Название
	whZone:string; //Зона -> invd_zone
	// add dereference fields 
	theStore_name :string; // dereference for invd_store
	whZone_name :string; // dereference for invd_zone
 }

 export interface   invwh_cell { // Ячейка
	invwh_cellId:string; // Primary key field
	  invwh_locId:string; // Стеллаж
	name:string; // Название
	sHCODE:string; // Штрихкод ячейки
 }
}