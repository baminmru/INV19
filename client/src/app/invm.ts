import { enums } from './enums';

export namespace invm { 
	/* invm -  Движение */ 

 export interface   invm_info { // Движение
	invm_infoId:string; // Primary key field
	fromcell:string; //Из ячейки -> invwh_cell
	toCell:string; //В ячейку -> invwh_cell
	storepartid:string; //Запчасть -> invp_data
	Qty:Number; // Количество
	optime:string;  // Время операции
	// add dereference fields 
	fromcell_name :string; // dereference for invwh_cell
	toCell_name :string; // dereference for invwh_cell
	storepartid_name :string; // dereference for invp_data
 }
}