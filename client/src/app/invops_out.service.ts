import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { invops} from './invops';
@Injectable()
export class invops_out_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	shCode:string = '';
	rfid:string = '';
	quantity:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all invops_outs
    getAll_invops_outs(): Observable<invops.invops_out[]> {
		var qry:string;
		qry='';
		
		if(this.shCode!=''){
			if(qry !='') qry=qry +'&';
			qry='shCode='+encodeURIComponent(this.shCode)
		}
		if(this.rfid!=''){
			if(qry !='') qry=qry +'&';
			qry='rfid='+encodeURIComponent(this.rfid)
		}
		if(this.quantity!=''){
			if(qry !='') qry=qry +'&';
			qry='quantity='+encodeURIComponent(this.quantity)
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
			return this.http.get<invops.invops_out[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<invops.invops_out[]>(this.serviceURL + '/invops_out/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.shCode = '';
	this.rfid = '';
	this.quantity = '';
		
	}
 
	   //Create invops_out
    create_invops_out(invops_out: invops.invops_out): Observable<invops.invops_out > {
       // invops_out.invops_outId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post<invops.invops_out >(this.serviceURL + '/invops_out/', invops_out, { headers: cpHeaders })
		
    }
	
	//Fetch invops_out by id
    get_invops_outById(invops_outId: string): Observable<invops.invops_out> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/invops_out/'+ invops_outId)
        return this.http.get<invops.invops_out>(this.serviceURL + '/invops_out/' + invops_outId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update invops_out
    update_invops_out(invops_out: invops.invops_out):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/invops_out/' + invops_out.invops_outId, invops_out, { headers: cpHeaders })
    }
	
    //Delete invops_out	
    delete_invops_outById(invops_outId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/invops_out/' + invops_outId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:invops.invops_out = null;
	
	public 	get Selected():invops.invops_out{ return this.mSelecetd;}
	
	public  set Selected(_invops_out:invops.invops_out){ this.mSelecetd=_invops_out; }
 
}
