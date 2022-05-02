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
      filter(([user, workExperience]) => user !== null),
      tap(([user, workExperience]) => {
        if (!user) {
          throw new Error('No user found');
        }

        const workExperiences: any[] = [];

        workExperience.forEach((doc) => {
          workExperiences.push({ ...doc.data(), id: doc.id  })
        })

        this.userInfo = {
          ...user,
          workExperiences
        };
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

}
