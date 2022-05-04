import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { canActivate, redirectLoggedInTo } from '@angular/fire/auth-guard';

import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';

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
