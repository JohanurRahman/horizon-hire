import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, Subject, takeUntil, tap } from 'rxjs';

import { HotToastService } from '@ngneat/hot-toast';
import { Firestore } from '@angular/fire/firestore';

import { UserService } from '../../services/user.service';
import { WorkExperienceService } from '../../services/work-experience.service';

import { User } from '@models';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  userInfo: User;

  constructor(
    private toast: HotToastService,
    private firestore: Firestore,
    private userService: UserService,
    private workExperienceService: WorkExperienceService
  ) { }

  ngOnInit(): void {
    this.userService.currentUserProfile$.pipe(
      this.toast.observe({
        success: 'User information loaded',
        loading: 'Loading user information',
        error: ({ message }) => `${message}`
      }),
      filter((response) => response !== null),
      tap(([user, workExperience]) => {
        if (!user) {
          throw new Error('No user found');
        }

        this.userInfo = user;
        this.userService.updateUserInfoSource(user);

        this.workExperienceService.updateExperienceSource(workExperience);
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

}
