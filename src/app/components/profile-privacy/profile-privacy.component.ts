import { Component, Input, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { UserService } from '../../services/user.service';
import { User } from '@models';
import { HotToastService } from '@ngneat/hot-toast';
import { Subject, takeUntil } from 'rxjs';
import { ShareProfileComponent } from '../../dialogs/share-profile/share-profile.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-profile-privacy',
  templateUrl: './profile-privacy.component.html',
  styleUrls: ['./profile-privacy.component.scss']
})
export class ProfilePrivacyComponent implements OnInit {

  @Input() userInfo: User;

  private destroy$ = new Subject<void>();

  shareProfileDialogRef: MatDialogRef<ShareProfileComponent>;

  constructor(
    private dialog: MatDialog,
    private toast: HotToastService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
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
    this.shareProfileDialogRef = this.dialog.open(ShareProfileComponent, {
      data: { ...this.userInfo },
      width: '800px',
      panelClass: 'dialog-edit',
      disableClose: true
    });
  }
}
