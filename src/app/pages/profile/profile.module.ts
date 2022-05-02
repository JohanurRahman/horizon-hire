import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { NumbersOnlyModule } from '../../directives/numbers-only/numbers-only.module';
import { DisableControlModule } from '../../directives/disable-control/disable-control.module';

import { ProfileRoutingModule } from './profile-routing.module';

import { ProfileComponent } from './profile.component';
import { TopNavComponent } from '../../components/top-nav/top-nav.component';
import { PersonalInfoComponent } from '../../components/personal-info/personal-info.component';
import { PersonalInfoEditComponent } from '../../dialogs/personal-info-edit/personal-info-edit.component';
import { WorkExperienceComponent } from '../../components/work-experience/work-experience.component';
import { ProfilePrivacyComponent } from '../../components/profile-privacy/profile-privacy.component';
import { WorkExperienceEditComponent } from '../../dialogs/work-experience-edit/work-experience-edit.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ConfirmationComponent } from '../../dialogs/confirmation/confirmation.component';

@NgModule({
  declarations: [
    ProfileComponent,
    TopNavComponent,
    PersonalInfoComponent,
    PersonalInfoEditComponent,
    WorkExperienceComponent,
    ProfilePrivacyComponent,
    WorkExperienceEditComponent,
    ConfirmationComponent
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
    NumbersOnlyModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule
  ]
})

export class ProfileModule { }
