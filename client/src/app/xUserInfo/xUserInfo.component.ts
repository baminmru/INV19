import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { xUserInfo_Service } from "app/xUserInfo.service";
import { AppService } from "app/app.service";
import { Observable, SubscriptionLike as ISubscription} from "rxjs";
import {  Validators } from "@angular/forms";

import { RemoveHTMLtagPipe } from 'app/pipes';
import { XUser } from "app/XUser";
import * as XLSX from 'xlsx';

const MODE_LIST = 0;
const MODE_NEW = 1;
const MODE_EDIT = 2;

@Component({
	   selector: 'app-xUserInfo',
    styleUrls: ['./xUserInfo.component.scss'],
    templateUrl: './xUserInfo.component.html',
})
export class xUserInfoComponent implements OnInit {

    xUserInfoArray: Array<XUser.xUserInfo> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentxUserInfo: XUser.xUserInfo = {} as XUser.xUserInfo;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';

    constructor( private xUserInfo_Service: xUserInfo_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
        this.refreshxUserInfo();
    }
    refreshCombo() {
    }
    ngOnDestroy() {
    }

    refreshxUserInfo() {
		   console.log("refreshing xUserInfo"); 
        this.xUserInfo_Service.getAll_xUserInfos().subscribe(xUserInfoArray => { this.xUserInfoArray = xUserInfoArray; }, error => { this.ShowError(error.message); })
        this.currentxUserInfo = {} as XUser.xUserInfo;
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshxUserInfo();
		return this.xUserInfoArray ;
	   }

    onSelect(item: XUser.xUserInfo) {
        this.currentxUserInfo = item;
    }

    onNew() {
    this.refreshCombo(); 
        this.currentxUserInfo = {} as XUser.xUserInfo;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
    }

    onEdit(item: XUser.xUserInfo) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentxUserInfo = item;
    }

    onDelete(item: XUser.xUserInfo) {
        this.confirmOpened = true;
        this.currentxUserInfo = item;
    }

    onConfirmDeletion() {
        this.xUserInfo_Service.delete_xUserInfoById(this.currentxUserInfo.xUserInfoId).subscribe(data => {this.refreshxUserInfo()}, error => { this.ShowError(error.message); });
        this.backToList();
    }

    save(item: XUser.xUserInfo) {
        this.valid=true; 
     if(this.currentxUserInfo.family == undefined || this.currentxUserInfo.family=='') this.valid=false;
     if(this.currentxUserInfo.name == undefined || this.currentxUserInfo.name=='') this.valid=false;
     if(this.currentxUserInfo.login == undefined || this.currentxUserInfo.login=='') this.valid=false;
     if(this.currentxUserInfo.islocked == undefined ) this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.xUserInfo_Service.create_xUserInfo(item)
                        .subscribe(data =>{ this.refreshxUserInfo()}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.xUserInfo_Service.update_xUserInfo( item)
                        .subscribe(data => {this.refreshxUserInfo()}, error => { this.ShowError(error.message); });
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
            aoa[0][0]='Фамилия';
            aoa[0][1]='Имя';
            aoa[0][2]='Отчество';
            aoa[0][3]='e-mail';
            aoa[0][4]='Телефон';
            aoa[0][5]='Имя для входа';
            aoa[0][6]='Заблокирован';
/* fill data to array */
        for(var i = 0; i < this.xUserInfoArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.xUserInfoArray[i].family;
            aoa[i+1][1]=this.xUserInfoArray[i].name;
            aoa[i+1][2]=this.xUserInfoArray[i].partonymic;
            aoa[i+1][3]=this.xUserInfoArray[i].email;
            aoa[i+1][4]=this.xUserInfoArray[i].phone;
            aoa[i+1][5]=this.xUserInfoArray[i].login;
            aoa[i+1][6]=this.xUserInfoArray[i].islocked_name;
        }
		/* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);

        var wscols = [
            {wch: 64}
,            {wch: 64}
,            {wch: 64}
,            {wch: 64}
,            {wch: 64}
,            {wch: 64}
,            {wch: 30}
        ];

        ws['!cols'] = wscols;

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'xUserInfo');
        

        wb.Props = {
            Title: "Оператор::Оператор",
            Subject: "Оператор::Оператор",
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
		XLSX.writeFile(wb, 'xUserInfo.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentxUserInfo = {} as XUser.xUserInfo;
    }
}
 
