import { Injectable } from '@angular/core'; 
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http'; 
import { Observable,BehaviorSubject } from 'rxjs'; 
import { environment } from '../environments/environment';

import { invg } from "app/invg";
import { invi } from "app/invi";
import { inva } from "app/inva";
import { invm } from "app/invm";
import { invw } from "app/invw";
import { XUser } from "app/XUser";
import { invd } from "app/invd";
import { invwh } from "app/invwh";
import { invops } from "app/invops";
import { UserProfile } from "app/UserProfile";
	
export class ComboInfo{ 
	id:string; 
	name:string; 
} 
export class enumInfo{ 
	id:number; 
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
		console.log("Send: "+JSON.stringify( li));
		this.http.post(this.serviceURL + '/account/login',JSON.stringify( li) , { headers: cpHeaders }).subscribe(
		    Data => {
				this.authResponce=Data;
				console.log("RcvAuth: " + JSON.stringify(this.authResponce));
				this.myToken=this.authResponce.data;
				if(	  this.myToken != null ){
					 sessionStorage.setItem('auth_token', this.myToken.access_token);
					 console.log("Rcv: " + JSON.stringify(this.myToken));
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


	


	


	// support for Selected invi.invp_data; 
	public Lastinvp_data:invi.invp_data = {} as invi.invp_data; 
	public Selectedinvp_data = new BehaviorSubject<invi.invp_data>({} as invi.invp_data); 
	public pushSelectedinvp_data(item:invi.invp_data){ 
		console.log("change Selected invp_data"); 
		this.Lastinvp_data=item; 
		this.Selectedinvp_data.next(item); 
		 
	} 
	public currentinvp_data = this.Selectedinvp_data.asObservable(); 

	// support for Selected invi.invp_tag; 
	public Lastinvp_tag:invi.invp_tag = {} as invi.invp_tag; 
	public Selectedinvp_tag = new BehaviorSubject<invi.invp_tag>({} as invi.invp_tag); 
	public pushSelectedinvp_tag(item:invi.invp_tag){ 
		console.log("change Selected invp_tag"); 
		this.Lastinvp_tag=item; 
		this.Selectedinvp_tag.next(item); 
		 
	} 
	public currentinvp_tag = this.Selectedinvp_tag.asObservable(); 


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


	// support for Selected XUser.xUserInfo; 
	public LastxUserInfo:XUser.xUserInfo = {} as XUser.xUserInfo; 
	public SelectedxUserInfo = new BehaviorSubject<XUser.xUserInfo>({} as XUser.xUserInfo); 
	public pushSelectedxUserInfo(item:XUser.xUserInfo){ 
		console.log("change Selected xUserInfo"); 
		this.LastxUserInfo=item; 
		this.SelectedxUserInfo.next(item); 
		 
	} 
	public currentxUserInfo = this.SelectedxUserInfo.asObservable(); 


	// support for Selected invops.invops_in; 
	public Lastinvops_in:invops.invops_in = {} as invops.invops_in; 
	public Selectedinvops_in = new BehaviorSubject<invops.invops_in>({} as invops.invops_in); 
	public pushSelectedinvops_in(item:invops.invops_in){ 
		console.log("change Selected invops_in"); 
		this.Lastinvops_in=item; 
		this.Selectedinvops_in.next(item); 
		 
	} 
	public currentinvops_in = this.Selectedinvops_in.asObservable(); 

	// support for Selected invops.invops_move; 
	public Lastinvops_move:invops.invops_move = {} as invops.invops_move; 
	public Selectedinvops_move = new BehaviorSubject<invops.invops_move>({} as invops.invops_move); 
	public pushSelectedinvops_move(item:invops.invops_move){ 
		console.log("change Selected invops_move"); 
		this.Lastinvops_move=item; 
		this.Selectedinvops_move.next(item); 
		 
	} 
	public currentinvops_move = this.Selectedinvops_move.asObservable(); 

	// support for Selected invops.invops_out; 
	public Lastinvops_out:invops.invops_out = {} as invops.invops_out; 
	public Selectedinvops_out = new BehaviorSubject<invops.invops_out>({} as invops.invops_out); 
	public pushSelectedinvops_out(item:invops.invops_out){ 
		console.log("change Selected invops_out"); 
		this.Lastinvops_out=item; 
		this.Selectedinvops_out.next(item); 
		 
	} 
	public currentinvops_out = this.Selectedinvops_out.asObservable(); 


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

	// support for Selected invd.invd_op; 
	public Lastinvd_op:invd.invd_op = {} as invd.invd_op; 
	public Selectedinvd_op = new BehaviorSubject<invd.invd_op>({} as invd.invd_op); 
	public pushSelectedinvd_op(item:invd.invd_op){ 
		console.log("change Selected invd_op"); 
		this.Lastinvd_op=item; 
		this.Selectedinvd_op.next(item); 
		 
	} 
	public currentinvd_op = this.Selectedinvd_op.asObservable(); 

	// support for Selected invd.invd_store; 
	public Lastinvd_store:invd.invd_store = {} as invd.invd_store; 
	public Selectedinvd_store = new BehaviorSubject<invd.invd_store>({} as invd.invd_store); 
	public pushSelectedinvd_store(item:invd.invd_store){ 
		console.log("change Selected invd_store"); 
		this.Lastinvd_store=item; 
		this.Selectedinvd_store.next(item); 
		 
	} 
	public currentinvd_store = this.Selectedinvd_store.asObservable(); 

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

	public getinvg_subgrp(id:string): Observable<ComboInfo[]> { 
     let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		return this.http.get<ComboInfo[]>(this.serviceURL + '/invg_subgrp/Combo/'+id, { headers: cpHeaders }); 
    }
	public refreshComboinvg_subgrp(id:string) { 
	this.getinvg_subgrp(id).subscribe(Data => {this.Comboinvg_subgrp=Data;});
 }



	public Comboinvp_data:Array<ComboInfo> = []; 
	public getinvp_data(): Observable<ComboInfo[]> { 
     let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		return this.http.get<ComboInfo[]>(this.serviceURL + '/invp_data/Combo', { headers: cpHeaders }); 
 }
	public refreshComboinvp_data() { 
	this.getinvp_data().subscribe(Data => {this.Comboinvp_data=Data;});
 }
	public Comboinvp_tag:Array<ComboInfo> = []; 
	public getinvp_tag(): Observable<ComboInfo[]> { 
     let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		return this.http.get<ComboInfo[]>(this.serviceURL + '/invp_tag/Combo', { headers: cpHeaders }); 
 }
	public refreshComboinvp_tag() { 
	this.getinvp_tag().subscribe(Data => {this.Comboinvp_tag=Data;});
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

	public ComboxUserInfo:Array<ComboInfo> = []; 
	public getxUserInfo(): Observable<ComboInfo[]> { 
     let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		return this.http.get<ComboInfo[]>(this.serviceURL + '/xUserInfo/Combo', { headers: cpHeaders }); 
 }
	public refreshComboxUserInfo() { 
	this.getxUserInfo().subscribe(Data => {this.ComboxUserInfo=Data;});
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
	public Comboinvd_op:Array<ComboInfo> = []; 
	public getinvd_op(): Observable<ComboInfo[]> { 
     let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		return this.http.get<ComboInfo[]>(this.serviceURL + '/invd_op/Combo', { headers: cpHeaders }); 
 }
	public refreshComboinvd_op() { 
	this.getinvd_op().subscribe(Data => {this.Comboinvd_op=Data;});
 }
	public Comboinvd_store:Array<ComboInfo> = []; 
	public getinvd_store(): Observable<ComboInfo[]> { 
     let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		return this.http.get<ComboInfo[]>(this.serviceURL + '/invd_store/Combo', { headers: cpHeaders }); 
 }
	public refreshComboinvd_store() { 
	this.getinvd_store().subscribe(Data => {this.Comboinvd_store=Data;});
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
	this.getinvg_grp().subscribe(data => {this.Comboinvg_grp=data;
	
		this.getinvg_subgrp(this.Comboinvg_grp[0].id).subscribe(data => {this.Comboinvg_subgrp=data;});
	
	}); 

	this.getinvp_data().subscribe(data => {this.Comboinvp_data=data;}); 
	this.getinvp_tag().subscribe(data => {this.Comboinvp_tag=data;}); 
	 
	this.getinva_info().subscribe(data => {this.Comboinva_info=data;}); 
	this.getinva_real().subscribe(data => {this.Comboinva_real=data;}); 
	this.getinva_absnt().subscribe(data => {this.Comboinva_absnt=data;}); 
	this.getinva_extra().subscribe(data => {this.Comboinva_extra=data;}); 

	this.getinvm_info().subscribe(data => {this.Comboinvm_info=data;}); 

	this.getinvw_info().subscribe(data => {this.Comboinvw_info=data;}); 

	this.getxUserInfo().subscribe(data => {this.ComboxUserInfo=data;}); 

	this.getinvd_dep().subscribe(data => {this.Comboinvd_dep=data;}); 
	this.getinvd_machine().subscribe(data => {this.Comboinvd_machine=data;}); 
	this.getinvd_op().subscribe(data => {this.Comboinvd_op=data;}); 
	this.getinvd_store().subscribe(data => {this.Comboinvd_store=data;}); 
	this.getinvd_zone().subscribe(data => {this.Comboinvd_zone=data;}); 

	this.getinvwh_loc().subscribe(data => {this.Comboinvwh_loc=data;}); 
	this.getinvwh_cell().subscribe(data => {this.Comboinvwh_cell=data;}); 

}
 
 // enum support

	/* StructType - Тип раздела */ 
	public enumStructTypeCombo(){
		return this.enumStructType;
	}
	enumStructType:Array<enumInfo> =[

	 {id:0,name:'Строка атрибутов'}
	, {id:1,name:'Коллекция'}
	, {id:2,name:'Дерево'}	];

	/* WFFuncParam - Вариант расшифровки параметра функции */ 
	public enumWFFuncParamCombo(){
		return this.enumWFFuncParam;
	}
	enumWFFuncParam:Array<enumInfo> =[

	 {id:8,name:'Роль'}
	, {id:2,name:'Выражение'}
	, {id:5,name:'Документ'}
	, {id:7,name:'Поле'}
	, {id:9,name:'Тип документа'}
	, {id:0,name:'Значение'}
	, {id:6,name:'Раздел'}
	, {id:4,name:'Документ процесса'}
	, {id:3,name:'Папка'}
	, {id:1,name:'Значение из параметра'}	];

	/* ReportType - Вариант отчета */ 
	public enumReportTypeCombo(){
		return this.enumReportType;
	}
	enumReportType:Array<enumInfo> =[

	 {id:4,name:'Экспорт по Excel шаблону'}
	, {id:0,name:'Таблица'}
	, {id:3,name:'Экспорт по WORD шаблону'}
	, {id:1,name:'Двумерная матрица'}
	, {id:2,name:'Только расчет'}	];

	/* Education - Образование */ 
	public enumEducationCombo(){
		return this.enumEducation;
	}
	enumEducation:Array<enumInfo> =[

	 {id:-1,name:'Не важно'}
	, {id:1,name:'Среднее'}
	, {id:4,name:'Высшее'}
	, {id:3,name:'Неполное высшее'}
	, {id:0,name:'Неполное среднее'}
	, {id:5,name:'Несколько высших'}
	, {id:2,name:'Среднее специальное'}	];

	/* TypeStyle - Вариант трактовки типа поля */ 
	public enumTypeStyleCombo(){
		return this.enumTypeStyle;
	}
	enumTypeStyle:Array<enumInfo> =[

	 {id:4,name:'Ссылка'}
	, {id:1,name:'Выражение'}
	, {id:5,name:'Элемент оформления'}
	, {id:3,name:'Интервал'}
	, {id:2,name:'Перечисление'}
	, {id:0,name:'Скалярный тип'}	];

	/* ReplicationType - Вариант репликации докуента */ 
	public enumReplicationTypeCombo(){
		return this.enumReplicationType;
	}
	enumReplicationType:Array<enumInfo> =[

	 {id:1,name:'Построчно'}
	, {id:0,name:'Весь документ'}
	, {id:2,name:'Локальный'}	];

	/* NumerationRule - Правило нумерации */ 
	public enumNumerationRuleCombo(){
		return this.enumNumerationRule;
	}
	enumNumerationRule:Array<enumInfo> =[

	 {id:2,name:'По кварталу'}
	, {id:3,name:'По месяцу'}
	, {id:0,name:'Единая зона'}
	, {id:4,name:'По дню'}
	, {id:1,name:'По году'}
	, {id:10,name:'Произвольные зоны'}	];

	/* WFProcessState - Состояния процесса */ 
	public enumWFProcessStateCombo(){
		return this.enumWFProcessState;
	}
	enumWFProcessState:Array<enumInfo> =[

	 {id:3,name:'Pause'}
	, {id:2,name:'Active'}
	, {id:4,name:'Done'}
	, {id:1,name:'Prepare'}
	, {id:0,name:'Initial'}
	, {id:5,name:'Processed'}	];

	/* MenuActionType - Вариант действия при выборе пункта меню */ 
	public enumMenuActionTypeCombo(){
		return this.enumMenuActionType;
	}
	enumMenuActionType:Array<enumInfo> =[

	 {id:4,name:'Запустить АРМ'}
	, {id:2,name:'Выполнить метод'}
	, {id:5,name:'Открыть отчет'}
	, {id:0,name:'Ничего не делать'}
	, {id:1,name:'Открыть документ'}
	, {id:3,name:'Открыть журнал'}	];

	/* WFShortcutType - Варианты ярлыков, которые может размещать процесс */ 
	public enumWFShortcutTypeCombo(){
		return this.enumWFShortcutType;
	}
	enumWFShortcutType:Array<enumInfo> =[

	 {id:0,name:'Document'}
	, {id:2,name:'Process'}
	, {id:1,name:'Function'}	];

	/* VHAlignment - Выравнивание */ 
	public enumVHAlignmentCombo(){
		return this.enumVHAlignment;
	}
	enumVHAlignment:Array<enumInfo> =[

	 {id:6,name:'Right Top'}
	, {id:7,name:'Right Center'}
	, {id:8,name:'Right Bottom'}
	, {id:3,name:'Center Top'}
	, {id:0,name:'Left Top'}
	, {id:4,name:'Center Center'}
	, {id:1,name:'Left Center'}
	, {id:5,name:'Center Bottom'}
	, {id:2,name:'Left Bottom'}	];

	/* CurrencyType - Валюта платежа */ 
	public enumCurrencyTypeCombo(){
		return this.enumCurrencyType;
	}
	enumCurrencyType:Array<enumInfo> =[

	 {id:2,name:'Евро'}
	, {id:0,name:'Рубль'}
	, {id:1,name:'Доллар'}	];

	/* InfoStoreType - Тип каталога */ 
	public enumInfoStoreTypeCombo(){
		return this.enumInfoStoreType;
	}
	enumInfoStoreType:Array<enumInfo> =[

	 {id:2,name:'Групповой'}
	, {id:0,name:' Общий'}
	, {id:1,name:'Персональный'}	];

	/* DevelopmentBase - Платформа разработки */ 
	public enumDevelopmentBaseCombo(){
		return this.enumDevelopmentBase;
	}
	enumDevelopmentBase:Array<enumInfo> =[

	 {id:3,name:'OTHER'}
	, {id:1,name:'DOTNET'}
	, {id:2,name:'JAVA'}
	, {id:0,name:'VB6'}	];

	/* Quarter - Квартал */ 
	public enumQuarterCombo(){
		return this.enumQuarter;
	}
	enumQuarter:Array<enumInfo> =[

	 {id:1,name:'I'}
	, {id:4,name:'IV'}
	, {id:0,name:'?'}
	, {id:2,name:'II'}
	, {id:3,name:'III'}	];

	/* Months - Месяцы */ 
	public enumMonthsCombo(){
		return this.enumMonths;
	}
	enumMonths:Array<enumInfo> =[

	 {id:5,name:'Май'}
	, {id:9,name:'Сентябрь'}
	, {id:6,name:'Июнь'}
	, {id:12,name:'Декабрь'}
	, {id:1,name:'Январь'}
	, {id:8,name:'Август'}
	, {id:2,name:'Февраль'}
	, {id:4,name:'Апрель'}
	, {id:7,name:'Июль'}
	, {id:10,name:'Октябрь'}
	, {id:3,name:'Март'}
	, {id:11,name:'Ноябрь'}	];

	/* ColumnSortType - Вариант сортиовки данных колонки */ 
	public enumColumnSortTypeCombo(){
		return this.enumColumnSortType;
	}
	enumColumnSortType:Array<enumInfo> =[

	 {id:0,name:'As String'}
	, {id:1,name:'As Numeric'}
	, {id:2,name:'As Date'}	];

	/* Boolean - Да / Нет */ 
	public enumBooleanCombo(){
		return this.enumBoolean;
	}
	enumBoolean:Array<enumInfo> =[

	 {id:-1,name:'Да'}
	, {id:0,name:'Нет'}	];

	/* JournalLinkType - Для связи журналов друг с другом */ 
	public enumJournalLinkTypeCombo(){
		return this.enumJournalLinkType;
	}
	enumJournalLinkType:Array<enumInfo> =[

	 {id:0,name:'Нет'}
	, {id:4,name:'Связка ParentStructRowID  (в передлах объекта)'}
	, {id:3,name:'Связка InstanceID (в передлах объекта)'}
	, {id:1,name:'Ссылка на объект'}
	, {id:2,name:'Ссылка на строку'}	];

	/* TargetType - Вариант уровня приложения, куда может генерироваться код */ 
	public enumTargetTypeCombo(){
		return this.enumTargetType;
	}
	enumTargetType:Array<enumInfo> =[

	 {id:0,name:'СУБД'}
	, {id:3,name:'Документация'}
	, {id:1,name:'МОДЕЛЬ'}
	, {id:2,name:'Приложение'}
	, {id:4,name:'АРМ'}	];

	/* ParityType - Четность */ 
	public enumParityTypeCombo(){
		return this.enumParityType;
	}
	enumParityType:Array<enumInfo> =[

	 {id:4,name:'Space'}
	, {id:3,name:'Mark'}
	, {id:2,name:'Odd'}
	, {id:0,name:'None'}
	, {id:1,name:'Even'}	];

	/* MesureFormat - Формат индикатора */ 
	public enumMesureFormatCombo(){
		return this.enumMesureFormat;
	}
	enumMesureFormat:Array<enumInfo> =[

	 {id:0,name:'Число'}
	, {id:1,name:'Дата'}
	, {id:4,name:'Объект'}
	, {id:2,name:'Справочник'}
	, {id:5,name:'Текст'}	];

	/* ExportType - Тип экспорта */ 
	public enumExportTypeCombo(){
		return this.enumExportType;
	}
	enumExportType:Array<enumInfo> =[

	 {id:3,name:'Сайт и МБ'}
	, {id:1,name:'Сайт'}
	, {id:0,name:'Нет'}	];

	/* WFStepClass - Тип шага процесса */ 
	public enumWFStepClassCombo(){
		return this.enumWFStepClass;
	}
	enumWFStepClass:Array<enumInfo> =[

	 {id:3,name:'PeriodicFunction'}
	, {id:0,name:'SimpleFunction'}
	, {id:2,name:'StopFunction'}
	, {id:1,name:'StartFunction'}	];

	/* DayInWeek - День недели */ 
	public enumDayInWeekCombo(){
		return this.enumDayInWeek;
	}
	enumDayInWeek:Array<enumInfo> =[

	 {id:4,name:'Четверг'}
	, {id:6,name:'Суббота'}
	, {id:1,name:'Понедельник'}
	, {id:7,name:'Воскресенье'}
	, {id:2,name:'Вторник'}
	, {id:5,name:'Пятница'}
	, {id:3,name:'Среда'}	];

	/* GeneratorStyle - GeneratorStyle */ 
	public enumGeneratorStyleCombo(){
		return this.enumGeneratorStyle;
	}
	enumGeneratorStyle:Array<enumInfo> =[

	 {id:0,name:'Один тип'}
	, {id:1,name:'Все типы сразу'}	];

	/* PlatType - Тип плательщика */ 
	public enumPlatTypeCombo(){
		return this.enumPlatType;
	}
	enumPlatType:Array<enumInfo> =[

	 {id:1,name:'Получатель'}
	, {id:0,name:'Отправитель'}
	, {id:2,name:'Другой'}	];

	/* msgState - Состояние заявки */ 
	public enummsgStateCombo(){
		return this.enummsgState;
	}
	enummsgState:Array<enumInfo> =[

	 {id:1,name:'Сообщено абоненту'}
	, {id:3,name:'Промежуточный ответ'}
	, {id:0,name:'Состояние заявки'}
	, {id:2,name:'Абонент не ответил'}	];

	/* OnJournalRowClick - действие при открытии строки журнала */ 
	public enumOnJournalRowClickCombo(){
		return this.enumOnJournalRowClick;
	}
	enumOnJournalRowClick:Array<enumInfo> =[

	 {id:2,name:'Открыть документ'}
	, {id:0,name:'Ничего не делать'}
	, {id:1,name:'Открыть строку'}	];

	/* PartType - PartType */ 
	public enumPartTypeCombo(){
		return this.enumPartType;
	}
	enumPartType:Array<enumInfo> =[

	 {id:1,name:'Коллекция'}
	, {id:2,name:'Дерево'}
	, {id:0,name:'Строка'}
	, {id:4,name:'Расширение с данными'}
	, {id:3,name:'Расширение'}	];

	/* ReferenceType - ReferenceType */ 
	public enumReferenceTypeCombo(){
		return this.enumReferenceType;
	}
	enumReferenceType:Array<enumInfo> =[

	 {id:3,name:'На источник данных'}
	, {id:0,name:'Скалярное поле ( не ссылка)'}
	, {id:2,name:'На строку раздела'}
	, {id:1,name:'На объект '}	];

	/* ContactType -  */ 
	public enumContactTypeCombo(){
		return this.enumContactType;
	}
	enumContactType:Array<enumInfo> =[

	 {id:0,name:'контакт разомкнут'}
	, {id:-1,name:'контакт замкнут'}	];

	/* ConditionType - Варианты условий */ 
	public enumConditionTypeCombo(){
		return this.enumConditionType;
	}
	enumConditionType:Array<enumInfo> =[

	 {id:6,name:'<'}
	, {id:4,name:'>='}
	, {id:7,name:'<='}
	, {id:0,name:'none'}
	, {id:1,name:'='}
	, {id:8,name:'like'}
	, {id:3,name:'>'}
	, {id:2,name:'<>'}	];

	/* FolderType - Тип папки */ 
	public enumFolderTypeCombo(){
		return this.enumFolderType;
	}
	enumFolderType:Array<enumInfo> =[

	 {id:3,name:'Удаленные'}
	, {id:1,name:'Входящие'}
	, {id:9,name:'Отложенные'}
	, {id:4,name:'Журнал'}
	, {id:2,name:'Исходящие'}
	, {id:7,name:'Черновики'}
	, {id:6,name:'Отправленные'}
	, {id:8,name:'В работе'}
	, {id:5,name:'Календарь'}
	, {id:10,name:'Завершенные'}
	, {id:0,name:'cls__'}	];

	/* msgResult - Результат */ 
	public enummsgResultCombo(){
		return this.enummsgResult;
	}
	enummsgResult:Array<enumInfo> =[

	 {id:2,name:'Выполнено'}
	, {id:1,name:'В работе'}
	, {id:0,name:'Результат'}	];

	/* PartAddBehaivor - Поведение при добавлении строки раздела */ 
	public enumPartAddBehaivorCombo(){
		return this.enumPartAddBehaivor;
	}
	enumPartAddBehaivor:Array<enumInfo> =[

	 {id:0,name:'AddForm'}
	, {id:2,name:'RunAction'}
	, {id:1,name:'RefreshOnly'}	];

	/* ExtentionType - Тип расширения */ 
	public enumExtentionTypeCombo(){
		return this.enumExtentionType;
	}
	enumExtentionType:Array<enumInfo> =[

	 {id:6,name:'VerifyRowExt'}
	, {id:7,name:'CodeGenerator'}
	, {id:5,name:'DefaultExt'}
	, {id:0,name:'StatusExt'}
	, {id:4,name:'JrnlRunExt'}
	, {id:2,name:'CustomExt'}
	, {id:8,name:'ARMGenerator'}
	, {id:1,name:'OnFormExt'}
	, {id:3,name:'JrnlAddExt'}	];

	/* Sex - Мужской / Женский */ 
	public enumSexCombo(){
		return this.enumSex;
	}
	enumSex:Array<enumInfo> =[

	 {id:0,name:'Не существенно'}
	, {id:2,name:'Мужской'}
	, {id:1,name:'Женский'}	];

	/* YesNo - Да / Нет (0 или 1) */ 
	public enumYesNoCombo(){
		return this.enumYesNo;
	}
	enumYesNo:Array<enumInfo> =[

	 {id:1,name:'Да'}
	, {id:0,name:'Нет'}	];

	/* AggregationType - Вариант агрегации по полю */ 
	public enumAggregationTypeCombo(){
		return this.enumAggregationType;
	}
	enumAggregationType:Array<enumInfo> =[

	 {id:3,name:'SUM'}
	, {id:1,name:'AVG'}
	, {id:6,name:'CUSTOM'}
	, {id:0,name:'none'}
	, {id:2,name:'COUNT'}
	, {id:5,name:'MAX'}
	, {id:4,name:'MIN'}	];

	/* WFFuncState - Состояние функции в бизнес процессе */ 
	public enumWFFuncStateCombo(){
		return this.enumWFFuncState;
	}
	enumWFFuncState:Array<enumInfo> =[

	 {id:8,name:'Processed'}
	, {id:3,name:'InWork'}
	, {id:4,name:'Pause'}
	, {id:6,name:'InControl'}
	, {id:2,name:'Active'}
	, {id:5,name:'Ready'}
	, {id:7,name:'Done'}
	, {id:1,name:'Prepare'}
	, {id:0,name:'Initial'}	];

	/* Employment - Занятость */ 
	public enumEmploymentCombo(){
		return this.enumEmployment;
	}
	enumEmployment:Array<enumInfo> =[

	 {id:1,name:'Частичная'}
	, {id:-1,name:'Не важно'}
	, {id:0,name:'Полная'}	];

	/* TriState - Да / Нет / Не определено */ 
	public enumTriStateCombo(){
		return this.enumTriState;
	}
	enumTriState:Array<enumInfo> =[

	 {id:-1,name:'Не существенно'}
	, {id:1,name:'Да'}
	, {id:0,name:'Нет'}	];
 
}
