import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { invg_subgrp_Service } from "app/invg_subgrp.service";
import { AppService } from "app/app.service";
import { Observable, SubscriptionLike as ISubscription} from "rxjs";
import {  Validators } from "@angular/forms";

import { RemoveHTMLtagPipe } from 'app/pipes';
import { invg } from "app/invg";
import * as XLSX from 'xlsx';

const MODE_LIST = 0;
const MODE_NEW = 1;
const MODE_EDIT = 2;

@Component({
	   selector: 'app-invg_subgrp',
    styleUrls: ['./invg_subgrp.component.scss'],
    templateUrl: './invg_subgrp.component.html',
})
export class invg_subgrpComponent implements OnInit {

    invg_subgrpArray: Array<invg.invg_subgrp> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentinvg_subgrp: invg.invg_subgrp = {} as invg.invg_subgrp;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';
   subscription:ISubscription;

    constructor( private invg_subgrp_Service: invg_subgrp_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
		   // console.log("Subscribe invg_subgrp"); 
        this.subscription=this.AppService.currentinvg_grp.subscribe(si =>{ this.refreshinvg_subgrp(); }, error => { this.ShowError(error.message); } );
        this.refreshinvg_subgrp();
    }
    refreshCombo() {
    }
    ngOnDestroy() {
		   // console.log("Unsubscribe invg_subgrp"); 
        this.subscription.unsubscribe();
    }

    refreshinvg_subgrp() {
		let item:invg.invg_grp;
		item=this.AppService.Lastinvg_grp;
		console.log("refreshing invg_subgrp"); 
     this.currentinvg_subgrp = {} as invg.invg_subgrp;
		if(typeof item === 'undefined') { 
		   //console.log("no parent item for refresh"); 
        this.invg_subgrp_Service.get_invg_subgrpByParent('00000000-0000-0000-0000-000000000000').subscribe(invg_subgrpArray => { this.invg_subgrpArray = invg_subgrpArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.invg_grpId==='undefined') { 
		   //console.log("no parent id for refresh"); 
        this.invg_subgrp_Service.get_invg_subgrpByParent('00000000-0000-0000-0000-000000000000').subscribe(invg_subgrpArray => { this.invg_subgrpArray = invg_subgrpArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.invg_grpId === 'string' ) {
        this.invg_subgrp_Service.get_invg_subgrpByParent(item.invg_grpId).subscribe(invg_subgrpArray => { this.invg_subgrpArray = invg_subgrpArray; }, error => { this.ShowError(error.message); })
      }
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshinvg_subgrp();
		return this.invg_subgrpArray ;
	   }

    onSelect(item: invg.invg_subgrp) {
        this.currentinvg_subgrp = item;
    }

    onNew() {
    this.refreshCombo(); 
      if(typeof ( this.AppService.Lastinvg_grp.invg_grpId) === 'string' ) {
        this.currentinvg_subgrp = {} as invg.invg_subgrp;
        this.currentinvg_subgrp.invg_grpId = this.AppService.Lastinvg_grp.invg_grpId;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
      }
    }

    onEdit(item: invg.invg_subgrp) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentinvg_subgrp = item;
    }

    onDelete(item: invg.invg_subgrp) {
        this.confirmOpened = true;
        this.currentinvg_subgrp = item;
    }

    onConfirmDeletion() {
        this.invg_subgrp_Service.delete_invg_subgrpById(this.currentinvg_subgrp.invg_subgrpId).subscribe(data => {this.refreshinvg_subgrp()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: invg.invg_subgrp) {
        this.valid=true; 
     if(this.currentinvg_subgrp.name == undefined || this.currentinvg_subgrp.name=='') this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.invg_subgrp_Service.create_invg_subgrp(item)
                        .subscribe(data =>{ this.refreshinvg_subgrp()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.invg_subgrp_Service.update_invg_subgrp( item)
                        .subscribe(data => {this.refreshinvg_subgrp()}, error => { this.ShowError(error.message); });
                    break;
                }
                default:
                    break;
            }
            this.backToList();
        //} else {
        //    this.ShowError("Ошибка заполнения формы");
        }
    }

 exportXSLX(): void {
        var aoa = [];
/* set column headers at first line */
        if(!aoa[0]) aoa[0] = [];
            aoa[0][0]='Название';
/* fill data to array */
        for(var i = 0; i < this.invg_subgrpArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.invg_subgrpArray[i].name;
        }
		/* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);

        var wscols = [
            {wch: 64}
        ];

        ws['!cols'] = wscols;

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'invg_subgrp');
        

        wb.Props = {
            Title: "Группы::Подгруппа",
            Subject: "Группы::Подгруппа",
            Company: "master.bami",
            Category: "Experimentation",
            Keywords: "Export service",
            Author: "master.bami",
	           Manager: "master.bami",
	           Comments: "Raw data export",
	           LastAuthor: "master.bami",
            CreatedDate: new Date(Date.now())
        }

		/* save to file */
		XLSX.writeFile(wb, 'invg_subgrp.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentinvg_subgrp = {} as invg.invg_subgrp;
    }
}
 
