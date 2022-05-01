import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '@models';
import { UserService } from '../../services/user.service';
import { HotToastService } from '@ngneat/hot-toast';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { ImageUploadService } from '../../services/image-upload.service';

@Component({
  selector: 'app-personal-info-edit',
  templateUrl: './personal-info-edit.component.html',
  styleUrls: ['./personal-info-edit.component.scss']
})
export class PersonalInfoEditComponent implements OnInit, OnDestroy {

  personalInfoForm: FormGroup;

  submitting = false;

  private destroy$ = new Subject<void>();

  imgURL: any;

  constructor(
    private fb: FormBuilder,
    private toast: HotToastService,
    private userService: UserService,
    private imageUploadService: ImageUploadService,
    private dialogRef: MatDialogRef<PersonalInfoEditComponent>,
    @Inject(MAT_DIALOG_DATA) private data: User,
  ) { }

  ngOnInit(): void {
    this.personalInfoForm = this.fb.group({
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

    const formData = {
      ...this.personalInfoForm.getRawValue(),
      uid: this.data.uid
    };

    this.userService.updateUser(formData).pipe(
      this.toast.observe({
          loading: 'Updating profile...',
          success: 'Profile updated successfully',
          error: 'There was an error in updating the profile',
        }
      ),
      tap(() => {
        this.dialogRef.close();
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
  }


  uploadImage(event) {
    // const files: FileList = event.target.files;
    //
    // if (files.length === 0) {
    //   return;
    // }
    //
    // const isValidImage = this.validateImageFile(files[0].type);
    //
    // if (isValidImage) {
    //   const reader = new FileReader();
    //   reader.readAsDataURL(files[0]);
    //   reader.onload = () => this.imgURL = reader.result;
    // }

    this.imageUploadService
      .uploadImage(event.target.files[0], `images/profile/${this.data.uid}`)
      .pipe(
        this.toast.observe({
          loading: 'Uploading profile image...',
          success: 'Image uploaded successfully',
          error: 'There was an error in uploading the image',
        }),
        switchMap((photoURL) => {
          const data = { uid: this.data.uid, photoURL };
          return this.userService.updateUser(data);
        })
      )
      .subscribe();
  }

  validateImageFile(fileType) {
    const pattern = /image\/*/;

    if (!fileType.match(pattern)) {
      this.toast.info('Must be an image');
      return false;
    }
    return true;
  }
}
