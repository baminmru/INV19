import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { inva} from './inva';
@Injectable()
export class inva_absnt_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	Qty:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all inva_absnts
    getAll_inva_absnts(): Observable<inva.inva_absnt[]> {
		var qry:string;
		qry='';
		
		if(this.Qty!=''){
			if(qry !='') qry=qry +'&';
			qry='Qty='+encodeURIComponent(this.Qty)
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
			return this.http.get<inva.inva_absnt[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<inva.inva_absnt[]>(this.serviceURL + '/inva_absnt/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.Qty = '';
		
	}
 
	   //Create inva_absnt
    create_inva_absnt(inva_absnt: inva.inva_absnt): Observable<Object > {
       // inva_absnt.inva_absntId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post(this.serviceURL + '/inva_absnt/', inva_absnt, { headers: cpHeaders })
		
    }
	
	//Fetch inva_absnt by parent
    get_inva_absntByParent(parentId: string): Observable<inva.inva_absnt[]> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		   console.log(this.serviceURL +'/inva_absnt/byparent/'+ parentId)
        return this.http.get<inva.inva_absnt[]>(this.serviceURL + '/inva_absnt/byparent/' + parentId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	//Fetch inva_absnt by id
    get_inva_absntById(inva_absntId: string): Observable<inva.inva_absnt> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/inva_absnt/'+ inva_absntId)
        return this.http.get<inva.inva_absnt>(this.serviceURL + '/inva_absnt/' + inva_absntId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update inva_absnt
    update_inva_absnt(inva_absnt: inva.inva_absnt):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/inva_absnt/' + inva_absnt.inva_absntId, inva_absnt, { headers: cpHeaders })
    }
	
    //Delete inva_absnt	
    delete_inva_absntById(inva_absntId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/inva_absnt/' + inva_absntId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:inva.inva_absnt = null;
	
	public 	get Selected():inva.inva_absnt{ return this.mSelecetd;}
	
	public  set Selected(_inva_absnt:inva.inva_absnt){ this.mSelecetd=_inva_absnt; }
 
}
