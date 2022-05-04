import { Component, Input } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { HotToastService } from '@ngneat/hot-toast';

import { UserService } from '../../services/user.service';
import { ShareProfileComponent } from '../../dialogs/share-profile/share-profile.component';

import { User } from '@models';

@Component({
  selector: 'app-profile-privacy',
  templateUrl: './profile-privacy.component.html',
  styleUrls: ['./profile-privacy.component.scss']
})

export class ProfilePrivacyComponent {

  @Input() userInfo: User;

  private destroy$ = new Subject<void>();

  shareProfileDialogRef: MatDialogRef<ShareProfileComponent>;

  tooltipContent = 'Enabling this will create a public URL of your profile';

  constructor(
    private dialog: MatDialog,
    private toast: HotToastService,
    private userService: UserService
  ) { }

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
    this.shareProfileDialogRef = this.dialog.open(ShareProfileComponent, {
      data: { ...this.userInfo },
      width: '800px',
      panelClass: 'dialog-edit',
      disableClose: true
    });
  }
}
