import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { XUser} from './XUser';
@Injectable()
export class xUserInfo_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	family:string = '';
	name:string = '';
	partonymic:string = '';
	email:string = '';
	phone:string = '';
	login:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all xUserInfos
    getAll_xUserInfos(): Observable<XUser.xUserInfo[]> {
		var qry:string;
		qry='';
		
		if(this.family!=''){
			if(qry !='') qry=qry +'&';
			qry='family='+encodeURIComponent(this.family)
		}
		if(this.name!=''){
			if(qry !='') qry=qry +'&';
			qry='name='+encodeURIComponent(this.name)
		}
		if(this.partonymic!=''){
			if(qry !='') qry=qry +'&';
			qry='partonymic='+encodeURIComponent(this.partonymic)
		}
		if(this.email!=''){
			if(qry !='') qry=qry +'&';
			qry='email='+encodeURIComponent(this.email)
		}
		if(this.phone!=''){
			if(qry !='') qry=qry +'&';
			qry='phone='+encodeURIComponent(this.phone)
		}
		if(this.login!=''){
			if(qry !='') qry=qry +'&';
			qry='login='+encodeURIComponent(this.login)
		}
		/*
		if(this.PageNo!=null){
			if(qry !='') qry=qry +;
			//qry='page='+this.PageNo;
			qry='_getpagesoffset=' + ((this.PageNo-1) * this.PageSize)+'&_count=' +this.PageSize;
		}
		*/
		
		let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		if(this.PageUrl!=''){
			return this.http.get<XUser.xUserInfo[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<XUser.xUserInfo[]>(this.serviceURL + '/xUserInfo/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.family = '';
	this.name = '';
	this.partonymic = '';
	this.email = '';
	this.phone = '';
	this.login = '';
		
	}
 
	   //Create xUserInfo
    create_xUserInfo(xUserInfo: XUser.xUserInfo): Observable<XUser.xUserInfo > {
       // xUserInfo.xUserInfoId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post<XUser.xUserInfo >(this.serviceURL + '/xUserInfo/', xUserInfo, { headers: cpHeaders })
		
    }
	
	//Fetch xUserInfo by id
    get_xUserInfoById(xUserInfoId: string): Observable<XUser.xUserInfo> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/xUserInfo/'+ xUserInfoId)
        return this.http.get<XUser.xUserInfo>(this.serviceURL + '/xUserInfo/' + xUserInfoId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update xUserInfo
    update_xUserInfo(xUserInfo: XUser.xUserInfo):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/xUserInfo/' + xUserInfo.xUserInfoId, xUserInfo, { headers: cpHeaders })
    }
	
    //Delete xUserInfo	
    delete_xUserInfoById(xUserInfoId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/xUserInfo/' + xUserInfoId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:XUser.xUserInfo = null;
	
	public 	get Selected():XUser.xUserInfo{ return this.mSelecetd;}
	
	public  set Selected(_xUserInfo:XUser.xUserInfo){ this.mSelecetd=_xUserInfo; }
 
}
