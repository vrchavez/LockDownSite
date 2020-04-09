import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { JwtHelperService } from '@auth0/angular-jwt';
const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl: string = 'http://localhost:50745/userAuth';
  //baseUrl: string = 'https://lockdown20200408122040.azurewebsites.net/userAuth';
  constructor(private http: HttpClient, private MyRoute: Router) { }

  registerUser(user) {
    return this.http.post<User>(this.baseUrl + '/registerUser', user)
    .pipe(map(result => {this.setSession(result);
      return result; }));
    //return this.http.post(this.baseUrl + '/registerFoodie', user);
  }

  registerChef(user) {
    return this.http.post<User>(this.baseUrl + '/registerChef', user)
    .pipe(map(result => {this.setSession(result);
      return result; }));
    //return this.http.post(this.baseUrl + '/registerChef', user);
  }

  login(user): Observable<User>{
    return this.http.post<User>(this.baseUrl + '/login', user)
    .pipe(map(result => {this.setSession(result);
      return result; }));
  }

  private setSession(authResult) {

    const expiresAt = moment().add(authResult.expiresIn,'second');
    localStorage.setItem('token_value', authResult.token);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
    localStorage.setItem('familyName', authResult.familyname);
    localStorage.setItem('userId', authResult.userId);
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration = localStorage.getItem("token_value");
    const isExpired = helper.getTokenExpirationDate(expiration);
    return moment(isExpired);

  }


  getUserType() {
    return localStorage.getItem('userType');
  }

  isAuthenticated() {
    const token = localStorage.getItem('token_value');
    // Check whether the token is expired and return
    // true or false
    return !helper.isTokenExpired(token);
  }

  logout() {
    //Probably want to make a call to DB and let it know we logged out?...
    localStorage.removeItem('userName');
    localStorage.removeItem('token_value');
    localStorage.removeItem('expires_at');
    sessionStorage.clear();
    // Check if it is so that if I remove this, then Order will not be in cart anymore on logout/login.
    // this.sharedService.currentOrder.subscribe(order => this.order = order);
    // console.log(this.order);
    this.MyRoute.navigate(['/']);
  }
}
