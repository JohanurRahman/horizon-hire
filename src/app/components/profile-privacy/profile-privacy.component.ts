import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';

import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatDialog } from '@angular/material/dialog';

import { HotToastService } from '@ngneat/hot-toast';

import { ShareProfileComponent } from '../../dialogs/share-profile/share-profile.component';

import { User } from '@models';
import { UserService } from '@services';

@Component({
  selector: 'app-profile-privacy',
  templateUrl: './profile-privacy.component.html',
  styleUrls: ['./profile-privacy.component.scss']
})

export class ProfilePrivacyComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  userInfo: User;
  tooltipContent = 'Enabling this will create a public URL of your profile';

  constructor(
    private dialog: MatDialog,
    private toast: HotToastService,
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

  changeProfileVisibility(event: MatSlideToggleChange) {
    this.userService.updateUser({ uid: this.userInfo.uid, publicProfile: event.checked }).pipe(
      this.toast.observe({
        loading: 'Updating profile visibility...',
        success: 'Profile visibility updated successfully',
        error: 'There was an error in updating profile visibility',
      }),
      takeUntil(this.destroy$)
    ).subscribe()
  }

  openShareProfileDialog() {
    this.dialog.open(ShareProfileComponent, {
      width: '800px',
      panelClass: 'dialog-edit',
      disableClose: true
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
