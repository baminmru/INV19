import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { inva} from './inva';
@Injectable()
export class inva_real_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	Qty:string = '';
	RFID:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all inva_reals
    getAll_inva_reals(): Observable<inva.inva_real[]> {
		var qry:string;
		qry='';
		
		if(this.Qty!=''){
			if(qry !='') qry=qry +'&';
			qry='Qty='+encodeURIComponent(this.Qty)
		}
		if(this.RFID!=''){
			if(qry !='') qry=qry +'&';
			qry='RFID='+encodeURIComponent(this.RFID)
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
			return this.http.get<inva.inva_real[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<inva.inva_real[]>(this.serviceURL + '/inva_real/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.Qty = '';
	this.RFID = '';
		
	}
 
	   //Create inva_real
    create_inva_real(inva_real: inva.inva_real): Observable<inva.inva_real > {
       // inva_real.inva_realId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post<inva.inva_real >(this.serviceURL + '/inva_real/', inva_real, { headers: cpHeaders })
		
    }
	
	//Fetch inva_real by parent
    get_inva_realByParent(parentId: string): Observable<inva.inva_real[]> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		   console.log(this.serviceURL +'/inva_real/byparent/'+ parentId)
        return this.http.get<inva.inva_real[]>(this.serviceURL + '/inva_real/byparent/' + parentId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	//Fetch inva_real by id
    get_inva_realById(inva_realId: string): Observable<inva.inva_real> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/inva_real/'+ inva_realId)
        return this.http.get<inva.inva_real>(this.serviceURL + '/inva_real/' + inva_realId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update inva_real
    update_inva_real(inva_real: inva.inva_real):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/inva_real/' + inva_real.inva_realId, inva_real, { headers: cpHeaders })
    }
	
    //Delete inva_real	
    delete_inva_realById(inva_realId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/inva_real/' + inva_realId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:inva.inva_real = null;
	
	public 	get Selected():inva.inva_real{ return this.mSelecetd;}
	
	public  set Selected(_inva_real:inva.inva_real){ this.mSelecetd=_inva_real; }
 
}
