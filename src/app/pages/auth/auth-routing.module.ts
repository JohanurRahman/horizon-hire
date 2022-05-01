import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo, } from '@angular/fire/auth-guard';
const redirectLoggedInToProfile = () => redirectLoggedInTo(['profile']);

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'sign-in',
        component: SignInComponent,
        ...canActivate(redirectLoggedInToProfile)
      },
      {
        path: 'sign-up',
        component: SignUpComponent,
        ...canActivate(redirectLoggedInToProfile)
      },
      {
        path: '**',
        redirectTo: 'sign-in'
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AuthRoutingModule { }
