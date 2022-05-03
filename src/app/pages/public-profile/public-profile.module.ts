import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicProfileComponent } from './public-profile.component';
import { PublicProfileRoutingModule } from './public-profile-routing.module';

@NgModule({
  declarations: [
    PublicProfileComponent
  ],
  imports: [
    CommonModule,
    PublicProfileRoutingModule
  ]
})

export class PublicProfileModule { }
