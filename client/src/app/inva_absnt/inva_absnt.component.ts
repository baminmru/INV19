import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { inva_absnt_Service } from "app/inva_absnt.service";
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
	   selector: 'app-inva_absnt',
    styleUrls: ['./inva_absnt.component.scss'],
    templateUrl: './inva_absnt.component.html',
})
export class inva_absntComponent implements OnInit {

    inva_absntArray: Array<inva.inva_absnt> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentinva_absnt: inva.inva_absnt = {} as inva.inva_absnt;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';
   subscription:ISubscription;

    constructor( private inva_absnt_Service: inva_absnt_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
		   // console.log("Subscribe inva_absnt"); 
        this.subscription=this.AppService.currentinva_info.subscribe(si =>{ this.refreshinva_absnt(); }, error => { this.ShowError(error.message); } );
        this.refreshinva_absnt();
    }
    refreshCombo() {
     this.AppService.refreshComboinvp_data();
    }
    ngOnDestroy() {
		   // console.log("Unsubscribe inva_absnt"); 
        this.subscription.unsubscribe();
    }

    refreshinva_absnt() {
		let item:inva.inva_info;
		item=this.AppService.Lastinva_info;
		console.log("refreshing inva_absnt"); 
     this.currentinva_absnt = {} as inva.inva_absnt;
		if(typeof item === 'undefined') { 
		   //console.log("no parent item for refresh"); 
        this.inva_absnt_Service.get_inva_absntByParent('00000000-0000-0000-0000-000000000000').subscribe(inva_absntArray => { this.inva_absntArray = inva_absntArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.inva_infoId==='undefined') { 
		   //console.log("no parent id for refresh"); 
        this.inva_absnt_Service.get_inva_absntByParent('00000000-0000-0000-0000-000000000000').subscribe(inva_absntArray => { this.inva_absntArray = inva_absntArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.inva_infoId === 'string' ) {
        this.inva_absnt_Service.get_inva_absntByParent(item.inva_infoId).subscribe(inva_absntArray => { this.inva_absntArray = inva_absntArray; }, error => { this.ShowError(error.message); })
      }
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshinva_absnt();
		return this.inva_absntArray ;
	   }

    onSelect(item: inva.inva_absnt) {
        this.currentinva_absnt = item;
    }

    onNew() {
    this.refreshCombo(); 
      if(typeof ( this.AppService.Lastinva_info.inva_infoId) === 'string' ) {
        this.currentinva_absnt = {} as inva.inva_absnt;
        this.currentinva_absnt.inva_infoId = this.AppService.Lastinva_info.inva_infoId;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
      }
    }

    onEdit(item: inva.inva_absnt) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentinva_absnt = item;
    }

    onDelete(item: inva.inva_absnt) {
        this.confirmOpened = true;
        this.currentinva_absnt = item;
    }

    onConfirmDeletion() {
        this.inva_absnt_Service.delete_inva_absntById(this.currentinva_absnt.inva_absntId).subscribe(data => {this.refreshinva_absnt()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: inva.inva_absnt) {
        this.valid=true; 
     if(this.currentinva_absnt.qty == undefined  ) this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.inva_absnt_Service.create_inva_absnt(item)
                        .subscribe(data =>{ this.refreshinva_absnt()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.inva_absnt_Service.update_inva_absnt( item)
                        .subscribe(data => {this.refreshinva_absnt()}, error => { this.ShowError(error.message); });
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
/* fill data to array */
        for(var i = 0; i < this.inva_absntArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.inva_absntArray[i].storepartid_name;
            aoa[i+1][1]=this.inva_absntArray[i].qty;
        }
		/* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);

        var wscols = [
            {wch: 50}
,            {wch: 20}
        ];

        ws['!cols'] = wscols;

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'inva_absnt');
        

        wb.Props = {
            Title: "Инвентраизация::Недостача",
            Subject: "Инвентраизация::Недостача",
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
		XLSX.writeFile(wb, 'inva_absnt.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentinva_absnt = {} as inva.inva_absnt;
    }
}
 
