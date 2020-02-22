import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { inva} from './inva';
@Injectable()
export class inva_info_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	invDate:string = '';
	invReason:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all inva_infos
    getAll_inva_infos(): Observable<inva.inva_info[]> {
		var qry:string;
		qry='';
		
		if(this.invDate!=''){
			if(qry !='') qry=qry +'&';
			qry='invDate='+encodeURIComponent(this.invDate)
		}
		if(this.invReason!=''){
			if(qry !='') qry=qry +'&';
			qry='invReason='+encodeURIComponent(this.invReason)
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
			return this.http.get<inva.inva_info[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<inva.inva_info[]>(this.serviceURL + '/inva_info/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.invDate = '';
	this.invReason = '';
		
	}
 
	   //Create inva_info
    create_inva_info(inva_info: inva.inva_info): Observable<inva.inva_info > {
       // inva_info.inva_infoId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post<inva.inva_info >(this.serviceURL + '/inva_info/', inva_info, { headers: cpHeaders })
		
    }
	
	//Fetch inva_info by id
    get_inva_infoById(inva_infoId: string): Observable<inva.inva_info> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/inva_info/'+ inva_infoId)
        return this.http.get<inva.inva_info>(this.serviceURL + '/inva_info/' + inva_infoId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update inva_info
    update_inva_info(inva_info: inva.inva_info):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/inva_info/' + inva_info.inva_infoId, inva_info, { headers: cpHeaders })
    }
	
    //Delete inva_info	
    delete_inva_infoById(inva_infoId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/inva_info/' + inva_infoId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:inva.inva_info = null;
	
	public 	get Selected():inva.inva_info{ return this.mSelecetd;}
	
	public  set Selected(_inva_info:inva.inva_info){ this.mSelecetd=_inva_info; }
 
}
