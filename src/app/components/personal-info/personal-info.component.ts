import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PersonalInfoEditComponent } from '../../dialogs/personal-info-edit/personal-info-edit.component';
import { User } from '@models';
import { ShareProfileComponent } from '../../dialogs/share-profile/share-profile.component';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss']
})
export class PersonalInfoComponent implements OnInit {

  @Input() userInfo: User;
  @Input() editable = true;

  personalInfoEditDialogRef: MatDialogRef<PersonalInfoEditComponent>;
  shareProfileDialogRef: MatDialogRef<ShareProfileComponent>;

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  editPersonalInfo() {
    this.personalInfoEditDialogRef = this.dialog.open(PersonalInfoEditComponent, {
      data: { ...this.userInfo },
      width: '500px',
      panelClass: 'dialog-edit',
      disableClose: false
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
