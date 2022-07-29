import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup,Validators} from '@angular/forms';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  signUpForm = new FormGroup({
    name: new FormControl('',Validators.required),
    email: new FormControl('',[Validators.required,Validators.pattern("[^@]+@[^@]+\.[a-zA-Z]{2,6}")]),
    password: new FormControl('',[Validators.required, Validators.min(3)]),
  })

  hide = true;
  get passwordInput() { return this.signUpForm.get('password'); }

  constructor() { }

  ngOnInit(): void {
<<<<<<< HEAD
    console.log("1234456");
=======
    console.log("123456789898");
>>>>>>> 1e0622335f43870b82c0a9757a9f59f0a76540fb
  }
  signUp(){
    
  }
  onSubmit(item){
    if(this.signUpForm.valid && item){
       console.log("1234456");
    }
  }
}
