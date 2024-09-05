import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AgregarComponent } from './pages/agregar/agregar.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { permissionsGuard } from './guards/permissions.guard';
import { warningsGuard } from './guards/warnings.guard';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/welcome' },
  { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.routes').then(m => m.WELCOME_ROUTES) },
  { path: 'login', component: LoginComponent,canDeactivate: [warningsGuard]},
  {path: 'agregar', component: AgregarComponent, canActivate: [permissionsGuard],canDeactivate: [warningsGuard]},
  {path: 'usuarios', component: UsuariosComponent,...canActivate(() => redirectUnauthorizedTo(['login']))},
  { path: 'register', component: RegisterComponent,canDeactivate: [warningsGuard] },
 
];
