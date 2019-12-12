import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { invm_info_Service } from "app/invm_info.service";
import { AppService } from "app/app.service";
import { Observable, SubscriptionLike as ISubscription} from "rxjs";
import {  Validators } from "@angular/forms";

import { RemoveHTMLtagPipe } from 'app/pipes';
import { invm } from "app/invm";
import * as XLSX from 'xlsx';

const MODE_LIST = 0;
const MODE_NEW = 1;
const MODE_EDIT = 2;

@Component({
	   selector: 'app-invm_info',
    styleUrls: ['./invm_info.component.scss'],
    templateUrl: './invm_info.component.html',
})
export class invm_infoComponent implements OnInit {

    invm_infoArray: Array<invm.invm_info> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentinvm_info: invm.invm_info = {} as invm.invm_info;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';

    constructor( private invm_info_Service: invm_info_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
        this.refreshinvm_info();
    }
    refreshCombo() {
     this.AppService.refreshComboinvwh_cell();
     this.AppService.refreshComboinvwh_cell();
     this.AppService.refreshComboinvp_data();
    }
    ngOnDestroy() {
    }

    refreshinvm_info() {
		   console.log("refreshing invm_info"); 
        this.invm_info_Service.getAll_invm_infos().subscribe(invm_infoArray => { this.invm_infoArray = invm_infoArray; }, error => { this.ShowError(error.message); })
        this.currentinvm_info = {} as invm.invm_info;
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshinvm_info();
		return this.invm_infoArray ;
	   }

    onSelect(item: invm.invm_info) {
        this.currentinvm_info = item;
    }

    onNew() {
    this.refreshCombo(); 
        this.currentinvm_info = {} as invm.invm_info;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
    }

    onEdit(item: invm.invm_info) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentinvm_info = item;
    }

    onDelete(item: invm.invm_info) {
        this.confirmOpened = true;
        this.currentinvm_info = item;
    }

    onConfirmDeletion() {
        this.invm_info_Service.delete_invm_infoById(this.currentinvm_info.invm_infoId).subscribe(data => {this.refreshinvm_info()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: invm.invm_info) {
        this.valid=true; 
     if(this.currentinvm_info.fromcell == undefined ) this.valid=false;
     if(this.currentinvm_info.toCell == undefined ) this.valid=false;
     if(this.currentinvm_info.Qty == undefined  ) this.valid=false;
     if(this.currentinvm_info.optime == undefined ) this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.invm_info_Service.create_invm_info(item)
                        .subscribe(data =>{ this.refreshinvm_info()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.invm_info_Service.update_invm_info( item)
                        .subscribe(data => {this.refreshinvm_info()}, error => { this.ShowError(error.message); });
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
            aoa[0][0]='Из ячейки';
            aoa[0][1]='В ячейку';
            aoa[0][2]='Запчасть';
            aoa[0][3]='Количество';
            aoa[0][4]='Время операции';
/* fill data to array */
        for(var i = 0; i < this.invm_infoArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.invm_infoArray[i].fromcell_name;
            aoa[i+1][1]=this.invm_infoArray[i].toCell_name;
            aoa[i+1][2]=this.invm_infoArray[i].storepartid_name;
            aoa[i+1][3]=this.invm_infoArray[i].Qty;
            aoa[i+1][4]=this.invm_infoArray[i].optime;
        }
		/* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);

        var wscols = [
            {wch: 50}
,            {wch: 50}
,            {wch: 50}
,            {wch: 20}
,            {wch: 18}
        ];

        ws['!cols'] = wscols;

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'invm_info');
        

        wb.Props = {
            Title: "Движение::Движение",
            Subject: "Движение::Движение",
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
		XLSX.writeFile(wb, 'invm_info.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentinvm_info = {} as invm.invm_info;
    }
}
 
