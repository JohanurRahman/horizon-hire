import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '@models';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

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
    ).subscribe((user) => {
      if (!user) {
        throw new Error('No user found');
      }

      this.userInfo = user;
    });
  }

}
