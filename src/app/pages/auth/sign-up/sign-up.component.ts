import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {
  }

  submit() {
    if (this.signUpForm.invalid) {
      return;
    }

    const formData = this.signUpForm.value;
    console.log('FORM DATA: ', formData);
  }

  navigateToLogin() {
    this.router.navigate(['/auth/login']);
  }

}
