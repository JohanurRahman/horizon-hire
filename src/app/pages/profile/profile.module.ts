import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TopNavComponent } from '../../components/top-nav/top-nav.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PersonalInfoComponent } from '../../components/personal-info/personal-info.component';

@NgModule({
  declarations: [
    ProfileComponent,
    TopNavComponent,
    PersonalInfoComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ]
})

export class ProfileModule { }
