import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { invp_data_Service } from "app/invp_data.service";
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
	   selector: 'app-invp_data',
    styleUrls: ['./invp_data.component.scss'],
    templateUrl: './invp_data.component.html',
})
export class invp_dataComponent implements OnInit {

    invp_dataArray: Array<invi.invp_data> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentinvp_data: invi.invp_data = {} as invi.invp_data;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';

    constructor( private invp_data_Service: invp_data_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
        this.refreshinvp_data();
    }
    refreshCombo() {
     this.AppService.refreshComboinvg_grp();
     this.AppService.refreshComboinvg_subgrp();
     this.AppService.refreshComboinvd_dep();
     this.AppService.refreshComboinvd_machine();
    }
    ngOnDestroy() {
    }

    refreshinvp_data() {
		   console.log("refreshing invp_data"); 
        this.invp_data_Service.getAll_invp_datas().subscribe(invp_dataArray => { this.invp_dataArray = invp_dataArray; }, error => { this.ShowError(error.message); })
        this.currentinvp_data = {} as invi.invp_data;
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshinvp_data();
		return this.invp_dataArray ;
	   }

    onSelect(item: invi.invp_data) {
        this.currentinvp_data = item;
    }

    onNew() {
    this.refreshCombo(); 
        this.currentinvp_data = {} as invi.invp_data;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
    }

    onEdit(item: invi.invp_data) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentinvp_data = item;
    }

    onDelete(item: invi.invp_data) {
        this.confirmOpened = true;
        this.currentinvp_data = item;
    }

    onConfirmDeletion() {
        this.invp_data_Service.delete_invp_dataById(this.currentinvp_data.invp_dataId).subscribe(data => {this.refreshinvp_data()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: invi.invp_data) {
        this.valid=true; 
     if(this.currentinvp_data.name == undefined || this.currentinvp_data.name=='') this.valid=false;
     if(this.currentinvp_data.RFID == undefined || this.currentinvp_data.RFID=='') this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.invp_data_Service.create_invp_data(item)
                        .subscribe(data =>{ this.refreshinvp_data()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.invp_data_Service.update_invp_data( item)
                        .subscribe(data => {this.refreshinvp_data()}, error => { this.ShowError(error.message); });
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
            aoa[0][1]='Метка RFID';
            aoa[0][2]='Группа';
            aoa[0][3]='Подгруппа';
            aoa[0][4]='Отдел';
            aoa[0][5]='Машина';
/* fill data to array */
        for(var i = 0; i < this.invp_dataArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.invp_dataArray[i].name;
            aoa[i+1][1]=this.invp_dataArray[i].RFID;
            aoa[i+1][2]=this.invp_dataArray[i].groupid_name;
            aoa[i+1][3]=this.invp_dataArray[i].subgroupid_name;
            aoa[i+1][4]=this.invp_dataArray[i].departmentid_name;
            aoa[i+1][5]=this.invp_dataArray[i].machineid_name;
        }
		/* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);

        var wscols = [
            {wch: 64}
,            {wch: 64}
,            {wch: 50}
,            {wch: 50}
,            {wch: 50}
,            {wch: 50}
        ];

        ws['!cols'] = wscols;

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'invp_data');
        

        wb.Props = {
            Title: "Запчасть::Описание",
            Subject: "Запчасть::Описание",
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
		XLSX.writeFile(wb, 'invp_data.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentinvp_data = {} as invi.invp_data;
    }
}
 
