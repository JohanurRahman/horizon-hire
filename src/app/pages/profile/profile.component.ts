import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, Subject, takeUntil, tap } from 'rxjs';

import { HotToastService } from '@ngneat/hot-toast';
import { Firestore } from '@angular/fire/firestore';

import { UserService, WorkExperienceService } from '@services';
import { DocumentData } from '@angular/fire/compat/firestore';
import { User } from '@models';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  loading = true;

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
      filter((response: DocumentData | null) => response !== null),
      tap((response: DocumentData | null) => {
        const user = response as User;

        if (!user) {
          throw new Error('No user found');
        }

        this.loading = false;

        this.userService.updateUserInfoSource(user);
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

}
