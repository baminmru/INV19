import { enums } from './enums';

export namespace XUser { 
	/* XUser -  Оператор */ 

 export interface   xUserInfo { // Оператор
	xUserInfoId:string; // Primary key field
	family:string; // Фамилия
	name:string; // Имя
	partonymic:string; // Отчество
	email:string; // e-mail
	phone:string; // Телефон
	login:string; // Имя для входа
	 islocked:enums.enum_YesNo; // Заблокирован
	 islocked_name :string; // enum to text for Заблокирован
 }
}