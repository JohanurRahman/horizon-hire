import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';

import { HotToastService } from '@ngneat/hot-toast';
import { MatDatepicker } from '@angular/material/datepicker';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { Moment } from 'moment';
import * as moment from 'moment';

import { ImageUploadService, WorkExperienceService } from '@services';
import { dateValidator, MY_DATE_FORMATS, validateImageFile } from '@utils';

import { WorkExperience } from '@models';

@Component({
  selector: 'app-work-experience-edit',
  templateUrl: './work-experience-edit.component.html',
  styleUrls: ['./work-experience-edit.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
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
    @Inject(MAT_DIALOG_DATA) private data: { experience?: WorkExperience, uid: string },
  ) { }

  ngOnInit(): void {
    this.companyLogoUrl = this.data.experience?.companyLogo || null;

    this.setWorkExperienceForm(this.data.experience);
    this.enableOrDisableEnDate();
  }

  setWorkExperienceForm(experience?: WorkExperience) {
    this.workExperienceForm = this.fb.group({
      title: [ experience?.title || null, Validators.required ],
      companyLogo: [ experience?.companyLogo || null ],
      companyName: [ experience?.companyName || null, Validators.required ],
      location: [ experience?.location || null ],
      currentRole: [ experience?.currentRole || false ],
      startDate: [
        experience?.startDate ? moment(experience.startDate, 'MMM YYYY') : null,
        Validators.required
      ],
      endDate: [
        experience?.endDate ? moment(experience.endDate, 'MMM YYYY') : null,
        Validators.required
      ],
      description: [ experience?.description || null, Validators.required ]
    },{ validators: dateValidator('startDate', 'endDate', 'currentRole') })
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

  enableOrDisableEnDate() {
    const currentRole = this.workExperienceForm.controls['currentRole'].value;

    if (currentRole) {
      this.workExperienceForm.controls['endDate'].disable();
      return;
    }

    this.workExperienceForm.controls['endDate'].enable();
  }

  submit() {
    if (this.workExperienceForm.invalid) {
      return;
    }

    if (!this.workExperienceForm.controls['companyLogo'].value) {
      this.toast.info('Please select a company logo');
      return;
    }

    const formData = this.constructFormData(this.workExperienceForm.getRawValue());

    const workExperienceId = this.data.experience?.id;

    if (workExperienceId) {
      this.updateWorkExperience(formData)
      return;
    }

    this.addWorkExperience(formData);
  }

  addWorkExperience(formData) {
    this.imageUploadService
      .uploadImage(formData.companyLogo, `images/company/${formData.companyLogo.name}`)
      .pipe(
        this.toast.observe({
          loading: 'Adding experience',
          success: 'Experience added successfully',
          error: 'There was an error while adding experience',
        }),
        switchMap((url) => {
          const data = { ...formData, companyLogo: url };
          return this.workExperienceService.addExperience(data, this.data.uid);
        }),
        switchMap(() => {
          return this.workExperienceService.getWorkExperiences(this.data.uid);
        }),
        tap((response) => {
          this.workExperienceService.updateExperienceSource(response);
          this.dialogRef.close();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  updateWorkExperience(formData) {
    if (!this.data.experience) {
      throw new Error('Work experience not found');
    }

    const workExperienceId = this.data.experience.id;
    const uid = this.data.uid;

    if (!formData.companyLogo || typeof formData.companyLogo === 'string') {
      this.updateApiCall(formData, workExperienceId, uid).pipe(
        takeUntil(this.destroy$)
      ).subscribe()
      return;
    }

    this.imageUploadService
      .uploadImage(formData.companyLogo, `images/company/${formData.companyLogo.name}`)
      .pipe(
        this.toast.observe({
          loading: 'Updating company logo ',
          success: 'Company Logo Updated successfully',
          error: 'There was an error while updating company logo',
        }),
        switchMap((url) => {
          const data = { ...formData, companyLogo: url };
          return this.updateApiCall(data, workExperienceId, uid);
        }),
        takeUntil(this.destroy$)
      ).subscribe();
  }

  updateApiCall(formData, workExperienceId, uid) {
    return this.workExperienceService.updateExperience(formData, workExperienceId, uid).pipe(
      this.toast.observe({
        loading: 'Updating work experience',
        success: 'Work experience updated successfully',
        error: 'There was an error while updating work experience',
      }),
      switchMap(() => {
        return this.workExperienceService.getWorkExperiences(uid);
      }),
      tap((response) => {
        this.workExperienceService.updateExperienceSource(response);
        this.dialogRef.close();
      })
    )
  }

  constructFormData(formData) {
    return {
      ...formData,
      startDate: moment(formData.startDate).format('MMM YYYY'),
      endDate: formData.currentRole ? null : moment(formData.endDate).format('MMM YYYY')
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

  ngOnDestroy() {
    this.destroy$.next();
  }

}
