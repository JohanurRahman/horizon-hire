import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, of, switchMap, tap, combineLatest } from 'rxjs';

import { HotToastService } from '@ngneat/hot-toast';
import { Firestore } from '@angular/fire/firestore';

import { User, WorkExperience } from '@models';
import { UserService, WorkExperienceService } from '@services';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.scss']
})

export class PublicProfileComponent implements OnInit {

  userInfo: User;
  workExperience: WorkExperience[] = [];

  loading = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private toast: HotToastService,
    private firestore: Firestore,
    private userService: UserService,
    private workExperienceService: WorkExperienceService
  ) { }

  ngOnInit(): void {
    const loadingRef = this.toast.loading('Loading profile...');

    const username = this.activatedRoute.snapshot.params['username'];

    this.userService.getByUserName(username).pipe(
      switchMap((snapshot) => {
        this.userInfo = snapshot.docs[0]?.data() as User;

        if(!this.userInfo || !this.userInfo.publicProfile) {
          return EMPTY;
        }
        const workExperience$ = this.workExperienceService.getWorkExperiences(this.userInfo.uid);

        return combineLatest([of(this.userInfo), workExperience$])
      }),
      tap({
        next: ([userInfo, workExperience]) => {
          this.userService.updateUserInfoSource(userInfo);
          this.workExperienceService.updateExperienceSource(workExperience)
        },
        complete: () => {
          this.loading = false;
          loadingRef.close();
        }
      })
    ).subscribe()
  }

}
