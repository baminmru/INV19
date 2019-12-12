import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'; 
import { invi } from "app/invi"; 
import { AppService } from "app/app.service"; 
 
@Component({ 
  selector: 'app-invi', 
  templateUrl: './invi.component.html', 
  styleUrls: ['./invi.component.scss'] 
}) 
export class inviComponent implements OnInit { 
 
  constructor(public AppService:AppService) { } 
 
  ngOnInit() { 
  } 
 
}
