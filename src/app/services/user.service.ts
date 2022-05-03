import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, from, Observable, of, switchMap } from 'rxjs';
import {
  collection,
  doc,
  docData,
  Firestore,
  getDoc,
  getDocs, limit,
  query,
  setDoc,
  updateDoc,
  where
} from '@angular/fire/firestore';

import { User, WorkExperience } from '@models';
import { AuthService } from './auth.service';
import { WorkExperienceService } from './work-experience.service';
import * as moment from 'moment';
import { QuerySnapshot } from '@firebase/firestore';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private userInfoSource = new BehaviorSubject<User | null>(null);
  currentUserInfoSource = this.userInfoSource.asObservable();

  constructor(
    private firestore: Firestore,
    private authService: AuthService,
    private workExperienceService: WorkExperienceService
  ) {}

  get currentUserProfile$(): Observable<any> {
    return this.authService.currentUser$.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }

        const user$ = docData(doc(this.firestore, 'users', user?.uid));
        const workExperience$ = this.workExperienceService.getWorkExperiences(user.uid);

        return combineLatest([user$, workExperience$]);
      })
    );
  }

  addUser(user: User): Observable<void> {
    const ref = doc(this.firestore, 'users', user.uid);
    return from(setDoc(ref, user));
  }

  updateUser(user: User): Observable<void> {
    const ref = doc(this.firestore, 'users', user.uid);
    return from(updateDoc(ref, { ...user }));
  }

  updateUserInfoSource(userInfo: User) {
    this.userInfoSource.next(userInfo)
  }

  getByUserName(username: string): Observable<QuerySnapshot> {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('username', "==", username), limit(1));
    return from(getDocs(q));
  }
}
