import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard-component/dashboard-component';
import { WelcomeComponent } from './pages/welcome-component/welcome-component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'welcom',
        pathMatch: 'full'
    },
    
    {
        path: 'welcom',
        component: WelcomeComponent,
        children: [
            {   
                path: 'dashboard',
                component: DashboardComponent
            }
        ]
    }

    // {
    //     path: 'dashboard',
    //     component: DashboardComponent
        
    // }


    
];
