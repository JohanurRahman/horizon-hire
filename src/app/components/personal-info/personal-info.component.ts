import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PersonalInfoEditComponent } from '../../dialogs/personal-info-edit/personal-info-edit.component';
import { User } from '@models';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss']
})
export class PersonalInfoComponent implements OnInit {

  @Input() userInfo: User;

  personalInfoEditDialogRef: MatDialogRef<PersonalInfoEditComponent>;

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openDialog() {
    this.personalInfoEditDialogRef = this.dialog.open(PersonalInfoEditComponent, {
      data: { ...this.userInfo },
      width: '500px',
      panelClass: 'dialog-edit',
      disableClose: false
    });
  }

}
