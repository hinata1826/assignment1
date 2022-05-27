import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup,Validators} from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  title = 'validation';
  loginForm = new FormGroup({
    username: new FormControl('',Validators.required),
    
    password: new FormControl('',[Validators.required, Validators.min(3)]),
  })

  hide = true;
  get passwordInput() { return this.loginForm.get('password'); }

  constructor( private router:Router) { }

  navigateToSignUp(){
    this.router.navigateByUrl('sign-up');
  }

  navigateToHome(){
     
    this.router.navigateByUrl('home');
  }


  ngOnInit(): void {
    console.log('12121');
  }
}
