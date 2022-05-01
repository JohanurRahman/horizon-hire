import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile.component';
import { RouterModule, Routes } from '@angular/router';
import { canActivate, redirectUnauthorizedTo, } from '@angular/fire/auth-guard';
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['sign-in']);

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    ...canActivate(redirectUnauthorizedToLogin)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ProfileRoutingModule { }
