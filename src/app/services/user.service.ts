import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, of, switchMap } from 'rxjs';
import { collection, doc, docData, Firestore, getDocs, limit, query, setDoc, updateDoc, where } from '@angular/fire/firestore';

import { AuthService } from './auth.service';
import { WorkExperienceService } from './work-experience.service';
import { QuerySnapshot } from '@firebase/firestore';

import { User } from '@models';
import { DocumentData } from '@angular/fire/compat/firestore';

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

  get currentUserProfile$(): Observable<DocumentData| null> {
    return this.authService.currentUser$.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }

        return docData(doc(this.firestore, 'users', user?.uid));
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
