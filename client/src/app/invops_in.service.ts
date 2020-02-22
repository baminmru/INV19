import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { invops} from './invops';
@Injectable()
export class invops_in_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	shCode:string = '';
	rfid:string = '';
	quantity:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all invops_ins
    getAll_invops_ins(): Observable<invops.invops_in[]> {
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
			return this.http.get<invops.invops_in[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<invops.invops_in[]>(this.serviceURL + '/invops_in/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.shCode = '';
	this.rfid = '';
	this.quantity = '';
		
	}
 
	   //Create invops_in
    create_invops_in(invops_in: invops.invops_in): Observable<invops.invops_in > {
       // invops_in.invops_inId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post<invops.invops_in >(this.serviceURL + '/invops_in/', invops_in, { headers: cpHeaders })
		
    }
	
	//Fetch invops_in by id
    get_invops_inById(invops_inId: string): Observable<invops.invops_in> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/invops_in/'+ invops_inId)
        return this.http.get<invops.invops_in>(this.serviceURL + '/invops_in/' + invops_inId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update invops_in
    update_invops_in(invops_in: invops.invops_in):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/invops_in/' + invops_in.invops_inId, invops_in, { headers: cpHeaders })
    }
	
    //Delete invops_in	
    delete_invops_inById(invops_inId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/invops_in/' + invops_inId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:invops.invops_in = null;
	
	public 	get Selected():invops.invops_in{ return this.mSelecetd;}
	
	public  set Selected(_invops_in:invops.invops_in){ this.mSelecetd=_invops_in; }
 
}
