import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { invwh} from './invwh';
@Injectable()
export class invwh_cell_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	name:string = '';
	SHCODE:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all invwh_cells
    getAll_invwh_cells(): Observable<invwh.invwh_cell[]> {
		var qry:string;
		qry='';
		
		if(this.name!=''){
			if(qry !='') qry=qry +'&';
			qry='name='+encodeURIComponent(this.name)
		}
		if(this.SHCODE!=''){
			if(qry !='') qry=qry +'&';
			qry='SHCODE='+encodeURIComponent(this.SHCODE)
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
			return this.http.get<invwh.invwh_cell[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<invwh.invwh_cell[]>(this.serviceURL + '/invwh_cell/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.name = '';
	this.SHCODE = '';
		
	}
 
	   //Create invwh_cell
    create_invwh_cell(invwh_cell: invwh.invwh_cell): Observable<invwh.invwh_cell > {
       // invwh_cell.invwh_cellId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post<invwh.invwh_cell >(this.serviceURL + '/invwh_cell/', invwh_cell, { headers: cpHeaders })
		
    }
	
	//Fetch invwh_cell by parent
    get_invwh_cellByParent(parentId: string): Observable<invwh.invwh_cell[]> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		   console.log(this.serviceURL +'/invwh_cell/byparent/'+ parentId)
        return this.http.get<invwh.invwh_cell[]>(this.serviceURL + '/invwh_cell/byparent/' + parentId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	//Fetch invwh_cell by id
    get_invwh_cellById(invwh_cellId: string): Observable<invwh.invwh_cell> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/invwh_cell/'+ invwh_cellId)
        return this.http.get<invwh.invwh_cell>(this.serviceURL + '/invwh_cell/' + invwh_cellId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update invwh_cell
    update_invwh_cell(invwh_cell: invwh.invwh_cell):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/invwh_cell/' + invwh_cell.invwh_cellId, invwh_cell, { headers: cpHeaders })
    }
	
    //Delete invwh_cell	
    delete_invwh_cellById(invwh_cellId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/invwh_cell/' + invwh_cellId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:invwh.invwh_cell = null;
	
	public 	get Selected():invwh.invwh_cell{ return this.mSelecetd;}
	
	public  set Selected(_invwh_cell:invwh.invwh_cell){ this.mSelecetd=_invwh_cell; }
 
}
