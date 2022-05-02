import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

import { Moment } from 'moment';
import * as moment from 'moment';

import { MatDialogRef } from '@angular/material/dialog';
import { MatDatepicker } from '@angular/material/datepicker';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

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

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<WorkExperienceEditComponent>
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

    console.log('DATA: ', this.workExperienceForm.value);
    console.log('GET RAW: ', this.workExperienceForm.getRawValue());
  }
}
