import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { invi} from './invi';
@Injectable()
export class invp_tag_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	RFID:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all invp_tags
    getAll_invp_tags(): Observable<invi.invp_tag[]> {
		var qry:string;
		qry='';
		
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
			return this.http.get<invi.invp_tag[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<invi.invp_tag[]>(this.serviceURL + '/invp_tag/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.RFID = '';
		
	}
 
	   //Create invp_tag
    create_invp_tag(invp_tag: invi.invp_tag): Observable<invi.invp_tag > {
       // invp_tag.invp_tagId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post<invi.invp_tag >(this.serviceURL + '/invp_tag/', invp_tag, { headers: cpHeaders })
		
    }
	
	//Fetch invp_tag by parent
    get_invp_tagByParent(parentId: string): Observable<invi.invp_tag[]> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		   console.log(this.serviceURL +'/invp_tag/byparent/'+ parentId)
        return this.http.get<invi.invp_tag[]>(this.serviceURL + '/invp_tag/byparent/' + parentId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	//Fetch invp_tag by id
    get_invp_tagById(invp_tagId: string): Observable<invi.invp_tag> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/invp_tag/'+ invp_tagId)
        return this.http.get<invi.invp_tag>(this.serviceURL + '/invp_tag/' + invp_tagId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update invp_tag
    update_invp_tag(invp_tag: invi.invp_tag):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/invp_tag/' + invp_tag.invp_tagId, invp_tag, { headers: cpHeaders })
    }
	
    //Delete invp_tag	
    delete_invp_tagById(invp_tagId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/invp_tag/' + invp_tagId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:invi.invp_tag = null;
	
	public 	get Selected():invi.invp_tag{ return this.mSelecetd;}
	
	public  set Selected(_invp_tag:invi.invp_tag){ this.mSelecetd=_invp_tag; }
 
}
