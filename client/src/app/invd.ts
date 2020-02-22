import { enums } from './enums';

export namespace invd { 
	/* invd -  Справочник */ 

 export interface   invd_dep { // Отдел
	invd_depId:string; // Primary key field
	name:string; // Название
 }

 export interface   invd_machine { // Машина
	invd_machineId:string; // Primary key field
	name:string; // Название
 }

 export interface   invd_op { // Операции
	invd_opId:string; // Primary key field
	name:string; // Название
 }

 export interface   invd_store { // Склад
	invd_storeId:string; // Primary key field
	name:string; // Название
 }

 export interface   invd_zone { // Зона склада
	invd_zoneId:string; // Primary key field
	name:string; // Название
 }
}