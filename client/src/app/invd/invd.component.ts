import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'; 
import { invd } from "app/invd"; 
import { AppService } from "app/app.service"; 
 
@Component({ 
  selector: 'app-invd', 
  templateUrl: './invd.component.html', 
  styleUrls: ['./invd.component.scss'] 
}) 
export class invdComponent implements OnInit { 
 
  constructor(public AppService:AppService) { } 
 
  ngOnInit() { 
  } 
 
}
