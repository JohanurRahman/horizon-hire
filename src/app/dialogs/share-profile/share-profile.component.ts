import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '@models';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Subject, takeUntil, tap } from 'rxjs';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-share-profile',
  templateUrl: './share-profile.component.html',
  styleUrls: ['./share-profile.component.scss']
})

export class ShareProfileComponent implements OnInit, OnDestroy {

  locationOrigin: string;
  username = 'johanur.rahman';

  private destroy$ = new Subject<void>();

  userInfo: User;

  constructor(
    private toast: HotToastService,
    private userService: UserService,
    private dialogRef: MatDialogRef<ShareProfileComponent>,
  ) { }

  ngOnInit(): void {
    this.locationOrigin = window.location.origin;

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

  changeProfileVisibility(checked: boolean) {
    this.userService.updateUser({ uid: this.userInfo.uid, publicProfile: checked }).pipe(
      this.toast.observe({
        loading: 'Updating profile visibility...',
        success: 'Profile visibility updated successfully',
        error: 'There was an error in updating profile visibility',
      }),
      takeUntil(this.destroy$)
    ).subscribe()
  }

  closeDialog() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

}
