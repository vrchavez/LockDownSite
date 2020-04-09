import { FamilyService } from './services/family.service';
import { ChefservService } from './services/chefserv.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { appRoutes } from './app.routing';
import { RegisterComponent } from './register/register.component';
import { LandingComponent } from './landing/landing.component';
import { AuthService } from './services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MovementComponent } from './movement/movement.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LandingComponent,
    MovementComponent,
    HeaderComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [AuthService, ChefservService, FamilyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
