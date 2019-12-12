import { enums } from './enums';

export namespace invg { 
	/* invg -  Группы */ 

 export interface   invg_grp { // Группа
	invg_grpId:string; // Primary key field
	name:string; // Название
 }

 export interface   invg_subgrp { // Подгруппа
	invg_subgrpId:string; // Primary key field
	  invg_grpId:string; // Группа
	name:string; // Название
 }
}