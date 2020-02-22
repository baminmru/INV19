import { enums } from './enums';

export namespace invm { 
	/* invm -  История */ 

 export interface   invm_info { // История
	invm_infoId:string; // Primary key field
	fromcell:string; //Из ячейки -> invwh_cell
	toCell:string; //В ячейку -> invwh_cell
	theDep:string; //В отдел -> invd_dep
	storepartid:string; //Запчасть -> invp_data
	qty:Number; // Количество
	theOP:string; //Операция -> invd_op
	optime:string;  // Время операции
	theUser:string; //Оператор -> xUserInfo
	// add dereference fields 
	fromcell_name :string; // dereference for invwh_cell
	toCell_name :string; // dereference for invwh_cell
	theDep_name :string; // dereference for invd_dep
	storepartid_name :string; // dereference for invp_data
	theOP_name :string; // dereference for invd_op
	theUser_name :string; // dereference for xUserInfo
 }
}