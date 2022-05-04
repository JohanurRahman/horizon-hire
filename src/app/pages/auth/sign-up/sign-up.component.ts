import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { HotToastService } from '@ngneat/hot-toast';

import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';

import { User } from '@models';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})

export class SignUpComponent {

  private destroy$ = new Subject<void>();

  submitting = false;

  signUpForm = new FormGroup({
    firstName: new FormControl(null, Validators.required),
    lastName: new FormControl(null, Validators.required),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.minLength(6)])
  });


  constructor(
    private router: Router,
    private toast: HotToastService,
    private authService: AuthService,
    private userService: UserService,
  ) {
  }

  submit() {
    if (this.signUpForm.invalid) {
      return;
    }

    this.submitting = true;

    const { email, password } = this.signUpForm.value;

    this.authService.signUp(email, password).pipe(
      this.toast.observe({
        success: 'Congrats! You are all signed up',
        loading: 'Signing up...',
        error: ({ message }) => `${message}`,
      }),
      switchMap(({ user: { uid }}) => {
        const data = this.constructUserData(uid, this.signUpForm.value);
        return this.userService.addUser(data)
      }),
      tap({
        next: (res) => {
          this.router.navigate(['/profile']);
        },
        error: () => {
          this.submitting = false;
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  constructUserData(uid, formData): User {
    const name = formData.firstName.toLowerCase().split(' ')[0];
    const username = name.concat('.', uid);
    return {
      uid,
      username,
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      publicProfile: false
    }
  }

  navigateToSignIn() {
    this.router.navigate(['/auth/sign-in']);
  }

}
