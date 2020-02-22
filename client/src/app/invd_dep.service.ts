import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { invd} from './invd';
@Injectable()
export class invd_dep_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	name:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all invd_deps
    getAll_invd_deps(): Observable<invd.invd_dep[]> {
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
			return this.http.get<invd.invd_dep[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<invd.invd_dep[]>(this.serviceURL + '/invd_dep/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.name = '';
		
	}
 
	   //Create invd_dep
    create_invd_dep(invd_dep: invd.invd_dep): Observable<invd.invd_dep > {
       // invd_dep.invd_depId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post<invd.invd_dep >(this.serviceURL + '/invd_dep/', invd_dep, { headers: cpHeaders })
		
    }
	
	//Fetch invd_dep by id
    get_invd_depById(invd_depId: string): Observable<invd.invd_dep> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/invd_dep/'+ invd_depId)
        return this.http.get<invd.invd_dep>(this.serviceURL + '/invd_dep/' + invd_depId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update invd_dep
    update_invd_dep(invd_dep: invd.invd_dep):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/invd_dep/' + invd_dep.invd_depId, invd_dep, { headers: cpHeaders })
    }
	
    //Delete invd_dep	
    delete_invd_depById(invd_depId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/invd_dep/' + invd_depId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:invd.invd_dep = null;
	
	public 	get Selected():invd.invd_dep{ return this.mSelecetd;}
	
	public  set Selected(_invd_dep:invd.invd_dep){ this.mSelecetd=_invd_dep; }
 
}
