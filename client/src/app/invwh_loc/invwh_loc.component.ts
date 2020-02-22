import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { invwh_loc_Service } from "app/invwh_loc.service";
import { AppService } from "app/app.service";
import { Observable, SubscriptionLike as ISubscription} from "rxjs";
import {  Validators } from "@angular/forms";

import { RemoveHTMLtagPipe } from 'app/pipes';
import { invwh } from "app/invwh";
import * as XLSX from 'xlsx';

const MODE_LIST = 0;
const MODE_NEW = 1;
const MODE_EDIT = 2;

@Component({
	   selector: 'app-invwh_loc',
    styleUrls: ['./invwh_loc.component.scss'],
    templateUrl: './invwh_loc.component.html',
})
export class invwh_locComponent implements OnInit {

    invwh_locArray: Array<invwh.invwh_loc> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentinvwh_loc: invwh.invwh_loc = {} as invwh.invwh_loc;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';

    constructor( private invwh_loc_Service: invwh_loc_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
        this.refreshinvwh_loc();
    }
    refreshCombo() {
     this.AppService.refreshComboinvd_store();
     this.AppService.refreshComboinvd_zone();
    }
    ngOnDestroy() {
    }

    refreshinvwh_loc() {
		   console.log("refreshing invwh_loc"); 
        this.invwh_loc_Service.getAll_invwh_locs().subscribe(invwh_locArray => { this.invwh_locArray = invwh_locArray; }, error => { this.ShowError(error.message); })
        this.currentinvwh_loc = {} as invwh.invwh_loc;
        console.log("clear selection for invwh_loc on refresh");
        this.AppService.pushSelectedinvwh_loc(this.currentinvwh_loc);
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshinvwh_loc();
		return this.invwh_locArray ;
	   }

    onSelect(item: invwh.invwh_loc) {
        this.currentinvwh_loc = item;
        this.AppService.pushSelectedinvwh_loc(item);
    }

    onNew() {
    this.refreshCombo(); 
        this.currentinvwh_loc = {} as invwh.invwh_loc;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
    }

    onEdit(item: invwh.invwh_loc) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentinvwh_loc = item;
    }

    onDelete(item: invwh.invwh_loc) {
        this.confirmOpened = true;
        this.currentinvwh_loc = item;
    }

    onConfirmDeletion() {
        this.invwh_loc_Service.delete_invwh_locById(this.currentinvwh_loc.invwh_locId).subscribe(data => {this.refreshinvwh_loc()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: invwh.invwh_loc) {
        this.valid=true; 
     if(this.currentinvwh_loc.theStore == undefined ) this.valid=false;
     if(this.currentinvwh_loc.name == undefined || this.currentinvwh_loc.name=='') this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.invwh_loc_Service.create_invwh_loc(item)
                        .subscribe(data =>{ this.refreshinvwh_loc()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.invwh_loc_Service.update_invwh_loc( item)
                        .subscribe(data => {this.refreshinvwh_loc()}, error => { this.ShowError(error.message); });
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
            aoa[0][0]='Склад';
            aoa[0][1]='Название';
            aoa[0][2]='Зона';
/* fill data to array */
        for(var i = 0; i < this.invwh_locArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.invwh_locArray[i].theStore_name;
            aoa[i+1][1]=this.invwh_locArray[i].name;
            aoa[i+1][2]=this.invwh_locArray[i].whZone_name;
        }
		/* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);

        var wscols = [
            {wch: 50}
,            {wch: 64}
,            {wch: 50}
        ];

        ws['!cols'] = wscols;

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'invwh_loc');
        

        wb.Props = {
            Title: "Структура склада::Стеллаж",
            Subject: "Структура склада::Стеллаж",
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
		XLSX.writeFile(wb, 'invwh_loc.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentinvwh_loc = {} as invwh.invwh_loc;
        console.log("clear selection for invwh_loc");
        this.AppService.pushSelectedinvwh_loc(this.currentinvwh_loc);
    }
}
 
