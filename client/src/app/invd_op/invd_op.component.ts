import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { invd_op_Service } from "app/invd_op.service";
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
	   selector: 'app-invd_op',
    styleUrls: ['./invd_op.component.scss'],
    templateUrl: './invd_op.component.html',
})
export class invd_opComponent implements OnInit {

    invd_opArray: Array<invd.invd_op> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentinvd_op: invd.invd_op = {} as invd.invd_op;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';

    constructor( private invd_op_Service: invd_op_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
        this.refreshinvd_op();
    }
    refreshCombo() {
    }
    ngOnDestroy() {
    }

    refreshinvd_op() {
		   console.log("refreshing invd_op"); 
        this.invd_op_Service.getAll_invd_ops().subscribe(invd_opArray => { this.invd_opArray = invd_opArray; }, error => { this.ShowError(error.message); })
        this.currentinvd_op = {} as invd.invd_op;
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshinvd_op();
		return this.invd_opArray ;
	   }

    onSelect(item: invd.invd_op) {
        this.currentinvd_op = item;
    }

    onNew() {
    this.refreshCombo(); 
        this.currentinvd_op = {} as invd.invd_op;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
    }

    onEdit(item: invd.invd_op) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentinvd_op = item;
    }

    onDelete(item: invd.invd_op) {
        this.confirmOpened = true;
        this.currentinvd_op = item;
    }

    onConfirmDeletion() {
        this.invd_op_Service.delete_invd_opById(this.currentinvd_op.invd_opId).subscribe(data => {this.refreshinvd_op(); this.backToList();}, error => { this.ShowError(error.message); });
    }

    save(item: invd.invd_op) {
        this.valid=true; 
     if(this.currentinvd_op.name == undefined || this.currentinvd_op.name=='') this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.invd_op_Service.create_invd_op(item)
                        .subscribe(data =>{ this.refreshinvd_op();this.backToList();}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.invd_op_Service.update_invd_op( item)
                        .subscribe(data => {this.refreshinvd_op();this.backToList();}, error => { this.ShowError(error.message); });
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
/* fill data to array */
        for(var i = 0; i < this.invd_opArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.invd_opArray[i].name;
        }
		/* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);

        var wscols = [
            {wch: 64}
        ];

        ws['!cols'] = wscols;

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'invd_op');
        

        wb.Props = {
            Title: "Справочник::Операции",
            Subject: "Справочник::Операции",
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
		XLSX.writeFile(wb, 'invd_op.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentinvd_op = {} as invd.invd_op;
    }
}
 
