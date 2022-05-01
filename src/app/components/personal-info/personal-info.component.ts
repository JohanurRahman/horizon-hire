import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PersonalInfoEditComponent } from '../../dialogs/personal-info-edit/personal-info-edit.component';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss']
})
export class PersonalInfoComponent implements OnInit {

  personalInfoEditDialogRef: MatDialogRef<PersonalInfoEditComponent>;

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openDialog() {
    this.personalInfoEditDialogRef = this.dialog.open(PersonalInfoEditComponent, {
      width: '500px',
      panelClass: 'dialog-edit',
      disableClose: false
    });
  }

}
