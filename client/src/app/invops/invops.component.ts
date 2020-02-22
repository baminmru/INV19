import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'; 
import { invops } from "app/invops"; 
import { AppService } from "app/app.service"; 
 
@Component({ 
  selector: 'app-invops', 
  templateUrl: './invops.component.html', 
  styleUrls: ['./invops.component.scss'] 
}) 
export class invopsComponent implements OnInit { 
 
  constructor(public AppService:AppService) { } 
 
  ngOnInit() { 
  } 
 
}
