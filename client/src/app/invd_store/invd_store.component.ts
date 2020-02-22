import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { invd_store_Service } from "app/invd_store.service";
import { AppService } from "app/app.service";
import { Observable, SubscriptionLike as ISubscription} from "rxjs";
import {  Validators } from "@angular/forms";

import { RemoveHTMLtagPipe } from 'app/pipes';
import { invd } from "app/invd";
import * as XLSX from 'xlsx';

const MODE_LIST = 0;
const MODE_NEW = 1;
const MODE_EDIT = 2;

@Component({
	   selector: 'app-invd_store',
    styleUrls: ['./invd_store.component.scss'],
    templateUrl: './invd_store.component.html',
})
export class invd_storeComponent implements OnInit {

    invd_storeArray: Array<invd.invd_store> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentinvd_store: invd.invd_store = {} as invd.invd_store;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';

    constructor( private invd_store_Service: invd_store_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
        this.refreshinvd_store();
    }
    refreshCombo() {
    }
    ngOnDestroy() {
    }

    refreshinvd_store() {
		   console.log("refreshing invd_store"); 
        this.invd_store_Service.getAll_invd_stores().subscribe(invd_storeArray => { this.invd_storeArray = invd_storeArray; }, error => { this.ShowError(error.message); })
        this.currentinvd_store = {} as invd.invd_store;
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshinvd_store();
		return this.invd_storeArray ;
	   }

    onSelect(item: invd.invd_store) {
        this.currentinvd_store = item;
    }

    onNew() {
    this.refreshCombo(); 
        this.currentinvd_store = {} as invd.invd_store;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
    }

    onEdit(item: invd.invd_store) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentinvd_store = item;
    }

    onDelete(item: invd.invd_store) {
        this.confirmOpened = true;
        this.currentinvd_store = item;
    }

    onConfirmDeletion() {
        this.invd_store_Service.delete_invd_storeById(this.currentinvd_store.invd_storeId).subscribe(data => {this.refreshinvd_store()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: invd.invd_store) {
        this.valid=true; 
     if(this.currentinvd_store.name == undefined || this.currentinvd_store.name=='') this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.invd_store_Service.create_invd_store(item)
                        .subscribe(data =>{ this.refreshinvd_store()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.invd_store_Service.update_invd_store( item)
                        .subscribe(data => {this.refreshinvd_store()}, error => { this.ShowError(error.message); });
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
        for(var i = 0; i < this.invd_storeArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.invd_storeArray[i].name;
        }
		/* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);

        var wscols = [
            {wch: 64}
        ];

        ws['!cols'] = wscols;

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'invd_store');
        

        wb.Props = {
            Title: "Справочник::Склад",
            Subject: "Справочник::Склад",
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
		XLSX.writeFile(wb, 'invd_store.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentinvd_store = {} as invd.invd_store;
    }
}
 
