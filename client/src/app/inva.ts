import { enums } from './enums';

export namespace inva { 
	/* inva -  Инвентаризация */ 

 export interface   inva_info { // Описание
	inva_infoId:string; // Primary key field
	invDate:string; // Дата инвентаризации
	invReason:string; // Причина инвентаризации
	 isFinished:enums.enum_YesNo; // Инвентаризация завершена
	 isFinished_name :string; // enum to text for Инвентаризация завершена
 }

 export interface   inva_real { // Наличие
	inva_realId:string; // Primary key field
	  inva_infoId:string; // Описание
	storepartid:string; //Запчасть -> invp_data
	qty:Number; // Количество
	locationid:string; //Стеллаж -> invwh_loc
	cellid:string; //Ячейка -> invwh_cell
	theStore:string; //Склад -> invd_store
	rFID:string; // Метка RFID
	// add dereference fields 
	storepartid_name :string; // dereference for invp_data
	locationid_name :string; // dereference for invwh_loc
	cellid_name :string; // dereference for invwh_cell
	theStore_name :string; // dereference for invd_store
 }

 export interface   inva_absnt { // Недостача
	inva_absntId:string; // Primary key field
	  inva_infoId:string; // Описание
	storepartid:string; //Запчасть -> invp_data
	qty:Number; // Количество
	// add dereference fields 
	storepartid_name :string; // dereference for invp_data
 }

 export interface   inva_extra { // Излишки
	inva_extraId:string; // Primary key field
	  inva_infoId:string; // Описание
	storepartid:string; //Запчасть -> invp_data
	qty:Number; // Количество
	locationid:string; //Стеллаж -> invwh_loc
	cellid:string; //Ячейка -> invwh_cell
	rFID:string; // Метка RFID
	// add dereference fields 
	storepartid_name :string; // dereference for invp_data
	locationid_name :string; // dereference for invwh_loc
	cellid_name :string; // dereference for invwh_cell
 }
}