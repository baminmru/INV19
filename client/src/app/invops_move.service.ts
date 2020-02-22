import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { invops} from './invops';
@Injectable()
export class invops_move_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	shCodeFrom:string = '';
	shCodeTo:string = '';
	rfid:string = '';
	quantity:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all invops_moves
    getAll_invops_moves(): Observable<invops.invops_move[]> {
		var qry:string;
		qry='';
		
		if(this.shCodeFrom!=''){
			if(qry !='') qry=qry +'&';
			qry='shCodeFrom='+encodeURIComponent(this.shCodeFrom)
		}
		if(this.shCodeTo!=''){
			if(qry !='') qry=qry +'&';
			qry='shCodeTo='+encodeURIComponent(this.shCodeTo)
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
			return this.http.get<invops.invops_move[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<invops.invops_move[]>(this.serviceURL + '/invops_move/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.shCodeFrom = '';
	this.shCodeTo = '';
	this.rfid = '';
	this.quantity = '';
		
	}
 
	   //Create invops_move
    create_invops_move(invops_move: invops.invops_move): Observable<invops.invops_move > {
       // invops_move.invops_moveId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post<invops.invops_move >(this.serviceURL + '/invops_move/', invops_move, { headers: cpHeaders })
		
    }
	
	//Fetch invops_move by id
    get_invops_moveById(invops_moveId: string): Observable<invops.invops_move> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/invops_move/'+ invops_moveId)
        return this.http.get<invops.invops_move>(this.serviceURL + '/invops_move/' + invops_moveId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update invops_move
    update_invops_move(invops_move: invops.invops_move):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/invops_move/' + invops_move.invops_moveId, invops_move, { headers: cpHeaders })
    }
	
    //Delete invops_move	
    delete_invops_moveById(invops_moveId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/invops_move/' + invops_moveId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:invops.invops_move = null;
	
	public 	get Selected():invops.invops_move{ return this.mSelecetd;}
	
	public  set Selected(_invops_move:invops.invops_move){ this.mSelecetd=_invops_move; }
 
}
