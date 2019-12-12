import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { invd} from './invd';
@Injectable()
export class invd_zone_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	name:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all invd_zones
    getAll_invd_zones(): Observable<invd.invd_zone[]> {
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
			return this.http.get<invd.invd_zone[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<invd.invd_zone[]>(this.serviceURL + '/invd_zone/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.name = '';
		
	}
 
	   //Create invd_zone
    create_invd_zone(invd_zone: invd.invd_zone): Observable<Object > {
       // invd_zone.invd_zoneId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post(this.serviceURL + '/invd_zone/', invd_zone, { headers: cpHeaders })
		
    }
	
	//Fetch invd_zone by id
    get_invd_zoneById(invd_zoneId: string): Observable<invd.invd_zone> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/invd_zone/'+ invd_zoneId)
        return this.http.get<invd.invd_zone>(this.serviceURL + '/invd_zone/' + invd_zoneId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update invd_zone
    update_invd_zone(invd_zone: invd.invd_zone):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/invd_zone/' + invd_zone.invd_zoneId, invd_zone, { headers: cpHeaders })
    }
	
    //Delete invd_zone	
    delete_invd_zoneById(invd_zoneId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/invd_zone/' + invd_zoneId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:invd.invd_zone = null;
	
	public 	get Selected():invd.invd_zone{ return this.mSelecetd;}
	
	public  set Selected(_invd_zone:invd.invd_zone){ this.mSelecetd=_invd_zone; }
 
}
