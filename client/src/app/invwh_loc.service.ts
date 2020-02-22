import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { invwh} from './invwh';
@Injectable()
export class invwh_loc_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	name:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all invwh_locs
    getAll_invwh_locs(): Observable<invwh.invwh_loc[]> {
		var qry:string;
		qry='';
		
		if(this.name!=''){
			if(qry !='') qry=qry +'&';
			qry='name='+encodeURIComponent(this.name)
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
			return this.http.get<invwh.invwh_loc[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<invwh.invwh_loc[]>(this.serviceURL + '/invwh_loc/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.name = '';
		
	}
 
	   //Create invwh_loc
    create_invwh_loc(invwh_loc: invwh.invwh_loc): Observable<invwh.invwh_loc > {
       // invwh_loc.invwh_locId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post<invwh.invwh_loc >(this.serviceURL + '/invwh_loc/', invwh_loc, { headers: cpHeaders })
		
    }
	
	//Fetch invwh_loc by id
    get_invwh_locById(invwh_locId: string): Observable<invwh.invwh_loc> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/invwh_loc/'+ invwh_locId)
        return this.http.get<invwh.invwh_loc>(this.serviceURL + '/invwh_loc/' + invwh_locId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update invwh_loc
    update_invwh_loc(invwh_loc: invwh.invwh_loc):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/invwh_loc/' + invwh_loc.invwh_locId, invwh_loc, { headers: cpHeaders })
    }
	
    //Delete invwh_loc	
    delete_invwh_locById(invwh_locId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/invwh_loc/' + invwh_locId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:invwh.invwh_loc = null;
	
	public 	get Selected():invwh.invwh_loc{ return this.mSelecetd;}
	
	public  set Selected(_invwh_loc:invwh.invwh_loc){ this.mSelecetd=_invwh_loc; }
 
}
