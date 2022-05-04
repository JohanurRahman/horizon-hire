import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { delay, Subject, switchMap, takeUntil, tap } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';

import { WorkExperienceEditComponent } from '../../dialogs/work-experience-edit/work-experience-edit.component';
import { ConfirmationComponent } from '../../dialogs/confirmation/confirmation.component';

import { User, WorkExperience } from '@models';
import { UserService, WorkExperienceService } from '@services';
import { QuerySnapshot } from '@firebase/firestore';
import { DocumentData } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-work-experience',
  templateUrl: './work-experience.component.html',
  styleUrls: ['./work-experience.component.scss']
})

export class WorkExperienceComponent implements OnInit, OnDestroy {

  @Input() editable = true;

  private destroy$ = new Subject<void>();

  workExperiences: WorkExperience[];
  userInfo: User;

  loading = true;

  constructor(
    private dialog: MatDialog,
    private userService: UserService,
    private workExperienceService: WorkExperienceService
  ) { }

  ngOnInit() {
    this.getCurrentUserInfo();
    this.getCurrentWorkExperiences();
  }

  getCurrentUserInfo() {
    this.userService.currentUserInfoSource.pipe(
      switchMap((user: User | null) => {
        if (!user) {
          throw new Error('User info not found');
        }

        this.userInfo = user;
        return this.workExperienceService.getWorkExperiences(user.uid);
      }),
      tap((workExperience: QuerySnapshot<DocumentData>) => {
        this.workExperienceService.updateExperienceSource(workExperience);
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  getCurrentWorkExperiences() {
    this.workExperienceService.currentWorkExperiences.pipe(
      tap((workExperiences: WorkExperience[]) => {
        this.workExperiences = workExperiences;
      }),
      delay(400),
      tap(() => {
        this.loading = false;
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  add() {
    this.openDialog();
  }

  update(workExperience: WorkExperience) {
    this.openDialog(workExperience);
  }

  openDialog(experience?: WorkExperience) {
    const data = {
      uid: this.userInfo.uid,
      experience
    }

    this.dialog.open(WorkExperienceEditComponent, {
      data: data,
      width: '700px',
      panelClass: 'dialog-edit',
      disableClose: true
    });
  }

  delete(id: string) {
    this.dialog.open(ConfirmationComponent, {
      data: { id, uid: this.userInfo.uid },
      width: '600px',
      panelClass: 'dialog-edit',
      disableClose: true
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
