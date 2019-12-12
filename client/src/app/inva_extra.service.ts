import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { inva} from './inva';
@Injectable()
export class inva_extra_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	Qty:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all inva_extras
    getAll_inva_extras(): Observable<inva.inva_extra[]> {
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
			return this.http.get<inva.inva_extra[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<inva.inva_extra[]>(this.serviceURL + '/inva_extra/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.Qty = '';
		
	}
 
	   //Create inva_extra
    create_inva_extra(inva_extra: inva.inva_extra): Observable<Object > {
       // inva_extra.inva_extraId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post(this.serviceURL + '/inva_extra/', inva_extra, { headers: cpHeaders })
		
    }
	
	//Fetch inva_extra by parent
    get_inva_extraByParent(parentId: string): Observable<inva.inva_extra[]> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		   console.log(this.serviceURL +'/inva_extra/byparent/'+ parentId)
        return this.http.get<inva.inva_extra[]>(this.serviceURL + '/inva_extra/byparent/' + parentId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	//Fetch inva_extra by id
    get_inva_extraById(inva_extraId: string): Observable<inva.inva_extra> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/inva_extra/'+ inva_extraId)
        return this.http.get<inva.inva_extra>(this.serviceURL + '/inva_extra/' + inva_extraId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update inva_extra
    update_inva_extra(inva_extra: inva.inva_extra):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/inva_extra/' + inva_extra.inva_extraId, inva_extra, { headers: cpHeaders })
    }
	
    //Delete inva_extra	
    delete_inva_extraById(inva_extraId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/inva_extra/' + inva_extraId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:inva.inva_extra = null;
	
	public 	get Selected():inva.inva_extra{ return this.mSelecetd;}
	
	public  set Selected(_inva_extra:inva.inva_extra){ this.mSelecetd=_inva_extra; }
 
}
