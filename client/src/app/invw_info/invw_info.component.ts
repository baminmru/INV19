﻿import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { invw_info_Service } from "app/invw_info.service";
import { AppService } from "app/app.service";
import { Observable, SubscriptionLike as ISubscription} from "rxjs";
import {  Validators } from "@angular/forms";

import { RemoveHTMLtagPipe } from 'app/pipes';
import { invw } from "app/invw";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const MODE_LIST = 0;
const MODE_NEW = 1;
const MODE_EDIT = 2;

@Component({
	   selector: 'app-invw_info',
    styleUrls: ['./invw_info.component.scss'],
    templateUrl: './invw_info.component.html',
})
export class invw_infoComponent implements OnInit {

    invw_infoArray: Array<invw.invw_info> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentinvw_info: invw.invw_info = {} as invw.invw_info;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';

    constructor( private invw_info_Service: invw_info_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
        this.refreshinvw_info();
    }
    refreshCombo() {
     this.AppService.refreshComboinvd_store();
     this.AppService.refreshComboinvwh_loc();
     this.AppService.refreshComboinvwh_cell();
     this.AppService.refreshComboinvp_data();
    }
    ngOnDestroy() {
    }

    refreshinvw_info() {
		   console.log("refreshing invw_info"); 
        this.invw_info_Service.getAll_invw_infos().subscribe(invw_infoArray => { this.invw_infoArray = invw_infoArray; }, error => { this.ShowError(error.message); })
        this.currentinvw_info = {} as invw.invw_info;
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshinvw_info();
		return this.invw_infoArray ;
	   }

    onSelect(item: invw.invw_info) {
        this.currentinvw_info = item;
    }

    onNew() {
    this.refreshCombo(); 
        this.currentinvw_info = {} as invw.invw_info;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
    }

    onEdit(item: invw.invw_info) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentinvw_info = item;
    }

    onDelete(item: invw.invw_info) {
        this.confirmOpened = true;
        this.currentinvw_info = item;
    }

    onReport() {
        this.invw_info_Service.report().subscribe((res) => {this.downLoad(res.body);});
    }

    downLoad(data: any) {
        //saveAs(new Blob([data], { type: 'application/vnd.ms-excel' }), 'inventory.xlsx');
        saveAs(data, 'losttags.xlsx');
      }

    onConfirmDeletion() {
        this.invw_info_Service.delete_invw_infoById(this.currentinvw_info.invw_infoId).subscribe(data => {this.refreshinvw_info(); this.backToList();}, error => { this.ShowError(error.message); });
    }

    save(item: invw.invw_info) {
        this.valid=true; 
     if(this.currentinvw_info.theStore == undefined ) this.valid=false;
     if(this.currentinvw_info.locationid == undefined ) this.valid=false;
     if(this.currentinvw_info.qty == undefined  ) this.valid=false;
     if(this.currentinvw_info.rFID == undefined || this.currentinvw_info.rFID=='') this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.invw_info_Service.create_invw_info(item)
                        .subscribe(data =>{ this.refreshinvw_info();this.backToList();}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.invw_info_Service.update_invw_info( item)
                        .subscribe(data => {this.refreshinvw_info();this.backToList();}, error => { this.ShowError(error.message); });
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
            aoa[0][0]='Склад';
            aoa[0][1]='Стеллаж';
            aoa[0][2]='Ячейка';
            aoa[0][3]='Запчасть';
            aoa[0][4]='Количество';
            aoa[0][5]='Метка RFID';
/* fill data to array */
        for(var i = 0; i < this.invw_infoArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.invw_infoArray[i].theStore_name;
            aoa[i+1][1]=this.invw_infoArray[i].locationid_name;
            aoa[i+1][2]=this.invw_infoArray[i].cellid_name;
            aoa[i+1][3]=this.invw_infoArray[i].storepartid_name;
            aoa[i+1][4]=this.invw_infoArray[i].qty;
            aoa[i+1][5]=this.invw_infoArray[i].rFID;
        }
		/* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);

        var wscols = [
            {wch: 50}
,            {wch: 50}
,            {wch: 50}
,            {wch: 50}
,            {wch: 20}
,            {wch: 64}
        ];

        ws['!cols'] = wscols;

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'invw_info');
        

        wb.Props = {
            Title: "Наличие::Наличие",
            Subject: "Наличие::Наличие",
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
		XLSX.writeFile(wb, 'invw_info.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentinvw_info = {} as invw.invw_info;
    }
}
 
