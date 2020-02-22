import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { invops_in_Service } from "app/invops_in.service";
import { AppService } from "app/app.service";
import { Observable, SubscriptionLike as ISubscription} from "rxjs";
import {  Validators } from "@angular/forms";

import { RemoveHTMLtagPipe } from 'app/pipes';
import { invops } from "app/invops";
import * as XLSX from 'xlsx';
import { stringify } from "querystring";

const MODE_LIST = 0;
const MODE_NEW = 1;
const MODE_EDIT = 2;

@Component({
	   selector: 'app-invops_in',
    styleUrls: ['./invops_in.component.scss'],
    templateUrl: './invops_in.component.html',
})
export class invops_inComponent implements OnInit {

    invops_inArray: Array<invops.invops_in> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_NEW ;
    currentinvops_in: invops.invops_in = {} as invops.invops_in;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';

    constructor( private invops_in_Service: invops_in_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
        this.onNew();
    }
    refreshCombo() {
    }
    ngOnDestroy() {
    }

 

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }


    onNew() {
        this.refreshCombo(); 
        this.currentinvops_in = {} as invops.invops_in;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = ' ';
    }

    
    save(item: invops.invops_in) {
        this.valid=true; 
        if(this.currentinvops_in.shCode == undefined || this.currentinvops_in.shCode=='') this.valid=false;
        if(this.currentinvops_in.rfid == undefined || this.currentinvops_in.rfid=='') this.valid=false;
        if(this.currentinvops_in.quantity == undefined  ) this.valid=false;
        if (this.valid) {
            this.invops_in_Service.create_invops_in(item)
                .subscribe(data =>{ this.onNew()}, error => { 
                    var msg:string =(error.error==undefined || error.error==''  ? error.message:error.error);
                    this.ShowError(msg); 
                });
        }
    }

 
}
 
