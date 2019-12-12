import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { invd_dep_Service } from "app/invd_dep.service";
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
	   selector: 'app-invd_dep',
    styleUrls: ['./invd_dep.component.scss'],
    templateUrl: './invd_dep.component.html',
})
export class invd_depComponent implements OnInit {

    invd_depArray: Array<invd.invd_dep> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentinvd_dep: invd.invd_dep = {} as invd.invd_dep;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';

    constructor( private invd_dep_Service: invd_dep_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
        this.refreshinvd_dep();
    }
    refreshCombo() {
    }
    ngOnDestroy() {
    }

    refreshinvd_dep() {
		   console.log("refreshing invd_dep"); 
        this.invd_dep_Service.getAll_invd_deps().subscribe(invd_depArray => { this.invd_depArray = invd_depArray; }, error => { this.ShowError(error.message); })
        this.currentinvd_dep = {} as invd.invd_dep;
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshinvd_dep();
		return this.invd_depArray ;
	   }

    onSelect(item: invd.invd_dep) {
        this.currentinvd_dep = item;
    }

    onNew() {
    this.refreshCombo(); 
        this.currentinvd_dep = {} as invd.invd_dep;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
    }

    onEdit(item: invd.invd_dep) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentinvd_dep = item;
    }

    onDelete(item: invd.invd_dep) {
        this.confirmOpened = true;
        this.currentinvd_dep = item;
    }

    onConfirmDeletion() {
        this.invd_dep_Service.delete_invd_depById(this.currentinvd_dep.invd_depId).subscribe(data => {this.refreshinvd_dep()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: invd.invd_dep) {
        this.valid=true; 
     if(this.currentinvd_dep.name == undefined || this.currentinvd_dep.name=='') this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.invd_dep_Service.create_invd_dep(item)
                        .subscribe(data =>{ this.refreshinvd_dep()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.invd_dep_Service.update_invd_dep( item)
                        .subscribe(data => {this.refreshinvd_dep()}, error => { this.ShowError(error.message); });
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
        for(var i = 0; i < this.invd_depArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.invd_depArray[i].name;
        }
		/* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);

        var wscols = [
            {wch: 64}
        ];

        ws['!cols'] = wscols;

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'invd_dep');
        

        wb.Props = {
            Title: "Справочник::Отдел",
            Subject: "Справочник::Отдел",
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
		XLSX.writeFile(wb, 'invd_dep.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentinvd_dep = {} as invd.invd_dep;
    }
}
 
