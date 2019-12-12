import { ModuleWithProviders } from '@angular/core/src/metadata/ng_module'; 
import { Routes, RouterModule } from '@angular/router'; 
 
import { AboutComponent } from './about/about.component'; 
import { invgComponent } from './invg/invg.component'; 
import { invmComponent } from './invm/invm.component'; 
import { invwComponent } from './invw/invw.component'; 
import { inviComponent } from './invi/invi.component'; 
import { invaComponent } from './inva/inva.component'; 
import { invdComponent } from './invd/invd.component'; 
import { invwhComponent } from './invwh/invwh.component';  
export const ROUTES: Routes = [ 
    {path: '', redirectTo: 'home', pathMatch: 'full'}, 
	 
	{path: 'invg', component:  invgComponent}, 
	{path: 'invm', component:  invmComponent}, 
	{path: 'invw', component:  invwComponent}, 
	{path: 'invi', component:  inviComponent}, 
	{path: 'inva', component:  invaComponent}, 
	{path: 'invd', component:  invdComponent}, 
	{path: 'invwh', component:  invwhComponent}, 
	{path: 'home', component: AboutComponent} 
]; 
 
export const ROUTING: ModuleWithProviders = RouterModule.forRoot(ROUTES);
