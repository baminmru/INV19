import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { inva_info_Service } from "app/inva_info.service";
import { AppService } from "app/app.service";
import { Observable, SubscriptionLike as ISubscription} from "rxjs";
import {  Validators } from "@angular/forms";

import { RemoveHTMLtagPipe } from 'app/pipes';
import { inva } from "app/inva";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const MODE_LIST = 0;
const MODE_NEW = 1;
const MODE_EDIT = 2;

@Component({
	   selector: 'app-inva_info',
    styleUrls: ['./inva_info.component.scss'],
    templateUrl: './inva_info.component.html',
})
export class inva_infoComponent implements OnInit {

    inva_infoArray: Array<inva.inva_info> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentinva_info: inva.inva_info = {} as inva.inva_info;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';

    constructor( private inva_info_Service: inva_info_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
        this.refreshinva_info();
    }
    refreshCombo() {
    }
    ngOnDestroy() {
    }

    refreshinva_info() {
		   console.log("refreshing inva_info"); 
        this.inva_info_Service.getAll_inva_infos().subscribe(inva_infoArray => { this.inva_infoArray = inva_infoArray; }, error => { this.ShowError(error.message); })
        this.currentinva_info = {} as inva.inva_info;
        console.log("clear selection for inva_info on refresh");
        this.AppService.pushSelectedinva_info(this.currentinva_info);
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshinva_info();
		return this.inva_infoArray ;
	   }

    onSelect(item: inva.inva_info) {
        this.currentinva_info = item;
        this.AppService.pushSelectedinva_info(item);
    }

    onNew() {
    this.refreshCombo(); 
        this.currentinva_info = {} as inva.inva_info;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
    }

    onEdit(item: inva.inva_info) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentinva_info = item;
    }

    onDelete(item: inva.inva_info) {
        this.confirmOpened = true;
        this.currentinva_info = item;
    }

    onReport() {
        this.inva_info_Service.report(this.currentinva_info.inva_infoId).subscribe((res) => {this.downLoad(res.body);});
    }

    downLoad(data: any) {
        //saveAs(new Blob([data], { type: 'application/vnd.ms-excel' }), 'inventory.xlsx');
        saveAs(data, 'inventory.xlsx');
      }

    onConfirmDeletion() {
        this.inva_info_Service.delete_inva_infoById(this.currentinva_info.inva_infoId).subscribe(data => {this.refreshinva_info(); this.backToList();}, error => { this.ShowError(error.message); });
    }

    save(item: inva.inva_info) {
        this.valid=true; 
     if(this.currentinva_info.invDate == undefined ) this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.inva_info_Service.create_inva_info(item)
                        .subscribe(data =>{ this.refreshinva_info();this.backToList();}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.inva_info_Service.update_inva_info( item)
                        .subscribe(data => {this.refreshinva_info();this.backToList();}, error => { this.ShowError(error.message); });
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
            aoa[0][0]='Дата инвентаризации';
            aoa[0][1]='Причина инвентаризации';
            aoa[0][2]='Инвентаризация завершена';
/* fill data to array */
        for(var i = 0; i < this.inva_infoArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.inva_infoArray[i].invDate;
            aoa[i+1][1]=this.inva_infoArray[i].invReason;
            aoa[i+1][2]=this.inva_infoArray[i].isFinished_name;
        }
		/* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);

        var wscols = [
            {wch: 18}
,            {wch: 80}
,            {wch: 30}
        ];

        ws['!cols'] = wscols;

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'inva_info');
        

        wb.Props = {
            Title: "Инвентаризация::Описание",
            Subject: "Инвентаризация::Описание",
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
		XLSX.writeFile(wb, 'inva_info.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentinva_info = {} as inva.inva_info;
        console.log("clear selection for inva_info");
        this.AppService.pushSelectedinva_info(this.currentinva_info);
    }
}
 
