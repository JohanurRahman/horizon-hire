import { Component, OnInit } from '@angular/core';
import { PersonalInfoEditComponent } from '../../dialogs/personal-info-edit/personal-info-edit.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { WorkExperienceEditComponent } from '../../dialogs/work-experience-edit/work-experience-edit.component';

@Component({
  selector: 'app-work-experience',
  templateUrl: './work-experience.component.html',
  styleUrls: ['./work-experience.component.scss']
})
export class WorkExperienceComponent implements OnInit {

  workExperienceEditDialogRef: MatDialogRef<WorkExperienceEditComponent>;

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openDialog() {
    this.workExperienceEditDialogRef = this.dialog.open(WorkExperienceEditComponent, {
      width: '800px',
      panelClass: 'dialog-edit',
      disableClose: false
    });
  }
}
