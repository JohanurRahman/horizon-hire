import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';

import { MatDialogRef } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';

import { User } from '@models';
import { validateImageFile } from '@utils';
import { UserService, ImageUploadService } from '@services';

@Component({
  selector: 'app-personal-info-edit',
  templateUrl: './personal-info-edit.component.html',
  styleUrls: ['./personal-info-edit.component.scss']
})

export class PersonalInfoEditComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  personalInfoForm: FormGroup;

  userInfo: User;
  imgUrl: string | ArrayBuffer | null;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private toast: HotToastService,
    private userService: UserService,
    private imageUploadService: ImageUploadService,
    private dialogRef: MatDialogRef<PersonalInfoEditComponent>,
  ) { }

  ngOnInit(): void {
    this.getCurrentUserInfo();
  }

  getCurrentUserInfo() {
    this.userService.currentUserInfoSource.pipe(
      tap((user: User | null) => {
        if (!user) {
          throw new Error('User info not found');
        }

        this.userInfo = user;
        this.imgUrl = this.userInfo?.profilePicture || null;
        this.initializeForm();
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  initializeForm() {
    this.personalInfoForm = this.fb.group({
      profilePicture: [ this.userInfo?.profilePicture || null ],
      firstName: [ this.userInfo?.firstName || null, Validators.required],
      lastName: [ this.userInfo?.lastName || null, Validators.required],
      title: [ this.userInfo?.title || null ],
      age: [ this.userInfo?.age || null, Validators.required]
    })
  }

  closeDialog() {
    this.dialogRef.close();
  }

  submit() {
    if (this.personalInfoForm.invalid) {
      return;
    }

    if (!this.personalInfoForm.controls['profilePicture'].value) {
      this.toast.info('Please provide profile picture');
      return;
    }

    const formData = {
      ...this.personalInfoForm.getRawValue(),
      uid: this.userInfo.uid
    };

    // If it's an url then only update profile
    if (!formData.profilePicture || typeof formData.profilePicture === 'string') {
      this.updateProfile(formData).pipe(
        takeUntil(this.destroy$)
      ).subscribe();
      return;
    }

    // if profilePicture type is file then upload image
    this.imageUploadService
      .uploadImage(formData.profilePicture, `images/profile/${this.userInfo.uid}`)
      .pipe(
        this.toast.observe({
          loading: 'Uploading profile image...',
          success: 'Image uploaded successfully',
          error: 'There was an error while uploading the image',
        }),
        switchMap((url) => {
          const data = { ...formData, uid: this.userInfo.uid, profilePicture: url };
          return this.updateProfile(data);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  updateProfile(data): Observable<void> {
    return this.userService.updateUser(data).pipe(
      this.toast.observe({
        loading: 'Updating profile...',
        success: 'Profile updated successfully',
        error: 'There was an error while updating the profile',
      }),
      tap(() => {
        this.dialogRef.close();
      }),
    );
  }

  uploadImage(event) {
    const files: FileList = event.target.files;

    if (files.length === 0) {
      return;
    }

    const isValidImage = validateImageFile(files[0].type);

    if (!isValidImage) {
      this.toast.info('Must be an image');
      return;
    }

    if (isValidImage) {
      this.personalInfoForm.controls['profilePicture'].setValue(files[0]);

      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = () => this.imgUrl = reader.result;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
  }


}
