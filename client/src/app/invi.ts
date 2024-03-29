﻿import { enums } from './enums';

export namespace invi { 
	/* invi -  Запчасть */ 

 export interface   invp_data { // Описание
	invp_dataId:string; // Primary key field
	name:string; // Название
	groupid:string; //Группа -> invg_grp
	subgroupid:string; //Подгруппа -> invg_subgrp
	departmentid:string; //Отдел -> invd_dep
	machineid:string; //Машина -> invd_machine
	// add dereference fields 
	groupid_name :string; // dereference for invg_grp
	subgroupid_name :string; // dereference for invg_subgrp
	departmentid_name :string; // dereference for invd_dep
	machineid_name :string; // dereference for invd_machine
 }

 export interface   invp_tag { // Метки
	invp_tagId:string; // Primary key field
	  invp_dataId:string; // Описание
	rFID:string; // Метка RFID
 }
}