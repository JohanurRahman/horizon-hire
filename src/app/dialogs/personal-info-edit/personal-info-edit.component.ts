import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-personal-info-edit',
  templateUrl: './personal-info-edit.component.html',
  styleUrls: ['./personal-info-edit.component.scss']
})
export class PersonalInfoEditComponent implements OnInit {

  personalInfoForm: FormGroup;

  submitting = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PersonalInfoEditComponent>
  ) { }

  ngOnInit(): void {
    this.personalInfoForm = this.fb.group({
      firstName: [ null, Validators.required],
      lastname: [ null, Validators.required],
      title: [ null ],
      age: [ null, Validators.required]
    })

    this.dialogRef.disableClose = true;
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
