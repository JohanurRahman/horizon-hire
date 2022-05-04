import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { Router } from '@angular/router';

import { HotToastService } from '@ngneat/hot-toast';

import { User } from '@models';
import { UserService, AuthService } from '@services';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})

export class TopNavComponent implements OnInit, OnDestroy {

  userInfo: User;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private toast: HotToastService,
    private authService: AuthService,
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

  logout() {
    this.authService.logout().pipe(
      this.toast.observe({
        success: 'Logged out successfully',
        loading: 'Logging out...',
        error: ({ message }) => `${message}`
      }),
      tap(() => {
        this.router.navigate(['/auth']);
      }),
      takeUntil(this.destroy$)
    ).subscribe()
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
