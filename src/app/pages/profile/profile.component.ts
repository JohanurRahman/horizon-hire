import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '@models';
import { HotToastService } from '@ngneat/hot-toast';
import { filter, Subject, takeUntil, tap } from 'rxjs';

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
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.userService.currentUserProfile$.pipe(
      this.toast.observe({
        success: 'User information loaded',
        loading: 'Loading user information',
        error: ({ message }) => `${message}`
      }),
      filter(user => user !== null),
      tap((user: User | null) => {
        if (!user) {
          throw new Error('No user found');
        }
        this.userInfo = user;
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

}
