import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'; 
import { invg } from "app/invg"; 
import { AppService } from "app/app.service"; 
 
@Component({ 
  selector: 'app-invg', 
  templateUrl: './invg.component.html', 
  styleUrls: ['./invg.component.scss'] 
}) 
export class invgComponent implements OnInit { 
 
  constructor(public AppService:AppService) { } 
 
  ngOnInit() { 
  } 
 
}
