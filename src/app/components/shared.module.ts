import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

/* Material */
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { ClipboardModule } from '@angular/cdk/clipboard'

/* Directives */
import { DisableControlModule } from '../directives/disable-control/disable-control.module';
import { NumbersOnlyModule } from '../directives/numbers-only/numbers-only.module';

/* Components */
import { TopNavComponent } from './top-nav/top-nav.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { PersonalInfoEditComponent } from '../dialogs/personal-info-edit/personal-info-edit.component';
import { WorkExperienceComponent } from './work-experience/work-experience.component';
import { ProfilePrivacyComponent } from './profile-privacy/profile-privacy.component';
import { WorkExperienceEditComponent } from '../dialogs/work-experience-edit/work-experience-edit.component';
import { ConfirmationComponent } from '../dialogs/confirmation/confirmation.component';
import { ShareProfileComponent } from '../dialogs/share-profile/share-profile.component';


@NgModule({
  declarations: [
    TopNavComponent,
    PersonalInfoComponent,
    WorkExperienceComponent,
    ProfilePrivacyComponent,
    PersonalInfoEditComponent,
    WorkExperienceEditComponent,
    ConfirmationComponent,
    ShareProfileComponent
  ],
  exports: [
    TopNavComponent,
    PersonalInfoComponent,
    WorkExperienceComponent,
    ProfilePrivacyComponent,
    PersonalInfoEditComponent,
    WorkExperienceEditComponent,
    ConfirmationComponent,
    ShareProfileComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    DisableControlModule,
    NumbersOnlyModule,

    ClipboardModule,

    MatInputModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule
  ]
})

export class SharedModule { }
