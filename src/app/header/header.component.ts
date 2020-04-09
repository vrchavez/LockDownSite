import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  familyName: string;

  constructor(private auth: AuthService) { }

  ngOnInit(){
    this.familyName = localStorage.getItem('familyName');
  }

  logout() {
    this.auth.logout();
  }

}
