import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'; 
import { inva } from "app/inva"; 
import { AppService } from "app/app.service"; 
 
@Component({ 
  selector: 'app-inva', 
  templateUrl: './inva.component.html', 
  styleUrls: ['./inva.component.scss'] 
}) 
export class invaComponent implements OnInit { 
 
  constructor(public AppService:AppService) { } 
 
  ngOnInit() { 
  } 
 
}
