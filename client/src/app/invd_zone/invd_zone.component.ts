import { Component, OnInit, OnDestroy,  Input, Output, EventEmitter } from "@angular/core";
import { invd_zone_Service } from "app/invd_zone.service";
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
	   selector: 'app-invd_zone',
    styleUrls: ['./invd_zone.component.scss'],
    templateUrl: './invd_zone.component.html',
})
export class invd_zoneComponent implements OnInit {

    invd_zoneArray: Array<invd.invd_zone> = [];
    opened: boolean = false;
    confirmOpened: boolean = false;
    mode: Number = MODE_LIST;
    currentinvd_zone: invd.invd_zone = {} as invd.invd_zone;
    formMsg: string = '';
    valid:boolean=true;
    errorFlag:boolean=false;
    errorMessage:string='';

    constructor( private invd_zone_Service: invd_zone_Service,  public AppService:AppService ) {
    }

    ngOnInit() {
        this.refreshinvd_zone();
    }
    refreshCombo() {
    }
    ngOnDestroy() {
    }

    refreshinvd_zone() {
		   console.log("refreshing invd_zone"); 
        this.invd_zone_Service.getAll_invd_zones().subscribe(invd_zoneArray => { this.invd_zoneArray = invd_zoneArray; }, error => { this.ShowError(error.message); })
        this.currentinvd_zone = {} as invd.invd_zone;
    }

	   ShowError(message:string){
		this.errorMessage=message; ;
		this.errorFlag=true;
	   }

	   getData(){
		this.refreshinvd_zone();
		return this.invd_zoneArray ;
	   }

    onSelect(item: invd.invd_zone) {
        this.currentinvd_zone = item;
    }

    onNew() {
    this.refreshCombo(); 
        this.currentinvd_zone = {} as invd.invd_zone;
        this.opened = true;
        this.mode = MODE_NEW;
        this.formMsg = 'Создать: ';
    }

    onEdit(item: invd.invd_zone) {
    this.refreshCombo(); 
        this.opened = true;
        this.formMsg = 'Изменить: ';
        this.mode = MODE_EDIT;
        this.currentinvd_zone = item;
    }

    onDelete(item: invd.invd_zone) {
        this.confirmOpened = true;
        this.currentinvd_zone = item;
    }

    onConfirmDeletion() {
        this.invd_zone_Service.delete_invd_zoneById(this.currentinvd_zone.invd_zoneId).subscribe(data => {this.refreshinvd_zone(); this.backToList();}, error => { this.ShowError(error.message); });
    }

    save(item: invd.invd_zone) {
        this.valid=true; 
     if(this.currentinvd_zone.name == undefined || this.currentinvd_zone.name=='') this.valid=false;
        if (this.valid) {
            switch (this.mode) {
                case MODE_NEW: {
                    this.invd_zone_Service.create_invd_zone(item)
                        .subscribe(data =>{ this.refreshinvd_zone();this.backToList();}, error => { this.ShowError(error.message); });
                    break;
                }
                case MODE_EDIT: {
                    this.invd_zone_Service.update_invd_zone( item)
                        .subscribe(data => {this.refreshinvd_zone();this.backToList();}, error => { this.ShowError(error.message); });
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
        for(var i = 0; i < this.invd_zoneArray.length; ++i) {
            if(!aoa[i+1]) aoa[i+1] = [];
            aoa[i+1][0]=this.invd_zoneArray[i].name;
        }
		/* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);

        var wscols = [
            {wch: 64}
        ];

        ws['!cols'] = wscols;

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'invd_zone');
        

        wb.Props = {
            Title: "Справочник::Зона склада",
            Subject: "Справочник::Зона склада",
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
		XLSX.writeFile(wb, 'invd_zone.xlsx');
	}
    backToList() {
        this.opened = false;
        this.confirmOpened = false;
        this.mode = MODE_LIST;
        this.currentinvd_zone = {} as invd.invd_zone;
    }
}
 
