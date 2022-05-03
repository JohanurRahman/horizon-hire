import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicProfileComponent } from './public-profile.component';
import { PublicProfileRoutingModule } from './public-profile-routing.module';
import { SharedModule } from '../../components/shared.module';

@NgModule({
  declarations: [
    PublicProfileComponent
  ],
  imports: [
    CommonModule,
    PublicProfileRoutingModule,
    SharedModule
  ]
})

export class PublicProfileModule { }
