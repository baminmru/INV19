import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { invw} from './invw';
@Injectable()
export class invw_info_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	Qty:string = '';
	RFID:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all invw_infos
    getAll_invw_infos(): Observable<invw.invw_info[]> {
		var qry:string;
		qry='';
		
		if(this.Qty!=''){
			if(qry !='') qry=qry +'&';
			qry='Qty='+encodeURIComponent(this.Qty)
		}
		if(this.RFID!=''){
			if(qry !='') qry=qry +'&';
			qry='RFID='+encodeURIComponent(this.RFID)
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
			return this.http.get<invw.invw_info[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<invw.invw_info[]>(this.serviceURL + '/invw_info/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.Qty = '';
	this.RFID = '';
		
	}
 
	   //Create invw_info
    create_invw_info(invw_info: invw.invw_info): Observable<invw.invw_info > {
       // invw_info.invw_infoId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post<invw.invw_info >(this.serviceURL + '/invw_info/', invw_info, { headers: cpHeaders })
		
    }
	
	//Fetch invw_info by id
    get_invw_infoById(invw_infoId: string): Observable<invw.invw_info> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/invw_info/'+ invw_infoId)
        return this.http.get<invw.invw_info>(this.serviceURL + '/invw_info/' + invw_infoId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update invw_info
    update_invw_info(invw_info: invw.invw_info):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/invw_info/' + invw_info.invw_infoId, invw_info, { headers: cpHeaders })
    }
	
    //Delete invw_info	
    delete_invw_infoById(invw_infoId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/invw_info/' + invw_infoId, { headers: cpHeaders })
            
			
	}	
	

	report(): Observable<any> {
        let cpHeaders = new HttpHeaders({
		'Content-Type': 'application/octet-stream',
		'Accept': 'application/octet-stream', 
		'Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		
		const options : any = {
            observe: "response",
            responseType: "blob",
            headers: cpHeaders
        };

        return this.http.request<any>('get', this.serviceURL + '/report/losttags/', options )
    }

	
	private mSelecetd:invw.invw_info = null;
	
	public 	get Selected():invw.invw_info{ return this.mSelecetd;}
	
	public  set Selected(_invw_info:invw.invw_info){ this.mSelecetd=_invw_info; }
 
}
