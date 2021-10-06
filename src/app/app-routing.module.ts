import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { HomeComponent } from './core/home/home.component';

const routes: Routes = [

  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: '',
        component: LoginComponent
      },
      {
        path:'sign-up',
        component: SignUpComponent
      },
      {
        path:'home',
        component: HomeComponent
      }

    ]
  }

  // { path: '**', redirectTo:'login' },
  // { path:'sign-up', component: SignUpComponent },
  // { path:'home', component: HomeComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
