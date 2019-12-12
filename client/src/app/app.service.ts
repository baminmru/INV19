﻿import { Injectable } from '@angular/core'; 
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http'; 
import { Observable,BehaviorSubject } from 'rxjs'; 
import { environment } from '../environments/environment';

import { invg } from "app/invg";
import { invm } from "app/invm";
import { invw } from "app/invw";
import { invi } from "app/invi";
import { inva } from "app/inva";
import { invd } from "app/invd";
import { invwh } from "app/invwh";
import { UserProfile } from "app/UserProfile";
	
export class ComboInfo{ 
	id:string; 
	name:string; 
} 
 

 
@Injectable() 
export class AppService { 
	private serviceURL: string = environment.baseAppUrl; 
	 
	public isLoggedIn:boolean=false;
	
	private _newrole:boolean=true;
	private _role:string="";
	
	private _newuser:boolean=true;
	private _user:string="";

	private _newchecker:boolean=true;
	private _checker:string="";
	
	
	private myToken:UserProfile.TokenInfo={} as UserProfile.TokenInfo;
	private authResponce:any;
	private UserInfo: UserProfile.LoggedUserInfo;
	
	
	public GetToken():string {
		return this.myToken.access_token;
		}

	public jwtLogin(email:string,password:string, callback, errorCallback){
		let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		var li:UserProfile.LoginRequest = new UserProfile.LoginRequest();
		li.email = email;
		li.password = password; 
		//console.log("Send: "+JSON.stringify( li));
		this.http.post(this.serviceURL + '/account/login',JSON.stringify( li) , { headers: cpHeaders }).subscribe(
		    Data => {
				this.authResponce=Data;
				//console.log("RcvAuth: " + JSON.stringify(this.authResponce));
				this.myToken=this.authResponce.data;
				if(	  this.myToken != null ){
					 sessionStorage.setItem('auth_token', this.myToken.access_token);
					 //console.log("Rcv: " + JSON.stringify(this.myToken));
					 this.jwtUserInfo(callback);
					  setTimeout(this.jwtRefresh.bind(this),(this.myToken.expires_in-5) * 1000);
				}else{
					if(typeof errorCallback =='function'){
					  errorCallback(this.authResponce.description);
					}
				}
		    }, 
			error => {
				if(typeof errorCallback == 'function'){ 
					errorCallback(error.message); 
				} 
			}
		); 

    }
	
	

	
	
	public jwtLogout(){
		if(this.isLoggedIn){
			 let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
			 
			 this.http.get(this.serviceURL + '/account/logout' , { headers: cpHeaders }).subscribe(Data => {
					 this.authResponce='';
					 this.myToken=null;
					 sessionStorage.setItem('auth_token', '');
					 this.Role ='';
					 this.User ='';
					 this.isLoggedIn=false;
				 }); 
		}

    }
	

	public jwtRefresh(){
	 //console.log("jwtRefresh")
	 let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
	 // let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
	 var li:UserProfile.RefreshTokenRequest = new UserProfile.RefreshTokenRequest();
	 li.RefreshToken = this.myToken.refresh_token
	 //console.log("Send: "+JSON.stringify( li));
	
     this.http.post(this.serviceURL + '/account/refreshtoken',JSON.stringify( li) , { headers: cpHeaders }).subscribe(
		 Data => {
			 
			 this.authResponce=Data;
			 //console.log("RcvAuth: " + JSON.stringify(this.authResponce));
			 this.myToken=this.authResponce.data;
			 
			if(	  this.myToken != null ){
				sessionStorage.setItem('auth_token', this.myToken.access_token);
				//console.log("Rcv: " + JSON.stringify(this.myToken));
				//this.jwtUserInfo(function() {});
				setTimeout(this.jwtRefresh.bind(this),(this.myToken.expires_in-5) * 1000);
			}else{
				this.authResponce='';
				this.myToken=null;
				sessionStorage.setItem('auth_token', '');
				this.Role ='';
				this.User ='';
				this.isLoggedIn=false;
				console.log("Token expiered, Logoff loccally");
			}
		}
		, 
		error => {
				this.authResponce='';
				this.myToken=null;
				sessionStorage.setItem('auth_token', '');
				this.Role ='';
				this.User ='';
				this.isLoggedIn=false;
				console.log("Token refresh error, Logoff loccally");
		}
	 
	 ); 
    }
	
	
	public jwtUserInfo(callback){
	     let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ this.myToken.access_token})
         this.http.post(this.serviceURL + '/account/private',"", { headers: cpHeaders }).subscribe(Data => {
			 this.UserInfo=Data as UserProfile.LoggedUserInfo;
			 //console.log("Rcv user info: " + JSON.stringify(this.UserInfo));
			 this.Role =this.UserInfo.roles;
			 this.User =this.UserInfo.id;
			 
			 this.isLoggedIn=true;
			 if(typeof callback =='function'){
				 callback();
			 }
			 
			 
			 /*
			 // add users
			 
			 {
			 let u= new NewUserInfo();
			 u.email="super@ruex.ru";
			 u.password="super_Password";
			 u.role="SUPERADMIN";
			 u.firstName="Акаунт";
			 u.lastName="Администратор";
			 u.OrganizationId ="24053220-C278-4EC2-E975-08D561A3D6EB";
		     this.jwtRegisterUser(u); 
			 }
			 {
			 let u= new NewUserInfo();
			 u.email="admin@ruex.ru";
			 u.password="admin_Password";
			 u.role="Администратор";
			 u.firstName="Системный";
			 u.lastName="Администратор";
		     */
		 
		 }); 
    }
	
	public jwtRegisterUser(u:UserProfile.NewUserInfo){
	 let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
     this.http.post(this.serviceURL + '/account/adduser',JSON.stringify(u) , { headers: cpHeaders }).subscribe(Data => {
		 //console.log("RcvAuth: " + JSON.stringify(Data));
	 }); 
    }


public SelectedRole = new BehaviorSubject<string>(""); 
	
	
	public get Role()
    {
        return this._role;
    }
    public set Role(value)
    {
		this._newrole=true;
        this._role = value;
		console.log("AppService: role set to " + this._role);
		this.SelectedRole.next(this._role); 
    }
	
	public currentRole = this.SelectedRole.asObservable(); 
	
	
	
	public get User()
    {
        return this._user;
    }
    public set User(value)
    {
		this._newuser=true;
        this._user = value;
		//console.log("AppService: user set to " + this._user);
		
    }
	
	
	
	 constructor(private http:HttpClient) {  
		//this.RefreshCombo(); 
	} 

		// support for Selected invg.invg_grp; 
	public Lastinvg_grp:invg.invg_grp = {} as invg.invg_grp; 
	public Selectedinvg_grp = new BehaviorSubject<invg.invg_grp>({} as invg.invg_grp); 
	public pushSelectedinvg_grp(item:invg.invg_grp){ 
		console.log("change Selected invg_grp"); 
		this.Lastinvg_grp=item; 
		this.Selectedinvg_grp.next(item); 
		 
	} 
	public currentinvg_grp = this.Selectedinvg_grp.asObservable(); 

	// support for Selected invg.invg_subgrp; 
	public Lastinvg_subgrp:invg.invg_subgrp = {} as invg.invg_subgrp; 
	public Selectedinvg_subgrp = new BehaviorSubject<invg.invg_subgrp>({} as invg.invg_subgrp); 
	public pushSelectedinvg_subgrp(item:invg.invg_subgrp){ 
		console.log("change Selected invg_subgrp"); 
		this.Lastinvg_subgrp=item; 
		this.Selectedinvg_subgrp.next(item); 
		 
	} 
	public currentinvg_subgrp = this.Selectedinvg_subgrp.asObservable(); 


	// support for Selected invm.invm_info; 
	public Lastinvm_info:invm.invm_info = {} as invm.invm_info; 
	public Selectedinvm_info = new BehaviorSubject<invm.invm_info>({} as invm.invm_info); 
	public pushSelectedinvm_info(item:invm.invm_info){ 
		console.log("change Selected invm_info"); 
		this.Lastinvm_info=item; 
		this.Selectedinvm_info.next(item); 
		 
	} 
	public currentinvm_info = this.Selectedinvm_info.asObservable(); 


	// support for Selected invw.invw_info; 
	public Lastinvw_info:invw.invw_info = {} as invw.invw_info; 
	public Selectedinvw_info = new BehaviorSubject<invw.invw_info>({} as invw.invw_info); 
	public pushSelectedinvw_info(item:invw.invw_info){ 
		console.log("change Selected invw_info"); 
		this.Lastinvw_info=item; 
		this.Selectedinvw_info.next(item); 
		 
	} 
	public currentinvw_info = this.Selectedinvw_info.asObservable(); 


	// support for Selected invi.invp_data; 
	public Lastinvp_data:invi.invp_data = {} as invi.invp_data; 
	public Selectedinvp_data = new BehaviorSubject<invi.invp_data>({} as invi.invp_data); 
	public pushSelectedinvp_data(item:invi.invp_data){ 
		console.log("change Selected invp_data"); 
		this.Lastinvp_data=item; 
		this.Selectedinvp_data.next(item); 
		 
	} 
	public currentinvp_data = this.Selectedinvp_data.asObservable(); 


	// support for Selected inva.inva_info; 
	public Lastinva_info:inva.inva_info = {} as inva.inva_info; 
	public Selectedinva_info = new BehaviorSubject<inva.inva_info>({} as inva.inva_info); 
	public pushSelectedinva_info(item:inva.inva_info){ 
		console.log("change Selected inva_info"); 
		this.Lastinva_info=item; 
		this.Selectedinva_info.next(item); 
		 
	} 
	public currentinva_info = this.Selectedinva_info.asObservable(); 

	// support for Selected inva.inva_real; 
	public Lastinva_real:inva.inva_real = {} as inva.inva_real; 
	public Selectedinva_real = new BehaviorSubject<inva.inva_real>({} as inva.inva_real); 
	public pushSelectedinva_real(item:inva.inva_real){ 
		console.log("change Selected inva_real"); 
		this.Lastinva_real=item; 
		this.Selectedinva_real.next(item); 
		 
	} 
	public currentinva_real = this.Selectedinva_real.asObservable(); 

	// support for Selected inva.inva_absnt; 
	public Lastinva_absnt:inva.inva_absnt = {} as inva.inva_absnt; 
	public Selectedinva_absnt = new BehaviorSubject<inva.inva_absnt>({} as inva.inva_absnt); 
	public pushSelectedinva_absnt(item:inva.inva_absnt){ 
		console.log("change Selected inva_absnt"); 
		this.Lastinva_absnt=item; 
		this.Selectedinva_absnt.next(item); 
		 
	} 
	public currentinva_absnt = this.Selectedinva_absnt.asObservable(); 

	// support for Selected inva.inva_extra; 
	public Lastinva_extra:inva.inva_extra = {} as inva.inva_extra; 
	public Selectedinva_extra = new BehaviorSubject<inva.inva_extra>({} as inva.inva_extra); 
	public pushSelectedinva_extra(item:inva.inva_extra){ 
		console.log("change Selected inva_extra"); 
		this.Lastinva_extra=item; 
		this.Selectedinva_extra.next(item); 
		 
	} 
	public currentinva_extra = this.Selectedinva_extra.asObservable(); 


	// support for Selected invd.invd_dep; 
	public Lastinvd_dep:invd.invd_dep = {} as invd.invd_dep; 
	public Selectedinvd_dep = new BehaviorSubject<invd.invd_dep>({} as invd.invd_dep); 
	public pushSelectedinvd_dep(item:invd.invd_dep){ 
		console.log("change Selected invd_dep"); 
		this.Lastinvd_dep=item; 
		this.Selectedinvd_dep.next(item); 
		 
	} 
	public currentinvd_dep = this.Selectedinvd_dep.asObservable(); 

	// support for Selected invd.invd_machine; 
	public Lastinvd_machine:invd.invd_machine = {} as invd.invd_machine; 
	public Selectedinvd_machine = new BehaviorSubject<invd.invd_machine>({} as invd.invd_machine); 
	public pushSelectedinvd_machine(item:invd.invd_machine){ 
		console.log("change Selected invd_machine"); 
		this.Lastinvd_machine=item; 
		this.Selectedinvd_machine.next(item); 
		 
	} 
	public currentinvd_machine = this.Selectedinvd_machine.asObservable(); 

	// support for Selected invd.invd_zone; 
	public Lastinvd_zone:invd.invd_zone = {} as invd.invd_zone; 
	public Selectedinvd_zone = new BehaviorSubject<invd.invd_zone>({} as invd.invd_zone); 
	public pushSelectedinvd_zone(item:invd.invd_zone){ 
		console.log("change Selected invd_zone"); 
		this.Lastinvd_zone=item; 
		this.Selectedinvd_zone.next(item); 
		 
	} 
	public currentinvd_zone = this.Selectedinvd_zone.asObservable(); 


	// support for Selected invwh.invwh_loc; 
	public Lastinvwh_loc:invwh.invwh_loc = {} as invwh.invwh_loc; 
	public Selectedinvwh_loc = new BehaviorSubject<invwh.invwh_loc>({} as invwh.invwh_loc); 
	public pushSelectedinvwh_loc(item:invwh.invwh_loc){ 
		console.log("change Selected invwh_loc"); 
		this.Lastinvwh_loc=item; 
		this.Selectedinvwh_loc.next(item); 
		 
	} 
	public currentinvwh_loc = this.Selectedinvwh_loc.asObservable(); 

	// support for Selected invwh.invwh_cell; 
	public Lastinvwh_cell:invwh.invwh_cell = {} as invwh.invwh_cell; 
	public Selectedinvwh_cell = new BehaviorSubject<invwh.invwh_cell>({} as invwh.invwh_cell); 
	public pushSelectedinvwh_cell(item:invwh.invwh_cell){ 
		console.log("change Selected invwh_cell"); 
		this.Lastinvwh_cell=item; 
		this.Selectedinvwh_cell.next(item); 
		 
	} 
	public currentinvwh_cell = this.Selectedinvwh_cell.asObservable(); 

 
	public Comboinvg_grp:Array<ComboInfo> = []; 
	public getinvg_grp(): Observable<ComboInfo[]> { 
     let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		return this.http.get<ComboInfo[]>(this.serviceURL + '/invg_grp/Combo', { headers: cpHeaders }); 
 }
	public refreshComboinvg_grp() { 
	this.getinvg_grp().subscribe(Data => {this.Comboinvg_grp=Data;});
 }
	public Comboinvg_subgrp:Array<ComboInfo> = []; 
	public getinvg_subgrp(): Observable<ComboInfo[]> { 
     let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		return this.http.get<ComboInfo[]>(this.serviceURL + '/invg_subgrp/Combo', { headers: cpHeaders }); 
 }
	public refreshComboinvg_subgrp() { 
	this.getinvg_subgrp().subscribe(Data => {this.Comboinvg_subgrp=Data;});
 }

	public Comboinvm_info:Array<ComboInfo> = []; 
	public getinvm_info(): Observable<ComboInfo[]> { 
     let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		return this.http.get<ComboInfo[]>(this.serviceURL + '/invm_info/Combo', { headers: cpHeaders }); 
 }
	public refreshComboinvm_info() { 
	this.getinvm_info().subscribe(Data => {this.Comboinvm_info=Data;});
 }

	public Comboinvw_info:Array<ComboInfo> = []; 
	public getinvw_info(): Observable<ComboInfo[]> { 
     let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		return this.http.get<ComboInfo[]>(this.serviceURL + '/invw_info/Combo', { headers: cpHeaders }); 
 }
	public refreshComboinvw_info() { 
	this.getinvw_info().subscribe(Data => {this.Comboinvw_info=Data;});
 }

	public Comboinvp_data:Array<ComboInfo> = []; 
	public getinvp_data(): Observable<ComboInfo[]> { 
     let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		return this.http.get<ComboInfo[]>(this.serviceURL + '/invp_data/Combo', { headers: cpHeaders }); 
 }
	public refreshComboinvp_data() { 
	this.getinvp_data().subscribe(Data => {this.Comboinvp_data=Data;});
 }

	public Comboinva_info:Array<ComboInfo> = []; 
	public getinva_info(): Observable<ComboInfo[]> { 
     let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		return this.http.get<ComboInfo[]>(this.serviceURL + '/inva_info/Combo', { headers: cpHeaders }); 
 }
	public refreshComboinva_info() { 
	this.getinva_info().subscribe(Data => {this.Comboinva_info=Data;});
 }
	public Comboinva_real:Array<ComboInfo> = []; 
	public getinva_real(): Observable<ComboInfo[]> { 
     let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		return this.http.get<ComboInfo[]>(this.serviceURL + '/inva_real/Combo', { headers: cpHeaders }); 
 }
	public refreshComboinva_real() { 
	this.getinva_real().subscribe(Data => {this.Comboinva_real=Data;});
 }
	public Comboinva_absnt:Array<ComboInfo> = []; 
	public getinva_absnt(): Observable<ComboInfo[]> { 
     let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		return this.http.get<ComboInfo[]>(this.serviceURL + '/inva_absnt/Combo', { headers: cpHeaders }); 
 }
	public refreshComboinva_absnt() { 
	this.getinva_absnt().subscribe(Data => {this.Comboinva_absnt=Data;});
 }
	public Comboinva_extra:Array<ComboInfo> = []; 
	public getinva_extra(): Observable<ComboInfo[]> { 
     let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		return this.http.get<ComboInfo[]>(this.serviceURL + '/inva_extra/Combo', { headers: cpHeaders }); 
 }
	public refreshComboinva_extra() { 
	this.getinva_extra().subscribe(Data => {this.Comboinva_extra=Data;});
 }

	public Comboinvd_dep:Array<ComboInfo> = []; 
	public getinvd_dep(): Observable<ComboInfo[]> { 
     let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		return this.http.get<ComboInfo[]>(this.serviceURL + '/invd_dep/Combo', { headers: cpHeaders }); 
 }
	public refreshComboinvd_dep() { 
	this.getinvd_dep().subscribe(Data => {this.Comboinvd_dep=Data;});
 }
	public Comboinvd_machine:Array<ComboInfo> = []; 
	public getinvd_machine(): Observable<ComboInfo[]> { 
     let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		return this.http.get<ComboInfo[]>(this.serviceURL + '/invd_machine/Combo', { headers: cpHeaders }); 
 }
	public refreshComboinvd_machine() { 
	this.getinvd_machine().subscribe(Data => {this.Comboinvd_machine=Data;});
 }
	public Comboinvd_zone:Array<ComboInfo> = []; 
	public getinvd_zone(): Observable<ComboInfo[]> { 
     let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		return this.http.get<ComboInfo[]>(this.serviceURL + '/invd_zone/Combo', { headers: cpHeaders }); 
 }
	public refreshComboinvd_zone() { 
	this.getinvd_zone().subscribe(Data => {this.Comboinvd_zone=Data;});
 }

	public Comboinvwh_loc:Array<ComboInfo> = []; 
	public getinvwh_loc(): Observable<ComboInfo[]> { 
     let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		return this.http.get<ComboInfo[]>(this.serviceURL + '/invwh_loc/Combo', { headers: cpHeaders }); 
 }
	public refreshComboinvwh_loc() { 
	this.getinvwh_loc().subscribe(Data => {this.Comboinvwh_loc=Data;});
 }
	public Comboinvwh_cell:Array<ComboInfo> = []; 
	public getinvwh_cell(): Observable<ComboInfo[]> { 
     let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		return this.http.get<ComboInfo[]>(this.serviceURL + '/invwh_cell/Combo', { headers: cpHeaders }); 
 }
	public refreshComboinvwh_cell() { 
	this.getinvwh_cell().subscribe(Data => {this.Comboinvwh_cell=Data;});
 }

 
public RefreshCombo(){
	this.getinvg_grp().subscribe(data => {this.Comboinvg_grp=data;}); 
	this.getinvg_subgrp().subscribe(data => {this.Comboinvg_subgrp=data;}); 

	this.getinvm_info().subscribe(data => {this.Comboinvm_info=data;}); 

	this.getinvw_info().subscribe(data => {this.Comboinvw_info=data;}); 

	this.getinvp_data().subscribe(data => {this.Comboinvp_data=data;}); 

	this.getinva_info().subscribe(data => {this.Comboinva_info=data;}); 
	this.getinva_real().subscribe(data => {this.Comboinva_real=data;}); 
	this.getinva_absnt().subscribe(data => {this.Comboinva_absnt=data;}); 
	this.getinva_extra().subscribe(data => {this.Comboinva_extra=data;}); 

	this.getinvd_dep().subscribe(data => {this.Comboinvd_dep=data;}); 
	this.getinvd_machine().subscribe(data => {this.Comboinvd_machine=data;}); 
	this.getinvd_zone().subscribe(data => {this.Comboinvd_zone=data;}); 

	this.getinvwh_loc().subscribe(data => {this.Comboinvwh_loc=data;}); 
	this.getinvwh_cell().subscribe(data => {this.Comboinvwh_cell=data;}); 

}
 
 // enum support

	/* StructType - Тип раздела */ 
	public enumStructTypeCombo(){
		return this.enumStructType;
	}
	enumStructType:Array<ComboInfo> =[

	 {id:'0',name:'Строка атрибутов'}
	, {id:'1',name:'Коллекция'}
	, {id:'2',name:'Дерево'}	];

	/* WFFuncParam - Вариант расшифровки параметра функции */ 
	public enumWFFuncParamCombo(){
		return this.enumWFFuncParam;
	}
	enumWFFuncParam:Array<ComboInfo> =[

	 {id:'8',name:'Роль'}
	, {id:'2',name:'Выражение'}
	, {id:'5',name:'Документ'}
	, {id:'7',name:'Поле'}
	, {id:'9',name:'Тип документа'}
	, {id:'0',name:'Значение'}
	, {id:'6',name:'Раздел'}
	, {id:'4',name:'Документ процесса'}
	, {id:'3',name:'Папка'}
	, {id:'1',name:'Значение из параметра'}	];

	/* ReportType - Вариант отчета */ 
	public enumReportTypeCombo(){
		return this.enumReportType;
	}
	enumReportType:Array<ComboInfo> =[

	 {id:'4',name:'Экспорт по Excel шаблону'}
	, {id:'0',name:'Таблица'}
	, {id:'3',name:'Экспорт по WORD шаблону'}
	, {id:'1',name:'Двумерная матрица'}
	, {id:'2',name:'Только расчет'}	];

	/* Education - Образование */ 
	public enumEducationCombo(){
		return this.enumEducation;
	}
	enumEducation:Array<ComboInfo> =[

	 {id:'-1',name:'Не важно'}
	, {id:'1',name:'Среднее'}
	, {id:'4',name:'Высшее'}
	, {id:'3',name:'Неполное высшее'}
	, {id:'0',name:'Неполное среднее'}
	, {id:'5',name:'Несколько высших'}
	, {id:'2',name:'Среднее специальное'}	];

	/* TypeStyle - Вариант трактовки типа поля */ 
	public enumTypeStyleCombo(){
		return this.enumTypeStyle;
	}
	enumTypeStyle:Array<ComboInfo> =[

	 {id:'4',name:'Ссылка'}
	, {id:'1',name:'Выражение'}
	, {id:'5',name:'Элемент оформления'}
	, {id:'3',name:'Интервал'}
	, {id:'2',name:'Перечисление'}
	, {id:'0',name:'Скалярный тип'}	];

	/* ReplicationType - Вариант репликации докуента */ 
	public enumReplicationTypeCombo(){
		return this.enumReplicationType;
	}
	enumReplicationType:Array<ComboInfo> =[

	 {id:'1',name:'Построчно'}
	, {id:'0',name:'Весь документ'}
	, {id:'2',name:'Локальный'}	];

	/* NumerationRule - Правило нумерации */ 
	public enumNumerationRuleCombo(){
		return this.enumNumerationRule;
	}
	enumNumerationRule:Array<ComboInfo> =[

	 {id:'2',name:'По кварталу'}
	, {id:'3',name:'По месяцу'}
	, {id:'0',name:'Единая зона'}
	, {id:'4',name:'По дню'}
	, {id:'1',name:'По году'}
	, {id:'10',name:'Произвольные зоны'}	];

	/* WFProcessState - Состояния процесса */ 
	public enumWFProcessStateCombo(){
		return this.enumWFProcessState;
	}
	enumWFProcessState:Array<ComboInfo> =[

	 {id:'3',name:'Pause'}
	, {id:'2',name:'Active'}
	, {id:'4',name:'Done'}
	, {id:'1',name:'Prepare'}
	, {id:'0',name:'Initial'}
	, {id:'5',name:'Processed'}	];

	/* MenuActionType - Вариант действия при выборе пункта меню */ 
	public enumMenuActionTypeCombo(){
		return this.enumMenuActionType;
	}
	enumMenuActionType:Array<ComboInfo> =[

	 {id:'4',name:'Запустить АРМ'}
	, {id:'2',name:'Выполнить метод'}
	, {id:'5',name:'Открыть отчет'}
	, {id:'0',name:'Ничего не делать'}
	, {id:'1',name:'Открыть документ'}
	, {id:'3',name:'Открыть журнал'}	];

	/* WFShortcutType - Варианты ярлыков, которые может размещать процесс */ 
	public enumWFShortcutTypeCombo(){
		return this.enumWFShortcutType;
	}
	enumWFShortcutType:Array<ComboInfo> =[

	 {id:'0',name:'Document'}
	, {id:'2',name:'Process'}
	, {id:'1',name:'Function'}	];

	/* VHAlignment - Выравнивание */ 
	public enumVHAlignmentCombo(){
		return this.enumVHAlignment;
	}
	enumVHAlignment:Array<ComboInfo> =[

	 {id:'6',name:'Right Top'}
	, {id:'7',name:'Right Center'}
	, {id:'8',name:'Right Bottom'}
	, {id:'3',name:'Center Top'}
	, {id:'0',name:'Left Top'}
	, {id:'4',name:'Center Center'}
	, {id:'1',name:'Left Center'}
	, {id:'5',name:'Center Bottom'}
	, {id:'2',name:'Left Bottom'}	];

	/* CurrencyType - Валюта платежа */ 
	public enumCurrencyTypeCombo(){
		return this.enumCurrencyType;
	}
	enumCurrencyType:Array<ComboInfo> =[

	 {id:'2',name:'Евро'}
	, {id:'0',name:'Рубль'}
	, {id:'1',name:'Доллар'}	];

	/* InfoStoreType - Тип каталога */ 
	public enumInfoStoreTypeCombo(){
		return this.enumInfoStoreType;
	}
	enumInfoStoreType:Array<ComboInfo> =[

	 {id:'2',name:'Групповой'}
	, {id:'0',name:' Общий'}
	, {id:'1',name:'Персональный'}	];

	/* DevelopmentBase - Платформа разработки */ 
	public enumDevelopmentBaseCombo(){
		return this.enumDevelopmentBase;
	}
	enumDevelopmentBase:Array<ComboInfo> =[

	 {id:'3',name:'OTHER'}
	, {id:'1',name:'DOTNET'}
	, {id:'2',name:'JAVA'}
	, {id:'0',name:'VB6'}	];

	/* Quarter - Квартал */ 
	public enumQuarterCombo(){
		return this.enumQuarter;
	}
	enumQuarter:Array<ComboInfo> =[

	 {id:'1',name:'I'}
	, {id:'4',name:'IV'}
	, {id:'0',name:'?'}
	, {id:'2',name:'II'}
	, {id:'3',name:'III'}	];

	/* Months - Месяцы */ 
	public enumMonthsCombo(){
		return this.enumMonths;
	}
	enumMonths:Array<ComboInfo> =[

	 {id:'5',name:'Май'}
	, {id:'9',name:'Сентябрь'}
	, {id:'6',name:'Июнь'}
	, {id:'12',name:'Декабрь'}
	, {id:'1',name:'Январь'}
	, {id:'8',name:'Август'}
	, {id:'2',name:'Февраль'}
	, {id:'4',name:'Апрель'}
	, {id:'7',name:'Июль'}
	, {id:'10',name:'Октябрь'}
	, {id:'3',name:'Март'}
	, {id:'11',name:'Ноябрь'}	];

	/* ColumnSortType - Вариант сортиовки данных колонки */ 
	public enumColumnSortTypeCombo(){
		return this.enumColumnSortType;
	}
	enumColumnSortType:Array<ComboInfo> =[

	 {id:'0',name:'As String'}
	, {id:'1',name:'As Numeric'}
	, {id:'2',name:'As Date'}	];

	/* Boolean - Да / Нет */ 
	public enumBooleanCombo(){
		return this.enumBoolean;
	}
	enumBoolean:Array<ComboInfo> =[

	 {id:'-1',name:'Да'}
	, {id:'0',name:'Нет'}	];

	/* JournalLinkType - Для связи журналов друг с другом */ 
	public enumJournalLinkTypeCombo(){
		return this.enumJournalLinkType;
	}
	enumJournalLinkType:Array<ComboInfo> =[

	 {id:'0',name:'Нет'}
	, {id:'4',name:'Связка ParentStructRowID  (в передлах объекта)'}
	, {id:'3',name:'Связка InstanceID (в передлах объекта)'}
	, {id:'1',name:'Ссылка на объект'}
	, {id:'2',name:'Ссылка на строку'}	];

	/* TargetType - Вариант уровня приложения, куда может генерироваться код */ 
	public enumTargetTypeCombo(){
		return this.enumTargetType;
	}
	enumTargetType:Array<ComboInfo> =[

	 {id:'0',name:'СУБД'}
	, {id:'3',name:'Документация'}
	, {id:'1',name:'МОДЕЛЬ'}
	, {id:'2',name:'Приложение'}
	, {id:'4',name:'АРМ'}	];

	/* ParityType - Четность */ 
	public enumParityTypeCombo(){
		return this.enumParityType;
	}
	enumParityType:Array<ComboInfo> =[

	 {id:'4',name:'Space'}
	, {id:'3',name:'Mark'}
	, {id:'2',name:'Odd'}
	, {id:'0',name:'None'}
	, {id:'1',name:'Even'}	];

	/* MesureFormat - Формат индикатора */ 
	public enumMesureFormatCombo(){
		return this.enumMesureFormat;
	}
	enumMesureFormat:Array<ComboInfo> =[

	 {id:'0',name:'Число'}
	, {id:'1',name:'Дата'}
	, {id:'4',name:'Объект'}
	, {id:'2',name:'Справочник'}
	, {id:'5',name:'Текст'}	];

	/* ExportType - Тип экспорта */ 
	public enumExportTypeCombo(){
		return this.enumExportType;
	}
	enumExportType:Array<ComboInfo> =[

	 {id:'3',name:'Сайт и МБ'}
	, {id:'1',name:'Сайт'}
	, {id:'0',name:'Нет'}	];

	/* WFStepClass - Тип шага процесса */ 
	public enumWFStepClassCombo(){
		return this.enumWFStepClass;
	}
	enumWFStepClass:Array<ComboInfo> =[

	 {id:'3',name:'PeriodicFunction'}
	, {id:'0',name:'SimpleFunction'}
	, {id:'2',name:'StopFunction'}
	, {id:'1',name:'StartFunction'}	];

	/* DayInWeek - День недели */ 
	public enumDayInWeekCombo(){
		return this.enumDayInWeek;
	}
	enumDayInWeek:Array<ComboInfo> =[

	 {id:'4',name:'Четверг'}
	, {id:'6',name:'Суббота'}
	, {id:'1',name:'Понедельник'}
	, {id:'7',name:'Воскресенье'}
	, {id:'2',name:'Вторник'}
	, {id:'5',name:'Пятница'}
	, {id:'3',name:'Среда'}	];

	/* GeneratorStyle - GeneratorStyle */ 
	public enumGeneratorStyleCombo(){
		return this.enumGeneratorStyle;
	}
	enumGeneratorStyle:Array<ComboInfo> =[

	 {id:'0',name:'Один тип'}
	, {id:'1',name:'Все типы сразу'}	];

	/* PlatType - Тип плательщика */ 
	public enumPlatTypeCombo(){
		return this.enumPlatType;
	}
	enumPlatType:Array<ComboInfo> =[

	 {id:'1',name:'Получатель'}
	, {id:'0',name:'Отправитель'}
	, {id:'2',name:'Другой'}	];

	/* msgState - Состояние заявки */ 
	public enummsgStateCombo(){
		return this.enummsgState;
	}
	enummsgState:Array<ComboInfo> =[

	 {id:'1',name:'Сообщено абоненту'}
	, {id:'3',name:'Промежуточный ответ'}
	, {id:'0',name:'Состояние заявки'}
	, {id:'2',name:'Абонент не ответил'}	];

	/* OnJournalRowClick - действие при открытии строки журнала */ 
	public enumOnJournalRowClickCombo(){
		return this.enumOnJournalRowClick;
	}
	enumOnJournalRowClick:Array<ComboInfo> =[

	 {id:'2',name:'Открыть документ'}
	, {id:'0',name:'Ничего не делать'}
	, {id:'1',name:'Открыть строку'}	];

	/* PartType - PartType */ 
	public enumPartTypeCombo(){
		return this.enumPartType;
	}
	enumPartType:Array<ComboInfo> =[

	 {id:'1',name:'Коллекция'}
	, {id:'2',name:'Дерево'}
	, {id:'0',name:'Строка'}
	, {id:'4',name:'Расширение с данными'}
	, {id:'3',name:'Расширение'}	];

	/* ReferenceType - ReferenceType */ 
	public enumReferenceTypeCombo(){
		return this.enumReferenceType;
	}
	enumReferenceType:Array<ComboInfo> =[

	 {id:'3',name:'На источник данных'}
	, {id:'0',name:'Скалярное поле ( не ссылка)'}
	, {id:'2',name:'На строку раздела'}
	, {id:'1',name:'На объект '}	];

	/* ContactType -  */ 
	public enumContactTypeCombo(){
		return this.enumContactType;
	}
	enumContactType:Array<ComboInfo> =[

	 {id:'0',name:'контакт разомкнут'}
	, {id:'-1',name:'контакт замкнут'}	];

	/* ConditionType - Варианты условий */ 
	public enumConditionTypeCombo(){
		return this.enumConditionType;
	}
	enumConditionType:Array<ComboInfo> =[

	 {id:'6',name:'<'}
	, {id:'4',name:'>='}
	, {id:'7',name:'<='}
	, {id:'0',name:'none'}
	, {id:'1',name:'='}
	, {id:'8',name:'like'}
	, {id:'3',name:'>'}
	, {id:'2',name:'<>'}	];

	/* FolderType - Тип папки */ 
	public enumFolderTypeCombo(){
		return this.enumFolderType;
	}
	enumFolderType:Array<ComboInfo> =[

	 {id:'3',name:'Удаленные'}
	, {id:'1',name:'Входящие'}
	, {id:'9',name:'Отложенные'}
	, {id:'4',name:'Журнал'}
	, {id:'2',name:'Исходящие'}
	, {id:'7',name:'Черновики'}
	, {id:'6',name:'Отправленные'}
	, {id:'8',name:'В работе'}
	, {id:'5',name:'Календарь'}
	, {id:'10',name:'Завершенные'}
	, {id:'0',name:'cls__'}	];

	/* msgResult - Результат */ 
	public enummsgResultCombo(){
		return this.enummsgResult;
	}
	enummsgResult:Array<ComboInfo> =[

	 {id:'2',name:'Выполнено'}
	, {id:'1',name:'В работе'}
	, {id:'0',name:'Результат'}	];

	/* PartAddBehaivor - Поведение при добавлении строки раздела */ 
	public enumPartAddBehaivorCombo(){
		return this.enumPartAddBehaivor;
	}
	enumPartAddBehaivor:Array<ComboInfo> =[

	 {id:'0',name:'AddForm'}
	, {id:'2',name:'RunAction'}
	, {id:'1',name:'RefreshOnly'}	];

	/* ExtentionType - Тип расширения */ 
	public enumExtentionTypeCombo(){
		return this.enumExtentionType;
	}
	enumExtentionType:Array<ComboInfo> =[

	 {id:'6',name:'VerifyRowExt'}
	, {id:'7',name:'CodeGenerator'}
	, {id:'5',name:'DefaultExt'}
	, {id:'0',name:'StatusExt'}
	, {id:'4',name:'JrnlRunExt'}
	, {id:'2',name:'CustomExt'}
	, {id:'8',name:'ARMGenerator'}
	, {id:'1',name:'OnFormExt'}
	, {id:'3',name:'JrnlAddExt'}	];

	/* Sex - Мужской / Женский */ 
	public enumSexCombo(){
		return this.enumSex;
	}
	enumSex:Array<ComboInfo> =[

	 {id:'0',name:'Не существенно'}
	, {id:'2',name:'Мужской'}
	, {id:'1',name:'Женский'}	];

	/* YesNo - Да / Нет (0 или 1) */ 
	public enumYesNoCombo(){
		return this.enumYesNo;
	}
	enumYesNo:Array<ComboInfo> =[

	 {id:'1',name:'Да'}
	, {id:'0',name:'Нет'}	];

	/* AggregationType - Вариант агрегации по полю */ 
	public enumAggregationTypeCombo(){
		return this.enumAggregationType;
	}
	enumAggregationType:Array<ComboInfo> =[

	 {id:'3',name:'SUM'}
	, {id:'1',name:'AVG'}
	, {id:'6',name:'CUSTOM'}
	, {id:'0',name:'none'}
	, {id:'2',name:'COUNT'}
	, {id:'5',name:'MAX'}
	, {id:'4',name:'MIN'}	];

	/* WFFuncState - Состояние функции в бизнес процессе */ 
	public enumWFFuncStateCombo(){
		return this.enumWFFuncState;
	}
	enumWFFuncState:Array<ComboInfo> =[

	 {id:'8',name:'Processed'}
	, {id:'3',name:'InWork'}
	, {id:'4',name:'Pause'}
	, {id:'6',name:'InControl'}
	, {id:'2',name:'Active'}
	, {id:'5',name:'Ready'}
	, {id:'7',name:'Done'}
	, {id:'1',name:'Prepare'}
	, {id:'0',name:'Initial'}	];

	/* Employment - Занятость */ 
	public enumEmploymentCombo(){
		return this.enumEmployment;
	}
	enumEmployment:Array<ComboInfo> =[

	 {id:'1',name:'Частичная'}
	, {id:'-1',name:'Не важно'}
	, {id:'0',name:'Полная'}	];

	/* TriState - Да / Нет / Не определено */ 
	public enumTriStateCombo(){
		return this.enumTriState;
	}
	enumTriState:Array<ComboInfo> =[

	 {id:'-1',name:'Не существенно'}
	, {id:'1',name:'Да'}
	, {id:'0',name:'Нет'}	];
 
}
