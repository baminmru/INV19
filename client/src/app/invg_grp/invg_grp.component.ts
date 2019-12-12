import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { invg_grp_Service } from "app/invg_grp.service";
import { AppService } from "app/app.service";
import { Observable, SubscriptionLike as ISubscription} from "rxjs";
import {  Validators } from "@angular/forms";

import { RemoveHTMLtagPipe } from 'app/pipes';
import { invg } from "app/invg";
import * as XLSX from 'xlsx';

const MODE_LIST = 0;
const MODE_NEW = 1;
const MODE_EDIT = 2;

@Component({
	   selector: 'app-invg_grp',
    styleUrls: ['./invg_grp.component.scss'],
    templateUrl: './invg_grp.component.html',
})
export class invg_grpComponent implements OnInit {

    invg_grpArray: Array<invg.invg_grp> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentinvg_grp: invg.invg_grp = {} as invg.invg_grp;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';

    constructor( private invg_grp_Service: invg_grp_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
        this.refreshinvg_grp();
    }
    refreshCombo() {
    }
    ngOnDestroy() {
    }

    refreshinvg_grp() {
		   console.log("refreshing invg_grp"); 
        this.invg_grp_Service.getAll_invg_grps().subscribe(invg_grpArray => { this.invg_grpArray = invg_grpArray; }, error => { this.ShowError(error.message); })
        this.currentinvg_grp = {} as invg.invg_grp;
        console.log("clear selection for invg_grp on refresh");
        this.AppService.pushSelectedinvg_grp(this.currentinvg_grp);
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshinvg_grp();
		return this.invg_grpArray ;
	   }

    onSelect(item: invg.invg_grp) {
        this.currentinvg_grp = item;
        this.AppService.pushSelectedinvg_grp(item);
    }

    onNew() {
    this.refreshCombo(); 
        this.currentinvg_grp = {} as invg.invg_grp;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
    }

    onEdit(item: invg.invg_grp) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentinvg_grp = item;
    }

    onDelete(item: invg.invg_grp) {
        this.confirmOpened = true;
        this.currentinvg_grp = item;
    }

    onConfirmDeletion() {
        this.invg_grp_Service.delete_invg_grpById(this.currentinvg_grp.invg_grpId).subscribe(data => {this.refreshinvg_grp()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: invg.invg_grp) {
        this.valid=true; 
     if(this.currentinvg_grp.name == undefined || this.currentinvg_grp.name=='') this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.invg_grp_Service.create_invg_grp(item)
                        .subscribe(data =>{ this.refreshinvg_grp()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.invg_grp_Service.update_invg_grp( item)
                        .subscribe(data => {this.refreshinvg_grp()}, error => { this.ShowError(error.message); });
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
        for(var i = 0; i < this.invg_grpArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.invg_grpArray[i].name;
        }
		/* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);

        var wscols = [
            {wch: 64}
        ];

        ws['!cols'] = wscols;

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'invg_grp');
        

        wb.Props = {
            Title: "Группы::Группа",
            Subject: "Группы::Группа",
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
		XLSX.writeFile(wb, 'invg_grp.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentinvg_grp = {} as invg.invg_grp;
        console.log("clear selection for invg_grp");
        this.AppService.pushSelectedinvg_grp(this.currentinvg_grp);
    }
}
 
