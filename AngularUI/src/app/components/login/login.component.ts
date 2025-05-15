import { CommonModule } from '@angular/common';
import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import ValidateFrom from '../../helpers/ValidateForm';

@Component({
  selector: 'app-login',
  imports: [CommonModule ,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  type: string="password";
  isText:boolean=false;
  eyeIcon:string="fa-eye-slash";
  loginForm!:FormGroup;
  constructor(private fb:FormBuilder){

  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loginForm=this.fb.group({
      username:['',Validators.required],
      password:['',Validators.required]
    })
  }

  hideShowPass(){

    this.isText=!this.isText;
    this.isText? this.eyeIcon="fa-eye":this.eyeIcon="fa-eye-slash";
    this.isText? this.type="text":this.type="password";
  }

  onSubmit(){
    if(this.loginForm.valid){
      console.log(this.loginForm.value)
    }
    else{
      console.log("Form is not valid");
      ValidateFrom.validateAllFromFields(this.loginForm);
      alert("Your Form is invalid!");
    }
  }

 
}
