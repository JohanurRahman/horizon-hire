import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';

import { HotToastService } from '@ngneat/hot-toast';

import { User } from '@models';
import { UserService } from '../../services/user.service';
import { ImageUploadService } from '../../services/image-upload.service';
import { validateImageFile } from '../../utils/function';

@Component({
  selector: 'app-personal-info-edit',
  templateUrl: './personal-info-edit.component.html',
  styleUrls: ['./personal-info-edit.component.scss']
})

export class PersonalInfoEditComponent implements OnInit, OnDestroy {

  personalInfoForm: FormGroup;

  submitting = false;

  private destroy$ = new Subject<void>();

  imgUrl: string | ArrayBuffer | null;

  constructor(
    private fb: FormBuilder,
    private toast: HotToastService,
    private userService: UserService,
    private imageUploadService: ImageUploadService,
    private dialogRef: MatDialogRef<PersonalInfoEditComponent>,
    @Inject(MAT_DIALOG_DATA) private data: User,
  ) { }

  ngOnInit(): void {
    this.imgUrl = this.data?.photoURL || null;

    this.personalInfoForm = this.fb.group({
      photoURL: [ this.data?.photoURL || null ],
      firstName: [ this.data?.firstName || null, Validators.required],
      lastName: [ this.data?.lastName || null, Validators.required],
      title: [ this.data?.title || null ],
      age: [ this.data?.age || null, Validators.required]
    })

    this.dialogRef.disableClose = true;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  submit() {
    if (this.personalInfoForm.invalid) {
      return;
    }

    if (!this.personalInfoForm.controls['photoURL'].value) {
      this.toast.info('Please provide profile picture');
      return;
    }

    const formData = {
      ...this.personalInfoForm.getRawValue(),
      uid: this.data.uid
    };

    // If it's an url then only update profile
    if (!formData.photoURL || typeof formData.photoURL === 'string') {
      this.updateProfile(formData).pipe(
        tap(() => {
          this.dialogRef.close();
        }),
        takeUntil(this.destroy$)
      ).subscribe();
      return;
    }

    // if photoUrl type if File then upload image
    this.imageUploadService
      .uploadImage(formData.photoURL, `images/profile/${this.data.uid}`)
      .pipe(
        this.toast.observe({
          loading: 'Uploading profile image...',
          success: 'Image uploaded successfully',
          error: 'There was an error in uploading the image',
        }),
        switchMap((url) => {
          const data = { ...formData, uid: this.data.uid, photoURL: url };
          return this.updateProfile(data);
        }),
        tap(() => {
          this.dialogRef.close();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  updateProfile(data) {
    return this.userService.updateUser(data).pipe(
      this.toast.observe({
        loading: 'Updating profile...',
        success: 'Profile updated successfully',
        error: 'There was an error in updating the profile',
      }),
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
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
      this.personalInfoForm.controls['photoURL'].setValue(files[0]);

      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = () => this.imgUrl = reader.result;
    }
  }

}
