import { LoginComponent } from './login/login.component';
import { LandingComponent } from './landing/landing.component';
import { RegisterComponent } from './register/register.component';
import { Routes } from "@angular/router";
import { AppComponent } from './app.component';
import { MovementComponent } from './movement/movement.component';

export const appRoutes: Routes = [
  { path: '', component: LandingComponent },
  {path: 'register', component: RegisterComponent},
  {path: 'movement', component: MovementComponent},
  {path: 'login', component: LoginComponent},
];
