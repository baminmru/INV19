import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'; 
import { invw } from "app/invw"; 
import { AppService } from "app/app.service"; 
 
@Component({ 
  selector: 'app-invw', 
  templateUrl: './invw.component.html', 
  styleUrls: ['./invw.component.scss'] 
}) 
export class invwComponent implements OnInit { 
 
  constructor(public AppService:AppService) { } 
 
  ngOnInit() { 
  } 
 
}
