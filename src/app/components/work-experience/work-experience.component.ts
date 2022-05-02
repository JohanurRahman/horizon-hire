import { Component, Input, OnInit } from '@angular/core';
import { PersonalInfoEditComponent } from '../../dialogs/personal-info-edit/personal-info-edit.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { WorkExperienceEditComponent } from '../../dialogs/work-experience-edit/work-experience-edit.component';
import { User } from '@models';
import { ConfirmationComponent } from '../../dialogs/confirmation/confirmation.component';
import * as stream from 'stream';

@Component({
  selector: 'app-work-experience',
  templateUrl: './work-experience.component.html',
  styleUrls: ['./work-experience.component.scss']
})
export class WorkExperienceComponent implements OnInit {

  @Input() userInfo: User;

  workExperienceEditDialogRef: MatDialogRef<WorkExperienceEditComponent>;
  confirmationDialogRef: MatDialogRef<ConfirmationComponent>;

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openDialog() {
    this.workExperienceEditDialogRef = this.dialog.open(WorkExperienceEditComponent, {
      data: { uid: this.userInfo.uid },
      width: '700px',
      panelClass: 'dialog-edit'
    });
  }

  openConfirmDialog(id: string) {
    this.confirmationDialogRef = this.dialog.open(ConfirmationComponent, {
      data: { id, uid: this.userInfo.uid },
      width: '600px',
      panelClass: 'dialog-edit'
    });
  }
}
