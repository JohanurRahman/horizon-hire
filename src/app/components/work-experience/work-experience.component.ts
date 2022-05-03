import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PersonalInfoEditComponent } from '../../dialogs/personal-info-edit/personal-info-edit.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { WorkExperienceEditComponent } from '../../dialogs/work-experience-edit/work-experience-edit.component';
import { User, WorkExperience } from '@models';
import { ConfirmationComponent } from '../../dialogs/confirmation/confirmation.component';
import * as stream from 'stream';
import { WorkExperienceService } from '../../services/work-experience.service';
import { Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-work-experience',
  templateUrl: './work-experience.component.html',
  styleUrls: ['./work-experience.component.scss']
})
export class WorkExperienceComponent implements OnInit, OnDestroy {

  @Input() userInfo: User;

  private destroy$ = new Subject<void>();

  workExperiences: WorkExperience[];

  workExperienceEditDialogRef: MatDialogRef<WorkExperienceEditComponent>;
  confirmationDialogRef: MatDialogRef<ConfirmationComponent>;

  constructor(
    private dialog: MatDialog,
    private workExperienceService: WorkExperienceService
  ) { }

  ngOnInit(): void {
    this.workExperienceService.currentWorkExperiences.pipe(
      tap((workExperiences: WorkExperience[]) => {
        this.workExperiences = workExperiences;
      }),
      takeUntil(this.destroy$)
    ).subscribe();
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

  ngOnDestroy() {
    this.destroy$.next();
  }
}
