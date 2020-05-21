import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { invd_machine_Service } from "app/invd_machine.service";
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
	   selector: 'app-invd_machine',
    styleUrls: ['./invd_machine.component.scss'],
    templateUrl: './invd_machine.component.html',
})
export class invd_machineComponent implements OnInit {

    invd_machineArray: Array<invd.invd_machine> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentinvd_machine: invd.invd_machine = {} as invd.invd_machine;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';

    constructor( private invd_machine_Service: invd_machine_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
        this.refreshinvd_machine();
    }
    refreshCombo() {
    }
    ngOnDestroy() {
    }

    refreshinvd_machine() {
		   console.log("refreshing invd_machine"); 
        this.invd_machine_Service.getAll_invd_machines().subscribe(invd_machineArray => { this.invd_machineArray = invd_machineArray; }, error => { this.ShowError(error.message); })
        this.currentinvd_machine = {} as invd.invd_machine;
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshinvd_machine();
		return this.invd_machineArray ;
	   }

    onSelect(item: invd.invd_machine) {
        this.currentinvd_machine = item;
    }

    onNew() {
    this.refreshCombo(); 
        this.currentinvd_machine = {} as invd.invd_machine;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
    }

    onEdit(item: invd.invd_machine) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentinvd_machine = item;
    }

    onDelete(item: invd.invd_machine) {
        this.confirmOpened = true;
        this.currentinvd_machine = item;
    }

    onConfirmDeletion() {
        this.invd_machine_Service.delete_invd_machineById(this.currentinvd_machine.invd_machineId).subscribe(data => {this.refreshinvd_machine(); this.backToList();}, error => { this.ShowError(error.message); });
    }

    save(item: invd.invd_machine) {
        this.valid=true; 
     if(this.currentinvd_machine.name == undefined || this.currentinvd_machine.name=='') this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.invd_machine_Service.create_invd_machine(item)
                        .subscribe(data =>{ this.refreshinvd_machine();this.backToList();}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.invd_machine_Service.update_invd_machine( item)
                        .subscribe(data => {this.refreshinvd_machine();this.backToList();}, error => { this.ShowError(error.message); });
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
        for(var i = 0; i < this.invd_machineArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.invd_machineArray[i].name;
        }
		/* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);

        var wscols = [
            {wch: 64}
        ];

        ws['!cols'] = wscols;

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'invd_machine');
        

        wb.Props = {
            Title: "Справочник::Машина",
            Subject: "Справочник::Машина",
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
		XLSX.writeFile(wb, 'invd_machine.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentinvd_machine = {} as invd.invd_machine;
    }
}
 
