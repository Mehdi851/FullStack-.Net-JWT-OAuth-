import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  public users:any=[];
  constructor(private auth:AuthService,private api:ApiService){

  }
 ngOnInit(): void {
  //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //Add 'implements O0nInit' to the class.
  console.log(localStorage.getItem('token'))
  this.api.getUsers().subscribe(res=>{
    console.log(res);
    this.users=res;
  })
 }

  logout(){
    
    this.auth.signOut();
  }
}
