import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { invops_move_Service } from "app/invops_move.service";
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
	   selector: 'app-invops_move',
    styleUrls: ['./invops_move.component.scss'],
    templateUrl: './invops_move.component.html',
})
export class invops_moveComponent implements OnInit {

    invops_moveArray: Array<invops.invops_move> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_NEW;
    currentinvops_move: invops.invops_move = {} as invops.invops_move;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';

    constructor( private invops_move_Service: invops_move_Service,  public AppService:AppService ) {
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
        this.currentinvops_move = {} as invops.invops_move;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = '';
    }

    

    save(item: invops.invops_move) {
        this.valid=true; 
     if(this.currentinvops_move.shCodeFrom == undefined || this.currentinvops_move.shCodeFrom=='') this.valid=false;
     if(this.currentinvops_move.shCodeTo == undefined || this.currentinvops_move.shCodeTo=='') this.valid=false;
     if(this.currentinvops_move.rfid == undefined || this.currentinvops_move.rfid=='') this.valid=false;
     if(this.currentinvops_move.quantity == undefined  ) this.valid=false;
        if (this.valid) {
                    this.invops_move_Service.create_invops_move(item)
                        .subscribe(data =>{ this.onNew()}, error => { 
                            var msg:string =(error.error==undefined || error.error==''  ? error.message:error.error);
                            this.ShowError(msg); 
                        });
        }
    }

 
}
 
