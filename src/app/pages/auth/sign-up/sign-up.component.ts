import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})

export class SignUpComponent {

  signUpForm = new FormGroup({
    firstName: new FormControl(null, Validators.required),
    lastName: new FormControl(null, Validators.required),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.minLength(6)])
  });

  submitting = false;

  constructor(
    private router: Router,
    private toast: HotToastService
  ) {
  }

  submit() {
    if (this.signUpForm.invalid) {
      return;
    }

    this.submitting = true;
    const formData = this.signUpForm.value;
    console.log('FORM DATA: ', formData);
  }

  navigateToSignIn() {
    this.router.navigate(['/auth/sign-in']);
  }

}
