import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';

import { Moment } from 'moment';
import * as moment from 'moment';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDatepicker } from '@angular/material/datepicker';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { validateImageFile } from '../../utils/function';
import { HotToastService } from '@ngneat/hot-toast';
import { User } from '@models';
import { ImageUploadService } from '../../services/image-upload.service';
import { WorkExperienceService } from '../../services/work-experience.service';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'MMMM, YYYY'
  },
};


@Component({
  selector: 'app-work-experience-edit',
  templateUrl: './work-experience-edit.component.html',
  styleUrls: ['./work-experience-edit.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})

export class WorkExperienceEditComponent implements OnInit {

  private destroy$ = new Subject<void>();

  workExperienceForm: FormGroup;

  companyLogoUrl: string | ArrayBuffer | null;

  constructor(
    private fb: FormBuilder,
    private toast: HotToastService,
    private imageUploadService: ImageUploadService,
    private workExperienceService: WorkExperienceService,
    private dialogRef: MatDialogRef<WorkExperienceEditComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
  ) { }

  ngOnInit(): void {
    this.workExperienceForm = this.fb.group({
      title: [ null, Validators.required ],
      companyLogo: [ null ],
      companyName: [ null, Validators.required ],
      location: [ null ],
      current: [ false ],
      startDate: [ null, Validators.required ],
      endDate: [ null, Validators.required ],
      description: [ null, Validators.required ]
    })

    this.dialogRef.disableClose = true;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<any>, type: 'start' | 'end') {
    if (type === 'start') {
      this.workExperienceForm.controls['startDate'].setValue(normalizedMonthAndYear);
    }

    if (type === 'end') {
      this.workExperienceForm.controls['endDate'].setValue(normalizedMonthAndYear);
    }
    datepicker.close();
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  onCheck(checked: boolean) {
    this.workExperienceForm.controls['current'].setValue(checked);

    if (checked) {
      this.workExperienceForm.controls['endDate'].disable();
      return;
    }

    this.workExperienceForm.controls['endDate'].enable();
  }

  submit() {
    if (this.workExperienceForm.invalid) {
      return;
    }

    const formData = this.constructFormData(this.workExperienceForm.getRawValue());

    this.imageUploadService
      .uploadImage(formData.companyLogo, `images/company/${formData.companyLogo.name}`)
      .pipe(
        this.toast.observe({
          loading: 'Saving Experience',
          success: 'Experience successfully',
          error: 'There was an error while saving experience',
        }),
        switchMap((url) => {
          console.log('URL: ', url)
          const data = { ...formData, companyLogo: url };
          return this.workExperienceService.addExperience(data, this.data.uid);
        }),
        tap(() => {
          this.dialogRef.close();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  constructFormData(formData) {
    return {
      ...formData,
      startDate: moment(formData.startDate).format('MMMM-YYYY'),
      endDate: formData.current ? null : moment(formData.endDate).format('MMMM-YYYY')
    }
  }

  selectCompanyLogo(event) {
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
      this.workExperienceForm.controls['companyLogo'].setValue(files[0]);

      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = () => this.companyLogoUrl = reader.result;
    }
  }
}