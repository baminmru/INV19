import { ModuleWithProviders } from '@angular/core/src/metadata/ng_module'; 
import { Routes, RouterModule } from '@angular/router'; 
import { AppGuard} from 'app/app.guard'; 
 
import { AboutComponent } from './about/about.component'; 
import { invgComponent } from './invg/invg.component'; 
import { invmComponent } from './invm/invm.component'; 
import { invwComponent } from './invw/invw.component'; 
import { inviComponent } from './invi/invi.component'; 
import { invaComponent } from './inva/inva.component'; 
import { invdComponent } from './invd/invd.component'; 
import { invwhComponent } from './invwh/invwh.component';  
import { XUserComponent } from './XUser/XUser.component'; 
import { invopsComponent } from './invops/invops.component'; 
import { jwtLoginComponent } from './jwtlogin/jwtlogin.component';  
export const ROUTES: Routes = [ 
    {path: '', redirectTo: 'home', pathMatch: 'full'}, 
	 
	{path: 'invg', canActivate: [AppGuard], component:  invgComponent}, 
	{path: 'invm', canActivate: [AppGuard],component:  invmComponent}, 
	{path: 'invw', canActivate: [AppGuard],component:  invwComponent}, 
	{path: 'invi', canActivate: [AppGuard],component:  inviComponent}, 
	{path: 'inva', canActivate: [AppGuard],component:  invaComponent}, 
	{path: 'invd', canActivate: [AppGuard],component:  invdComponent}, 
    {path: 'XUser', canActivate: [AppGuard],component:  XUserComponent},
	{path: 'invops', canActivate: [AppGuard], component:  invopsComponent}, 
	{path: 'invwh',  canActivate: [AppGuard], component:  invwhComponent}, 
	{path: 'jwtLogin', component:  jwtLoginComponent}, 
	{path: 'password', redirectTo: '/password', pathMatch:'full'},
	{path: 'home', component: AboutComponent} 
	
]; 
 
export const ROUTING: ModuleWithProviders = RouterModule.forRoot(ROUTES);
