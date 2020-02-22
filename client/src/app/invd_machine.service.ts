import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { invd} from './invd';
@Injectable()
export class invd_machine_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	name:string = '';
	PageSize:number=10;
	PageUrl:string='';
    
	//Fetch all invd_machines
    getAll_invd_machines(): Observable<invd.invd_machine[]> {
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
			return this.http.get<invd.invd_machine[]>(this.PageUrl, { headers: cpHeaders })
		}else{
			if(qry !='')
				qry='?' +qry;
			return this.http.get<invd.invd_machine[]>(this.serviceURL + '/invd_machine/view/'+qry, { headers: cpHeaders })
        }
    }
	
	clearSearch():void{
	this.name = '';
		
	}
 
	   //Create invd_machine
    create_invd_machine(invd_machine: invd.invd_machine): Observable<invd.invd_machine > {
       // invd_machine.invd_machineId = '';
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.post<invd.invd_machine >(this.serviceURL + '/invd_machine/', invd_machine, { headers: cpHeaders })
		
    }
	
	//Fetch invd_machine by id
    get_invd_machineById(invd_machineId: string): Observable<invd.invd_machine> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
		console.log(this.serviceURL +'/invd_machine/'+ invd_machineId)
        return this.http.get<invd.invd_machine>(this.serviceURL + '/invd_machine/' + invd_machineId, { headers: cpHeaders })//.catch(err => { console.log(err) return Observable.of(err) })
    }	
	
	   //Update invd_machine
    update_invd_machine(invd_machine: invd.invd_machine):Observable<Object > {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.put(this.serviceURL + '/invd_machine/' + invd_machine.invd_machineId, invd_machine, { headers: cpHeaders })
    }
	
    //Delete invd_machine	
    delete_invd_machineById(invd_machineId: string): Observable<Object> {
        let cpHeaders = new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem('auth_token') });
        return this.http.delete(this.serviceURL + '/invd_machine/' + invd_machineId, { headers: cpHeaders })
            
			
    }	
	
	private mSelecetd:invd.invd_machine = null;
	
	public 	get Selected():invd.invd_machine{ return this.mSelecetd;}
	
	public  set Selected(_invd_machine:invd.invd_machine){ this.mSelecetd=_invd_machine; }
 
}
