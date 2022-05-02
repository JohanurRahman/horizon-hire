import { Component, Input, OnInit } from '@angular/core';
import { PersonalInfoEditComponent } from '../../dialogs/personal-info-edit/personal-info-edit.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { WorkExperienceEditComponent } from '../../dialogs/work-experience-edit/work-experience-edit.component';
import { User } from '@models';

@Component({
  selector: 'app-work-experience',
  templateUrl: './work-experience.component.html',
  styleUrls: ['./work-experience.component.scss']
})
export class WorkExperienceComponent implements OnInit {

  @Input() userInfo: User;

  workExperienceEditDialogRef: MatDialogRef<WorkExperienceEditComponent>;

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openDialog() {
    this.workExperienceEditDialogRef = this.dialog.open(WorkExperienceEditComponent, {
      data: { uid: this.userInfo.uid },
      width: '700px',
      panelClass: 'dialog-edit',
      disableClose: false
    });
  }
}
