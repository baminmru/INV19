import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { invm} from './invm';
@Injectable()
export class invm_info_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	Qty:string = '';
	optime:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all invm_infos
    getAll_invm_infos(): Observable<invm.invm_info[]> {
		var qry:string;
		qry='';
		
		if(this.Qty!=''){
			if(qry !='') qry=qry +'&';
			qry='Qty='+encodeURIComponent(this.Qty)
		}
		if(this.optime!=''){
			if(qry !='') qry=qry +'&';
			qry='optime='+encodeURIComponent(this.optime)
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
			return this.http.get<invm.invm_info[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<invm.invm_info[]>(this.serviceURL + '/invm_info/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.Qty = '';
	this.optime = '';
		
	}
 
	   //Create invm_info
    create_invm_info(invm_info: invm.invm_info): Observable<Object > {
       // invm_info.invm_infoId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post(this.serviceURL + '/invm_info/', invm_info, { headers: cpHeaders })
		
    }
	
	//Fetch invm_info by id
    get_invm_infoById(invm_infoId: string): Observable<invm.invm_info> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/invm_info/'+ invm_infoId)
        return this.http.get<invm.invm_info>(this.serviceURL + '/invm_info/' + invm_infoId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update invm_info
    update_invm_info(invm_info: invm.invm_info):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/invm_info/' + invm_info.invm_infoId, invm_info, { headers: cpHeaders })
    }
	
    //Delete invm_info	
    delete_invm_infoById(invm_infoId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/invm_info/' + invm_infoId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:invm.invm_info = null;
	
	public 	get Selected():invm.invm_info{ return this.mSelecetd;}
	
	public  set Selected(_invm_info:invm.invm_info){ this.mSelecetd=_invm_info; }
 
}
