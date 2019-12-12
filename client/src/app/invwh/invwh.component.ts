import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'; 
import { invwh } from "app/invwh"; 
import { AppService } from "app/app.service"; 
 
@Component({ 
  selector: 'app-invwh', 
  templateUrl: './invwh.component.html', 
  styleUrls: ['./invwh.component.scss'] 
}) 
export class invwhComponent implements OnInit { 
 
  constructor(public AppService:AppService) { } 
 
  ngOnInit() { 
  } 
 
}
