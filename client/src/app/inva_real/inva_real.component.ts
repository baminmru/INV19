import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { inva_real_Service } from "app/inva_real.service";
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
	   selector: 'app-inva_real',
    styleUrls: ['./inva_real.component.scss'],
    templateUrl: './inva_real.component.html',
})
export class inva_realComponent implements OnInit {

    inva_realArray: Array<inva.inva_real> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentinva_real: inva.inva_real = {} as inva.inva_real;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';
   subscription:ISubscription;

    constructor( private inva_real_Service: inva_real_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
		   // console.log("Subscribe inva_real"); 
        this.subscription=this.AppService.currentinva_info.subscribe(si =>{ this.refreshinva_real(); }, error => { this.ShowError(error.message); } );
        this.refreshinva_real();
    }
    refreshCombo() {
     this.AppService.refreshComboinvp_data();
     this.AppService.refreshComboinvwh_loc();
     this.AppService.refreshComboinvwh_cell();
     this.AppService.refreshComboinvd_store();
    }
    ngOnDestroy() {
		   // console.log("Unsubscribe inva_real"); 
        this.subscription.unsubscribe();
    }

    refreshinva_real() {
		let item:inva.inva_info;
		item=this.AppService.Lastinva_info;
		console.log("refreshing inva_real"); 
     this.currentinva_real = {} as inva.inva_real;
		if(typeof item === 'undefined') { 
		   //console.log("no parent item for refresh"); 
        this.inva_real_Service.get_inva_realByParent('00000000-0000-0000-0000-000000000000').subscribe(inva_realArray => { this.inva_realArray = inva_realArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.inva_infoId==='undefined') { 
		   //console.log("no parent id for refresh"); 
        this.inva_real_Service.get_inva_realByParent('00000000-0000-0000-0000-000000000000').subscribe(inva_realArray => { this.inva_realArray = inva_realArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.inva_infoId === 'string' ) {
        this.inva_real_Service.get_inva_realByParent(item.inva_infoId).subscribe(inva_realArray => { this.inva_realArray = inva_realArray; }, error => { this.ShowError(error.message); })
      }
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshinva_real();
		return this.inva_realArray ;
	   }

    onSelect(item: inva.inva_real) {
        this.currentinva_real = item;
    }

    onNew() {
    this.refreshCombo(); 
      if(typeof ( this.AppService.Lastinva_info.inva_infoId) === 'string' ) {
        this.currentinva_real = {} as inva.inva_real;
        this.currentinva_real.inva_infoId = this.AppService.Lastinva_info.inva_infoId;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
      }
    }

    onEdit(item: inva.inva_real) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentinva_real = item;
    }

    onDelete(item: inva.inva_real) {
        this.confirmOpened = true;
        this.currentinva_real = item;
    }

    onConfirmDeletion() {
        this.inva_real_Service.delete_inva_realById(this.currentinva_real.inva_realId).subscribe(data => {this.refreshinva_real()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: inva.inva_real) {
        this.valid=true; 
     if(this.currentinva_real.qty == undefined  ) this.valid=false;
     if(this.currentinva_real.locationid == undefined ) this.valid=false;
     if(this.currentinva_real.theStore == undefined ) this.valid=false;
     if(this.currentinva_real.rFID == undefined || this.currentinva_real.rFID=='') this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.inva_real_Service.create_inva_real(item)
                        .subscribe(data =>{ this.refreshinva_real()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.inva_real_Service.update_inva_real( item)
                        .subscribe(data => {this.refreshinva_real()}, error => { this.ShowError(error.message); });
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
            aoa[0][4]='Склад';
            aoa[0][5]='Метка RFID';
/* fill data to array */
        for(var i = 0; i < this.inva_realArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.inva_realArray[i].storepartid_name;
            aoa[i+1][1]=this.inva_realArray[i].qty;
            aoa[i+1][2]=this.inva_realArray[i].locationid_name;
            aoa[i+1][3]=this.inva_realArray[i].cellid_name;
            aoa[i+1][4]=this.inva_realArray[i].theStore_name;
            aoa[i+1][5]=this.inva_realArray[i].rFID;
        }
		/* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);

        var wscols = [
            {wch: 50}
,            {wch: 20}
,            {wch: 50}
,            {wch: 50}
,            {wch: 50}
,            {wch: 64}
        ];

        ws['!cols'] = wscols;

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'inva_real');
        

        wb.Props = {
            Title: "Инвентраизация::Наличие",
            Subject: "Инвентраизация::Наличие",
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
		XLSX.writeFile(wb, 'inva_real.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentinva_real = {} as inva.inva_real;
    }
}
 
