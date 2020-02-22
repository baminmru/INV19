import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { invd} from './invd';
@Injectable()
export class invd_store_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	name:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all invd_stores
    getAll_invd_stores(): Observable<invd.invd_store[]> {
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
			return this.http.get<invd.invd_store[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<invd.invd_store[]>(this.serviceURL + '/invd_store/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.name = '';
		
	}
 
	   //Create invd_store
    create_invd_store(invd_store: invd.invd_store): Observable<invd.invd_store > {
       // invd_store.invd_storeId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post<invd.invd_store >(this.serviceURL + '/invd_store/', invd_store, { headers: cpHeaders })
		
    }
	
	//Fetch invd_store by id
    get_invd_storeById(invd_storeId: string): Observable<invd.invd_store> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/invd_store/'+ invd_storeId)
        return this.http.get<invd.invd_store>(this.serviceURL + '/invd_store/' + invd_storeId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update invd_store
    update_invd_store(invd_store: invd.invd_store):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/invd_store/' + invd_store.invd_storeId, invd_store, { headers: cpHeaders })
    }
	
    //Delete invd_store	
    delete_invd_storeById(invd_storeId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/invd_store/' + invd_storeId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:invd.invd_store = null;
	
	public 	get Selected():invd.invd_store{ return this.mSelecetd;}
	
	public  set Selected(_invd_store:invd.invd_store){ this.mSelecetd=_invd_store; }
 
}
