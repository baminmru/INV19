import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { invi} from './invi';
@Injectable()
export class invp_data_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	name:string = '';
	RFID:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all invp_datas
    getAll_invp_datas(): Observable<invi.invp_data[]> {
		var qry:string;
		qry='';
		
		if(this.name!=''){
			if(qry !='') qry=qry +'&';
			qry='name='+encodeURIComponent(this.name)
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
			return this.http.get<invi.invp_data[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<invi.invp_data[]>(this.serviceURL + '/invp_data/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.name = '';
	this.RFID = '';
		
	}
 
	   //Create invp_data
    create_invp_data(invp_data: invi.invp_data): Observable<Object > {
       // invp_data.invp_dataId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post(this.serviceURL + '/invp_data/', invp_data, { headers: cpHeaders })
		
    }
	
	//Fetch invp_data by id
    get_invp_dataById(invp_dataId: string): Observable<invi.invp_data> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/invp_data/'+ invp_dataId)
        return this.http.get<invi.invp_data>(this.serviceURL + '/invp_data/' + invp_dataId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update invp_data
    update_invp_data(invp_data: invi.invp_data):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/invp_data/' + invp_data.invp_dataId, invp_data, { headers: cpHeaders })
    }
	
    //Delete invp_data	
    delete_invp_dataById(invp_dataId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/invp_data/' + invp_dataId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:invi.invp_data = null;
	
	public 	get Selected():invi.invp_data{ return this.mSelecetd;}
	
	public  set Selected(_invp_data:invi.invp_data){ this.mSelecetd=_invp_data; }
 
}
