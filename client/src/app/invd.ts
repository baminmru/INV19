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

 export interface   invd_zone { // Зона склада
	invd_zoneId:string; // Primary key field
	name:string; // Название
 }
}