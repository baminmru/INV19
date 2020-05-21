import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { invp_tag_Service } from "app/invp_tag.service";
import { AppService } from "app/app.service";
import { Observable, SubscriptionLike as ISubscription} from "rxjs";
import {  Validators } from "@angular/forms";

import { RemoveHTMLtagPipe } from 'app/pipes';
import { invi } from "app/invi";
import * as XLSX from 'xlsx';

const MODE_LIST = 0;
const MODE_NEW = 1;
const MODE_EDIT = 2;

@Component({
	   selector: 'app-invp_tag',
    styleUrls: ['./invp_tag.component.scss'],
    templateUrl: './invp_tag.component.html',
})
export class invp_tagComponent implements OnInit {

    invp_tagArray: Array<invi.invp_tag> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentinvp_tag: invi.invp_tag = {} as invi.invp_tag;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';
   subscription:ISubscription;

    constructor( private invp_tag_Service: invp_tag_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
		   // console.log("Subscribe invp_tag"); 
        this.subscription=this.AppService.currentinvp_data.subscribe(si =>{ this.refreshinvp_tag(); }, error => { this.ShowError(error.message); } );
        this.refreshinvp_tag();
    }
    refreshCombo() {
    }
    ngOnDestroy() {
		   // console.log("Unsubscribe invp_tag"); 
        this.subscription.unsubscribe();
    }

    refreshinvp_tag() {
		let item:invi.invp_data;
		item=this.AppService.Lastinvp_data;
		console.log("refreshing invp_tag"); 
     this.currentinvp_tag = {} as invi.invp_tag;
		if(typeof item === 'undefined') { 
		   //console.log("no parent item for refresh"); 
        this.invp_tag_Service.get_invp_tagByParent('00000000-0000-0000-0000-000000000000').subscribe(invp_tagArray => { this.invp_tagArray = invp_tagArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.invp_dataId==='undefined') { 
		   //console.log("no parent id for refresh"); 
        this.invp_tag_Service.get_invp_tagByParent('00000000-0000-0000-0000-000000000000').subscribe(invp_tagArray => { this.invp_tagArray = invp_tagArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.invp_dataId === 'string' ) {
        this.invp_tag_Service.get_invp_tagByParent(item.invp_dataId).subscribe(invp_tagArray => { this.invp_tagArray = invp_tagArray; }, error => { this.ShowError(error.message); })
      }
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshinvp_tag();
		return this.invp_tagArray ;
	   }

    onSelect(item: invi.invp_tag) {
        this.currentinvp_tag = item;
    }

    onNew() {
    this.refreshCombo(); 
      if(typeof ( this.AppService.Lastinvp_data.invp_dataId) === 'string' ) {
        this.currentinvp_tag = {} as invi.invp_tag;
        this.currentinvp_tag.invp_dataId = this.AppService.Lastinvp_data.invp_dataId;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
      }
    }

    onEdit(item: invi.invp_tag) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentinvp_tag = item;
    }

    onDelete(item: invi.invp_tag) {
        this.confirmOpened = true;
        this.currentinvp_tag = item;
    }

    onConfirmDeletion() {
        this.invp_tag_Service.delete_invp_tagById(this.currentinvp_tag.invp_tagId).subscribe(data => {this.refreshinvp_tag(); this.backToList();}, error => { this.ShowError(error.message); });
    }

    save(item: invi.invp_tag) {
        this.valid=true; 
     if(this.currentinvp_tag.rFID == undefined || this.currentinvp_tag.rFID=='') this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.invp_tag_Service.create_invp_tag(item)
                        .subscribe(data =>{ this.refreshinvp_tag();this.backToList();}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.invp_tag_Service.update_invp_tag( item)
                        .subscribe(data => {this.refreshinvp_tag();this.backToList();}, error => { this.ShowError(error.message); });
                    break;
                }
                default:
                    break;
            }
        //} else {
        //    this.ShowError("Ошибка заполнения формы");
        }
    }

 exportXSLX(): void {
        var aoa = [];
/* set column headers at first line */
        if(!aoa[0]) aoa[0] = [];
            aoa[0][0]='Метка RFID';
/* fill data to array */
        for(var i = 0; i < this.invp_tagArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.invp_tagArray[i].rFID;
        }
		/* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);

        var wscols = [
            {wch: 64}
        ];

        ws['!cols'] = wscols;

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'invp_tag');
        

        wb.Props = {
            Title: "Запчасть::Метки",
            Subject: "Запчасть::Метки",
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
		XLSX.writeFile(wb, 'invp_tag.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentinvp_tag = {} as invi.invp_tag;
    }
}
 
