import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-work-experience-edit',
  templateUrl: './work-experience-edit.component.html',
  styleUrls: ['./work-experience-edit.component.scss']
})

export class WorkExperienceEditComponent implements OnInit {

  private destroy$ = new Subject<void>();

  constructor(
    private dialogRef: MatDialogRef<WorkExperienceEditComponent>
  ) { }

  ngOnInit(): void {
    this.dialogRef.disableClose = true;
  }

  closeDialog() {
    this.dialogRef.close();
  }


  ngOnDestroy() {
    this.destroy$.next();
  }

}
