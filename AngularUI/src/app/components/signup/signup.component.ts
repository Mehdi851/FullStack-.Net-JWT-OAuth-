import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import ValidateFrom from '../../helpers/ValidateForm';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  type: string="password";
  isText:boolean=false;
  eyeIcon:string="fa-eye-slash";
  signupform!:FormGroup;
  constructor(private fb:FormBuilder,private auth:AuthService,private router:Router){}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.signupform=this.fb.group({
      firstname:['',Validators.required],
      lastname:['',Validators.required],
      email:['',Validators.required],
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
    if(this.signupform.valid){
      console.log(this.signupform.value)
      this.auth.signUp(this.signupform.value).subscribe({
        next:(res=>{
          alert(res.message);
          this.signupform.reset();
          this.router.navigate(['login'])
        }),
        error:(err=>{
          alert(err?.error.message)
        })
      })
    }
    else{
      console.log("Form is not valid");
      ValidateFrom.validateAllFromFields(this.signupform);
      alert("Your Form is invalid!");
    }
  }
    
}
