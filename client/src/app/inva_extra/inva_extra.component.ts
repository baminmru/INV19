import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { inva_extra_Service } from "app/inva_extra.service";
import { AppService } from "app/app.service";
import { Observable, SubscriptionLike as ISubscription} from "rxjs";
import {  Validators } from "@angular/forms";

import { RemoveHTMLtagPipe } from 'app/pipes';
import { inva } from "app/inva";
import * as XLSX from 'xlsx';

const MODE_LIST = 0;
const MODE_NEW = 1;
const MODE_EDIT = 2;

@Component({
	   selector: 'app-inva_extra',
    styleUrls: ['./inva_extra.component.scss'],
    templateUrl: './inva_extra.component.html',
})
export class inva_extraComponent implements OnInit {

    inva_extraArray: Array<inva.inva_extra> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentinva_extra: inva.inva_extra = {} as inva.inva_extra;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';
   subscription:ISubscription;

    constructor( private inva_extra_Service: inva_extra_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
		   // console.log("Subscribe inva_extra"); 
        this.subscription=this.AppService.currentinva_info.subscribe(si =>{ this.refreshinva_extra(); }, error => { this.ShowError(error.message); } );
        this.refreshinva_extra();
    }
    refreshCombo() {
     this.AppService.refreshComboinvp_data();
     this.AppService.refreshComboinvwh_loc();
     this.AppService.refreshComboinvwh_cell();
    }
    ngOnDestroy() {
		   // console.log("Unsubscribe inva_extra"); 
        this.subscription.unsubscribe();
    }

    refreshinva_extra() {
		let item:inva.inva_info;
		item=this.AppService.Lastinva_info;
		console.log("refreshing inva_extra"); 
     this.currentinva_extra = {} as inva.inva_extra;
		if(typeof item === 'undefined') { 
		   //console.log("no parent item for refresh"); 
        this.inva_extra_Service.get_inva_extraByParent('00000000-0000-0000-0000-000000000000').subscribe(inva_extraArray => { this.inva_extraArray = inva_extraArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.inva_infoId==='undefined') { 
		   //console.log("no parent id for refresh"); 
        this.inva_extra_Service.get_inva_extraByParent('00000000-0000-0000-0000-000000000000').subscribe(inva_extraArray => { this.inva_extraArray = inva_extraArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.inva_infoId === 'string' ) {
        this.inva_extra_Service.get_inva_extraByParent(item.inva_infoId).subscribe(inva_extraArray => { this.inva_extraArray = inva_extraArray; }, error => { this.ShowError(error.message); })
      }
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshinva_extra();
		return this.inva_extraArray ;
	   }

    onSelect(item: inva.inva_extra) {
        this.currentinva_extra = item;
    }

    onNew() {
    this.refreshCombo(); 
      if(typeof ( this.AppService.Lastinva_info.inva_infoId) === 'string' ) {
        this.currentinva_extra = {} as inva.inva_extra;
        this.currentinva_extra.inva_infoId = this.AppService.Lastinva_info.inva_infoId;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
      }
    }

    onEdit(item: inva.inva_extra) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentinva_extra = item;
    }

    onDelete(item: inva.inva_extra) {
        this.confirmOpened = true;
        this.currentinva_extra = item;
    }

    onConfirmDeletion() {
        this.inva_extra_Service.delete_inva_extraById(this.currentinva_extra.inva_extraId).subscribe(data => {this.refreshinva_extra()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: inva.inva_extra) {
        this.valid=true; 
     if(this.currentinva_extra.qty == undefined  ) this.valid=false;
     if(this.currentinva_extra.locationid == undefined ) this.valid=false;
     //if(this.currentinva_extra.RFID == undefined || this.currentinva_extra.RFID=='') this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.inva_extra_Service.create_inva_extra(item)
                        .subscribe(data =>{ this.refreshinva_extra()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.inva_extra_Service.update_inva_extra( item)
                        .subscribe(data => {this.refreshinva_extra()}, error => { this.ShowError(error.message); });
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
            aoa[0][0]='Запчасть';
            aoa[0][1]='Количество';
            aoa[0][2]='Стеллаж';
            aoa[0][3]='Ячейка';
            aoa[0][4]='Метка RFID';
/* fill data to array */
        for(var i = 0; i < this.inva_extraArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.inva_extraArray[i].storepartid_name;
            aoa[i+1][1]=this.inva_extraArray[i].qty;
            aoa[i+1][2]=this.inva_extraArray[i].locationid_name;
            aoa[i+1][3]=this.inva_extraArray[i].cellid_name;
            aoa[i+1][4]=this.inva_extraArray[i].rFID;
        }
		/* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);

        var wscols = [
            {wch: 50}
,            {wch: 20}
,            {wch: 50}
,            {wch: 50}
,            {wch: 64}
        ];

        ws['!cols'] = wscols;

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'inva_extra');
        

        wb.Props = {
            Title: "Инвентраизация::Излишки",
            Subject: "Инвентраизация::Излишки",
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
		XLSX.writeFile(wb, 'inva_extra.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentinva_extra = {} as inva.inva_extra;
    }
}
 
