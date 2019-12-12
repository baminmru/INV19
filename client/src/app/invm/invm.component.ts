import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'; 
import { invm } from "app/invm"; 
import { AppService } from "app/app.service"; 
 
@Component({ 
  selector: 'app-invm', 
  templateUrl: './invm.component.html', 
  styleUrls: ['./invm.component.scss'] 
}) 
export class invmComponent implements OnInit { 
 
  constructor(public AppService:AppService) { } 
 
  ngOnInit() { 
  } 
 
}
