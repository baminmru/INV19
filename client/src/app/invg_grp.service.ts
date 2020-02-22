import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { invg} from './invg';
@Injectable()
export class invg_grp_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	name:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all invg_grps
    getAll_invg_grps(): Observable<invg.invg_grp[]> {
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
			return this.http.get<invg.invg_grp[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<invg.invg_grp[]>(this.serviceURL + '/invg_grp/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.name = '';
		
	}
 
	   //Create invg_grp
    create_invg_grp(invg_grp: invg.invg_grp): Observable<invg.invg_grp > {
       // invg_grp.invg_grpId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post<invg.invg_grp >(this.serviceURL + '/invg_grp/', invg_grp, { headers: cpHeaders })
		
    }
	
	//Fetch invg_grp by id
    get_invg_grpById(invg_grpId: string): Observable<invg.invg_grp> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/invg_grp/'+ invg_grpId)
        return this.http.get<invg.invg_grp>(this.serviceURL + '/invg_grp/' + invg_grpId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update invg_grp
    update_invg_grp(invg_grp: invg.invg_grp):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/invg_grp/' + invg_grp.invg_grpId, invg_grp, { headers: cpHeaders })
    }
	
    //Delete invg_grp	
    delete_invg_grpById(invg_grpId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/invg_grp/' + invg_grpId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:invg.invg_grp = null;
	
	public 	get Selected():invg.invg_grp{ return this.mSelecetd;}
	
	public  set Selected(_invg_grp:invg.invg_grp){ this.mSelecetd=_invg_grp; }
 
}
