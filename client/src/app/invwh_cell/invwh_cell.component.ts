import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { invwh_cell_Service } from "app/invwh_cell.service";
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
	   selector: 'app-invwh_cell',
    styleUrls: ['./invwh_cell.component.scss'],
    templateUrl: './invwh_cell.component.html',
})
export class invwh_cellComponent implements OnInit {

    invwh_cellArray: Array<invwh.invwh_cell> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentinvwh_cell: invwh.invwh_cell = {} as invwh.invwh_cell;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';
   subscription:ISubscription;

    constructor( private invwh_cell_Service: invwh_cell_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
		   // console.log("Subscribe invwh_cell"); 
        this.subscription=this.AppService.currentinvwh_loc.subscribe(si =>{ this.refreshinvwh_cell(); }, error => { this.ShowError(error.message); } );
        this.refreshinvwh_cell();
    }
    refreshCombo() {
    }
    ngOnDestroy() {
		   // console.log("Unsubscribe invwh_cell"); 
        this.subscription.unsubscribe();
    }

    refreshinvwh_cell() {
		let item:invwh.invwh_loc;
		item=this.AppService.Lastinvwh_loc;
		console.log("refreshing invwh_cell"); 
     this.currentinvwh_cell = {} as invwh.invwh_cell;
		if(typeof item === 'undefined') { 
		   //console.log("no parent item for refresh"); 
        this.invwh_cell_Service.get_invwh_cellByParent('00000000-0000-0000-0000-000000000000').subscribe(invwh_cellArray => { this.invwh_cellArray = invwh_cellArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.invwh_locId==='undefined') { 
		   //console.log("no parent id for refresh"); 
        this.invwh_cell_Service.get_invwh_cellByParent('00000000-0000-0000-0000-000000000000').subscribe(invwh_cellArray => { this.invwh_cellArray = invwh_cellArray; }, error => { this.ShowError(error.message); })
			return; 
		} 
		if(typeof item.invwh_locId === 'string' ) {
        this.invwh_cell_Service.get_invwh_cellByParent(item.invwh_locId).subscribe(invwh_cellArray => { this.invwh_cellArray = invwh_cellArray; }, error => { this.ShowError(error.message); })
      }
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshinvwh_cell();
		return this.invwh_cellArray ;
	   }

    onSelect(item: invwh.invwh_cell) {
        this.currentinvwh_cell = item;
    }

    onNew() {
    this.refreshCombo(); 
      if(typeof ( this.AppService.Lastinvwh_loc.invwh_locId) === 'string' ) {
        this.currentinvwh_cell = {} as invwh.invwh_cell;
        this.currentinvwh_cell.invwh_locId = this.AppService.Lastinvwh_loc.invwh_locId;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
      }
    }

    onEdit(item: invwh.invwh_cell) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentinvwh_cell = item;
    }

    onDelete(item: invwh.invwh_cell) {
        this.confirmOpened = true;
        this.currentinvwh_cell = item;
    }

    onConfirmDeletion() {
        this.invwh_cell_Service.delete_invwh_cellById(this.currentinvwh_cell.invwh_cellId).subscribe(data => {this.refreshinvwh_cell(); this.backToList();}, error => { this.ShowError(error.message); });
    }

    save(item: invwh.invwh_cell) {
        this.valid=true; 
     if(this.currentinvwh_cell.name == undefined || this.currentinvwh_cell.name=='') this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.invwh_cell_Service.create_invwh_cell(item)
                        .subscribe(data =>{ this.refreshinvwh_cell();this.backToList();}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.invwh_cell_Service.update_invwh_cell( item)
                        .subscribe(data => {this.refreshinvwh_cell();this.backToList();}, error => { this.ShowError(error.message); });
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
            aoa[0][0]='Название';
            aoa[0][1]='Штрихкод ячейки';
/* fill data to array */
        for(var i = 0; i < this.invwh_cellArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.invwh_cellArray[i].name;
            aoa[i+1][1]=this.invwh_cellArray[i].sHCODE;
        }
		/* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);

        var wscols = [
            {wch: 64}
,            {wch: 64}
        ];

        ws['!cols'] = wscols;

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'invwh_cell');
        

        wb.Props = {
            Title: "Структура склада::Ячейка",
            Subject: "Структура склада::Ячейка",
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
		XLSX.writeFile(wb, 'invwh_cell.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentinvwh_cell = {} as invwh.invwh_cell;
    }
}
 
