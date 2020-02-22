import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { invops_out_Service } from "app/invops_out.service";
import { AppService } from "app/app.service";
import { Observable, SubscriptionLike as ISubscription} from "rxjs";
import {  Validators } from "@angular/forms";

import { RemoveHTMLtagPipe } from 'app/pipes';
import { invops } from "app/invops";
import * as XLSX from 'xlsx';

const MODE_LIST = 0;
const MODE_NEW = 1;
const MODE_EDIT = 2;

@Component({
	   selector: 'app-invops_out',
    styleUrls: ['./invops_out.component.scss'],
    templateUrl: './invops_out.component.html',
})
export class invops_outComponent implements OnInit {

    invops_outArray: Array<invops.invops_out> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_NEW;
    currentinvops_out: invops.invops_out = {} as invops.invops_out;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';

    constructor( private invops_out_Service: invops_out_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
        this. refreshCombo();
        this.onNew();
    }
    refreshCombo() {
     this.AppService.refreshComboinvd_dep();
    }
    ngOnDestroy() {
    }

    

    ShowError(message:string){
    this.errorMessage=message; ;
    this.errorFlag=true;
    }

	  

    onNew() {
    this.refreshCombo(); 
        this.currentinvops_out = {} as invops.invops_out;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = '';
    }

  

    save(item: invops.invops_out) {
        this.valid=true; 
     if(this.currentinvops_out.shCode == undefined || this.currentinvops_out.shCode=='') this.valid=false;
     if(this.currentinvops_out.rfid == undefined || this.currentinvops_out.rfid=='') this.valid=false;
     if(this.currentinvops_out.quantity == undefined  ) this.valid=false;
     if(this.currentinvops_out.theDept == undefined ) this.valid=false;
        if (this.valid) {
          
                    this.invops_out_Service.create_invops_out(item)
                        .subscribe(data =>{ this.onNew()}, error => { 
                            var msg:string =(error.error==undefined || error.error==''  ? error.message:error.error);
                            this.ShowError(msg); 
                        });
          
          
        }
    }

 
}
 
