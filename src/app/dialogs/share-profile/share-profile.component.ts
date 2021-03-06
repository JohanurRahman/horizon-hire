import { Component, OnDestroy, OnInit } from '@angular/core';
import { EMPTY, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import { Clipboard } from '@angular/cdk/clipboard';

import { HotToastService } from '@ngneat/hot-toast';
import { MatDialogRef } from '@angular/material/dialog';

import { UserService } from '@services';
import { User } from '@models';

@Component({
  selector: 'app-share-profile',
  templateUrl: './share-profile.component.html',
  styleUrls: ['./share-profile.component.scss']
})

export class ShareProfileComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  userInfo: User;
  editingLink = false;
  profileUrl: string;
  locationOrigin: string;

  usernameControl: FormControl = new FormControl();

  constructor(
    private toast: HotToastService,
    private userService: UserService,
    private clipboard: Clipboard,
    private dialogRef: MatDialogRef<ShareProfileComponent>,
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

        this.locationOrigin = window.location.origin;
        this.profileUrl = this.locationOrigin + '/' + this.userInfo.username;

        this.usernameControl = new FormControl(this.userInfo.username, [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)?$/)]);
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

  editLink() {
    this.editingLink = !this.editingLink;
  }

  copyLink() {
    this.clipboard.copy(this.profileUrl);
    this.toast.success('Link copied');
  }

  updateProfileLink() {
    if (this.usernameControl.invalid) {
      return;
    }

    const profileName = this.usernameControl.value;

    const loadingToastRef = this.toast.loading('Checking if username is available...', {autoClose: true})
    this.userService.getByUserName(profileName).pipe(
      switchMap((response) => {
        loadingToastRef.close();
        if (response.empty) {
          return this.userService.updateUser({ uid: this.userInfo.uid, username: profileName }).pipe(
            this.toast.observe({
              loading: 'Updating profile link...',
              success: 'Profile link updated successfully',
              error: 'There was an error in updating profile link',
            }),
          )
        }
        this.toast.error('Username already exist')
        return EMPTY;
      }),
      tap(() => {
        this.editLink();
      }),
      takeUntil(this.destroy$)
    ).subscribe()
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

}
