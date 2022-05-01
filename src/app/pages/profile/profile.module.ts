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
import { PersonalInfoEditComponent } from '../../dialogs/personal-info-edit/personal-info-edit.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { DisableControlModule } from '../../directives/disable-control/disable-control.module';
import { NumbersOnlyModule } from '../../directives/numbers-only/numbers-only.module';

@NgModule({
  declarations: [
    ProfileComponent,
    TopNavComponent,
    PersonalInfoComponent,
    PersonalInfoEditComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    DisableControlModule,
    NumbersOnlyModule
  ]
})

export class ProfileModule { }
