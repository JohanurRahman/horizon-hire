import { Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { Firestore } from '@angular/fire/firestore';
import { UserService } from '../../services/user.service';
import { WorkExperienceService } from '../../services/work-experience.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { User, WorkExperience } from '@models';
import { snapshotChanges } from '@angular/fire/compat/database';
import { QuerySnapshot } from '@firebase/firestore';
import * as moment from 'moment';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.scss']
})
export class PublicProfileComponent implements OnInit {

  userInfo: User;
  workExperience: WorkExperience[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private toast: HotToastService,
    private firestore: Firestore,
    private userService: UserService,
    private workExperienceService: WorkExperienceService
  ) { }

  ngOnInit(): void {
    const username = this.activatedRoute.snapshot.params['username'];
    this.userService.getByUserName(username).pipe(
      switchMap((snapshot) => {
        this.userInfo = snapshot.docs[0]?.data() as User;

        if(!this.userInfo) {
          throw new Error('No user found');
        }

        return this.workExperienceService.getWorkExperiences(this.userInfo.uid);
      }),
      tap((snapshot: QuerySnapshot) => {
        this.workExperienceService.updateExperienceSource(snapshot)
      })
    ).subscribe()
  }

}
