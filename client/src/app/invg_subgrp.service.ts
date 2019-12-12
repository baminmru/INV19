import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { invg} from './invg';
@Injectable()
export class invg_subgrp_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	name:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all invg_subgrps
    getAll_invg_subgrps(): Observable<invg.invg_subgrp[]> {
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
			return this.http.get<invg.invg_subgrp[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<invg.invg_subgrp[]>(this.serviceURL + '/invg_subgrp/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.name = '';
		
	}
 
	   //Create invg_subgrp
    create_invg_subgrp(invg_subgrp: invg.invg_subgrp): Observable<Object > {
       // invg_subgrp.invg_subgrpId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post(this.serviceURL + '/invg_subgrp/', invg_subgrp, { headers: cpHeaders })
		
    }
	
	//Fetch invg_subgrp by parent
    get_invg_subgrpByParent(parentId: string): Observable<invg.invg_subgrp[]> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		   console.log(this.serviceURL +'/invg_subgrp/byparent/'+ parentId)
        return this.http.get<invg.invg_subgrp[]>(this.serviceURL + '/invg_subgrp/byparent/' + parentId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	//Fetch invg_subgrp by id
    get_invg_subgrpById(invg_subgrpId: string): Observable<invg.invg_subgrp> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/invg_subgrp/'+ invg_subgrpId)
        return this.http.get<invg.invg_subgrp>(this.serviceURL + '/invg_subgrp/' + invg_subgrpId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update invg_subgrp
    update_invg_subgrp(invg_subgrp: invg.invg_subgrp):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/invg_subgrp/' + invg_subgrp.invg_subgrpId, invg_subgrp, { headers: cpHeaders })
    }
	
    //Delete invg_subgrp	
    delete_invg_subgrpById(invg_subgrpId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/invg_subgrp/' + invg_subgrpId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:invg.invg_subgrp = null;
	
	public 	get Selected():invg.invg_subgrp{ return this.mSelecetd;}
	
	public  set Selected(_invg_subgrp:invg.invg_subgrp){ this.mSelecetd=_invg_subgrp; }
 
}
