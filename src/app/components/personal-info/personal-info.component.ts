import { Component, Input } from '@angular/core';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { PersonalInfoEditComponent } from '../../dialogs/personal-info-edit/personal-info-edit.component';
import { ShareProfileComponent } from '../../dialogs/share-profile/share-profile.component';

import { User } from '@models';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss']
})

export class PersonalInfoComponent {

  @Input() userInfo: User;
  @Input() editable = true;

  personalInfoEditDialogRef: MatDialogRef<PersonalInfoEditComponent>;
  shareProfileDialogRef: MatDialogRef<ShareProfileComponent>;

  constructor(private dialog: MatDialog) { }

  editPersonalInfo() {
    this.personalInfoEditDialogRef = this.dialog.open(PersonalInfoEditComponent, {
      data: { ...this.userInfo },
      width: '500px',
      panelClass: 'dialog-edit',
      disableClose: true
    });
  }

  shareProfile() {
    this.shareProfileDialogRef = this.dialog.open(ShareProfileComponent, {
      data: { ...this.userInfo },
      width: '800px',
      panelClass: 'dialog-edit',
      disableClose: true
    });
  }

}
