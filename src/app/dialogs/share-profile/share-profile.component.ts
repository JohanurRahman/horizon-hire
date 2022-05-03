import { Component, Inject, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-share-profile',
  templateUrl: './share-profile.component.html',
  styleUrls: ['./share-profile.component.scss']
})

export class ShareProfileComponent implements OnInit {

  locationOrigin: string;
  username = 'johanur.rahman'

  constructor(
    private toast: HotToastService,
    private dialogRef: MatDialogRef<ShareProfileComponent>
  ) { }

  ngOnInit(): void {
    this.locationOrigin = window.location.origin;
    console.log('LOCATION: ', window.location);
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
