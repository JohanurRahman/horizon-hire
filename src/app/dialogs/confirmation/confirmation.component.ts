import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { QuerySnapshot } from '@firebase/firestore';

import { WorkExperienceService } from '@services';

interface ConfirmDialogData {
  id: string;
  uid: string;
}

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})

export class ConfirmationComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  submitting = false;

  constructor(
    private toast: HotToastService,
    private workExperienceService: WorkExperienceService,
    private dialogRef: MatDialogRef<ConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) private data: ConfirmDialogData,
    ) { }

  ngOnInit() {
    this.dialogRef.disableClose = true;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  delete() {
    this.submitting = true;

    const { id, uid } = this.data;
    this.workExperienceService.deleteExperience(id, uid).pipe(
      this.toast.observe({
        loading: 'Deleting work experience...',
        success: 'Work experience successfully',
        error: 'There was an error in deleting work experience',
      }),
      switchMap(() => {
        return this.workExperienceService.getWorkExperiences(uid);
      }),
      tap({
        next: (response: QuerySnapshot) => {
          this.workExperienceService.updateExperienceSource(response);
          this.dialogRef.close();
        },
        error: () => {
          this.submitting = false;
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe()
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

}
