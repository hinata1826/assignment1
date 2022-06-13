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
boolean bar(int x, int y) {
        System.out.println("X and Y are different");
      System.out.println("X and Y are different");
        return (x != y) ? diff(x) : same(y);
    }

  ngOnInit(): void {
  let data = {'1':"1"}
  
  console.log("1");
  
  }
}
