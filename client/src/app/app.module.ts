import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { BrowserModule } from '@angular/platform-browser'; 
import { NgModule } from '@angular/core'; 
import { FormsModule } from '@angular/forms'; 
import { HttpClientModule, HttpClient } from '@angular/common/http'; 
import { AmexioWidgetModule, CommonDataService, AmexioChartsModule,  AmexioDashBoardModule } from 'amexio-ng-extensions';
// import { AmexioChartD3Module } from 'amexio-chart-d3';


import {CookieService} from 'ngx-cookie-service'; 
import { NgxWigModule} from 'ngx-wig';
import { CommonModule } from "@angular/common";
import {AppService} from 'app/app.service'; 

import { RemoveHTMLtagPipe} from 'app/pipes';
 
import { AppGuard} from 'app/app.guard'; 
import { AppComponent } from './app.component'; 
import { ROUTING } from './app.routing'; 
import { AboutComponent } from './about/about.component'; 
import { TopnavComponent } from './topnav/topnav.component'; 
import { jwtLoginComponent } from './jwtlogin/jwtlogin.component'; 


import { invgComponent } from './invg/invg.component'; // Группы
import { invg_grpComponent } from './invg_grp/invg_grp.component'; // Группа
import { invg_grp_Service } from 'app/invg_grp.service'; 
import { invg_subgrpComponent } from './invg_subgrp/invg_subgrp.component'; // Подгруппа
import { invg_subgrp_Service } from 'app/invg_subgrp.service'; 
 
import { invmComponent } from './invm/invm.component'; // Движение
import { invm_infoComponent } from './invm_info/invm_info.component'; // Движение
import { invm_info_Service } from 'app/invm_info.service'; 
 
import { invwComponent } from './invw/invw.component'; // Заполнение склада
import { invw_infoComponent } from './invw_info/invw_info.component'; // Заполнение
import { invw_info_Service } from 'app/invw_info.service'; 
 
import { inviComponent } from './invi/invi.component'; // Запчасть
import { invp_dataComponent } from './invp_data/invp_data.component'; // Описание
import { invp_data_Service } from 'app/invp_data.service'; 
 
import { invaComponent } from './inva/inva.component'; // Инвентраизация
import { inva_infoComponent } from './inva_info/inva_info.component'; // Описание
import { inva_info_Service } from 'app/inva_info.service'; 
import { inva_realComponent } from './inva_real/inva_real.component'; // Наличие
import { inva_real_Service } from 'app/inva_real.service'; 
import { inva_absntComponent } from './inva_absnt/inva_absnt.component'; // Недостача
import { inva_absnt_Service } from 'app/inva_absnt.service'; 
import { inva_extraComponent } from './inva_extra/inva_extra.component'; // Излишки
import { inva_extra_Service } from 'app/inva_extra.service'; 
 
import { invdComponent } from './invd/invd.component'; // Справочник
import { invd_depComponent } from './invd_dep/invd_dep.component'; // Отдел
import { invd_dep_Service } from 'app/invd_dep.service'; 
import { invd_machineComponent } from './invd_machine/invd_machine.component'; // Машина
import { invd_machine_Service } from 'app/invd_machine.service'; 
import { invd_zoneComponent } from './invd_zone/invd_zone.component'; // Зона склада
import { invd_zone_Service } from 'app/invd_zone.service'; 
 
import { invwhComponent } from './invwh/invwh.component'; // Структура склада
import { invwh_locComponent } from './invwh_loc/invwh_loc.component'; // Стеллаж
import { invwh_loc_Service } from 'app/invwh_loc.service'; 
import { invwh_cellComponent } from './invwh_cell/invwh_cell.component'; // Ячейка
import { invwh_cell_Service } from 'app/invwh_cell.service'; 

@NgModule({ 
    declarations: [ 
        AppComponent, 
jwtLoginComponent,



 RemoveHTMLtagPipe,
  invgComponent ,  // Группы
  invg_grpComponent, // Группа
  invg_subgrpComponent, // Подгруппа
 
 invmComponent ,  // Движение
  invm_infoComponent, // Движение
 
 invwComponent ,  // Заполнение склада
  invw_infoComponent, // Заполнение
 
 inviComponent ,  // Запчасть
  invp_dataComponent, // Описание
 
 invaComponent ,  // Инвентраизация
  inva_infoComponent, // Описание
  inva_realComponent, // Наличие
  inva_absntComponent, // Недостача
  inva_extraComponent, // Излишки
 
 invdComponent ,  // Справочник
  invd_depComponent, // Отдел
  invd_machineComponent, // Машина
  invd_zoneComponent, // Зона склада
 
 invwhComponent ,  // Структура склада
  invwh_locComponent, // Стеллаж
  invwh_cellComponent, // Ячейка
		 
        AboutComponent, 
        TopnavComponent 
		 
    ], 
    imports: [ 
        BrowserAnimationsModule, 
        BrowserModule, 
        FormsModule, 
        HttpClientModule, 
		
		// AMEXIO 
        AmexioWidgetModule, 
	//	AmexioChartsModule,  
	//	AmexioDashBoardModule, 
	//	AmexioChartD3Module,
		
 NgxWigModule,
	CommonModule,
        ROUTING 
    ], 
    providers: [HttpClient 
  ,invg_grp_Service
  ,invg_subgrp_Service
  ,invm_info_Service
  ,invw_info_Service
  ,invp_data_Service
  ,inva_info_Service
  ,inva_real_Service
  ,inva_absnt_Service
  ,inva_extra_Service
  ,invd_dep_Service
  ,invd_machine_Service
  ,invd_zone_Service
  ,invwh_loc_Service
  ,invwh_cell_Service
	,AppService 
	  ,AppGuard
	,CookieService 
	], 
    bootstrap: [AppComponent] 
}) 
export class AppModule { 
} 
