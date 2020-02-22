import { enums } from './enums';

export namespace invw { 
	/* invw -  Наличие */ 

 export interface   invw_info { // Наличие
	invw_infoId:string; // Primary key field
	theStore:string; //Склад -> invd_store
	locationid:string; //Стеллаж -> invwh_loc
	cellid:string; //Ячейка -> invwh_cell
	storepartid:string; //Запчасть -> invp_data
	qty:Number; // Количество
	rFID:string; // Метка RFID
	// add dereference fields 
	theStore_name :string; // dereference for invd_store
	locationid_name :string; // dereference for invwh_loc
	cellid_name :string; // dereference for invwh_cell
	storepartid_name :string; // dereference for invp_data
 }
}