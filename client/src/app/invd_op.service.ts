import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { invd} from './invd';
@Injectable()
export class invd_op_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	name:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all invd_ops
    getAll_invd_ops(): Observable<invd.invd_op[]> {
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
			return this.http.get<invd.invd_op[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<invd.invd_op[]>(this.serviceURL + '/invd_op/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.name = '';
		
	}
 
	   //Create invd_op
    create_invd_op(invd_op: invd.invd_op): Observable<invd.invd_op > {
       // invd_op.invd_opId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post<invd.invd_op >(this.serviceURL + '/invd_op/', invd_op, { headers: cpHeaders })
		
    }
	
	//Fetch invd_op by id
    get_invd_opById(invd_opId: string): Observable<invd.invd_op> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/invd_op/'+ invd_opId)
        return this.http.get<invd.invd_op>(this.serviceURL + '/invd_op/' + invd_opId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update invd_op
    update_invd_op(invd_op: invd.invd_op):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/invd_op/' + invd_op.invd_opId, invd_op, { headers: cpHeaders })
    }
	
    //Delete invd_op	
    delete_invd_opById(invd_opId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/invd_op/' + invd_opId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:invd.invd_op = null;
	
	public 	get Selected():invd.invd_op{ return this.mSelecetd;}
	
	public  set Selected(_invd_op:invd.invd_op){ this.mSelecetd=_invd_op; }
 
}
