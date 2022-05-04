import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { PersonalInfoEditComponent } from '../../dialogs/personal-info-edit/personal-info-edit.component';
import { ShareProfileComponent } from '../../dialogs/share-profile/share-profile.component';

import { User } from '@models';
import { UserService } from '@services';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss']
})

export class PersonalInfoComponent implements OnInit, OnDestroy {

  @Input() editable = true;

  private destroy$ = new Subject<void>();

  userInfo: User;

  personalInfoEditDialogRef: MatDialogRef<PersonalInfoEditComponent>;
  shareProfileDialogRef: MatDialogRef<ShareProfileComponent>;

  constructor(
    private dialog: MatDialog,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.getCurrentUserInfo();
  }

  getCurrentUserInfo() {
    this.userService.currentUserInfoSource.pipe(
      tap((user: User | null) => {
        if (!user) {
          throw new Error('User info not found');
        }

        this.userInfo = user;
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }


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

  ngOnDestroy() {
    this.destroy$.next();
  }

}
