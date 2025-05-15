import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AppComponent } from './app.component';


export const routes: Routes = [
    
    {path:'login', component:LoginComponent},
    {path:'signup',component:SignupComponent}

];
