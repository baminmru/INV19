import { Injectable }       from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  NavigationExtras
}                           from '@angular/router';
import { AppService }      from './app.service';

@Injectable()
export class AppGuard implements CanActivate, CanActivateChild {
  constructor(private AppService:AppService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;

    return this.checkRole(url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  checkRole(url: string): boolean {
    console.log('checkROle '+ this.AppService.Role +' for : '+ url);
	if ( this.AppService.isLoggedIn) { 
	
		if(this.AppService.Role=="SUPERADMIN"){
			switch(url){
				
				
				case '/jwtLogin':
					return true;
					
				case '/Users':
					return true;
					
				case '/invg':
					return true; 
					
				case '/invm':
					return true;
					
				case '/invops':
					return true;	

				case '/invw':
					return true;	
					
				case '/invi':
					return true;
					
				case '/inva':
					return true;

				case '/invd':
					return true;

				case '/invwh':
					return true;
					
				default:
				this.router.navigate(['/']);
				return false;
				
			}
		}
	
		if(this.AppService.Role=="Администратор"){
			switch(url){
				
				
				case '/jwtLogin':
					return true;
					
				
					case '/invg':
						return true; 
						
					case '/invm':
						return true;
						
					case '/invw':
						return true;	
						
					case '/invi':
						return true;
						
					case '/inva':
						return true;
	
					case '/invd':
						return true;
						case '/invops':
							return true;	
	
					case '/invwh':
						return true;
	
					
				default:
				this.router.navigate(['/']);
				return false;
				
			}
		}
		
		if(this.AppService.Role=="Пользователь"){
			switch(url){
				
				case '/jwtLogin':
					return true;
					
					case '/invg':
						return true; 
						
					case '/invm':
						return true;
						
					case '/invw':
						return true;	
						
					case '/invi':
						return true;
						
					case '/inva':
						return true;
	
					case '/invd':
						return true;
						case '/invops':
							return true;	
	
					case '/invwh':
						return true;
	
						case '/XUser':
						return true;
				
				default:
					this.router.navigate(['/']);
					return false;
			}
		}
		
	}
  }
} 

