import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, observable } from 'rxjs';
import { environment } from '../environments/environment';
import { enums } from './enums';
import { invm } from './invm';
import { find} from './find';
import { NodeCompatibleEventEmitter } from 'rxjs/internal/observable/fromEvent';
import { inviComponent } from './invi/invi.component';


@Injectable()
export class find_Service {
	private serviceURL: string = environment.baseAppUrl;
 
	//Create constructor to get Http instance
	constructor(private http:HttpClient) { 
	}
	
	
	thePart:string = '';
	dstart:string = '';
	dend:string = '';
	PageSize:number=10;
	PageUrl:string='';
	


	refreshData() {
		console.log("refreshing "); 
		/*
		let obs:Observable<find.ElectroRecord[]>;
		 obs=this.getCurrentElectroHH();
		 if(obs !=null){
		 		obs.subscribe(DATAArray => { this.CurrentArchiveHH = DATAArray; }, error => { console.log(error.message); })
		 }
		 
		 obs=this.getCurrentElectroM();
		 if(obs !=null){
		 		obs.subscribe(DATAArray => { this.CurrentArchiveM = DATAArray; }, error => { console.log(error.message); })
		 }
		 
		 obs=this.getCurrentElectroT();
		 if(obs !=null){
		 		obs.subscribe(DATAArray => { this.CurrentArchiveT = DATAArray; }, error => { console.log(error.message); })
		 }
		 */
		 
	}

 
		
	 

	
	clearSearch():void{
		this.thePart = '';
		this.dstart = '';
		this.dend = '';
	}
 
	
	
	private mSelecetd: invm.invm_info = null;
	
	public 	get Selected():invm.invm_info { return this.mSelecetd;}
	
	public  set Selected(_item : invm.invm_info) { this.mSelecetd = _item; }
 
}
