import { Component, Inject } from '@angular/core';
import { Router, RouterOutlet } from "@angular/router";
import { DashboardComponent } from "../dashboard-component/dashboard-component";

@Component({
  selector: 'app-welcome-component',
  imports: [DashboardComponent],
  templateUrl: './welcome-component.html',
  styleUrl: './welcome-component.css',
})
export class WelcomeComponent {


   //router= Inject(RouterOutlet);
    constructor(private router: Router) {

    }

  userLogout() {
    this.router.navigateByUrl('/welcome');
  }

  


}
