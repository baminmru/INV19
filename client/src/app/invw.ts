import { enums } from './enums';

export namespace invw { 
	/* invw -  Заполнение склада */ 

 export interface   invw_info { // Заполнение
	invw_infoId:string; // Primary key field
	locationid:string; //Стеллаж -> invwh_loc
	cellid:string; //Ячейка -> invwh_cell
	storepartid:string; //Запчасть -> invp_data
	Qty:Number; // Количество
	// add dereference fields 
	locationid_name :string; // dereference for invwh_loc
	cellid_name :string; // dereference for invwh_cell
	storepartid_name :string; // dereference for invp_data
 }
}