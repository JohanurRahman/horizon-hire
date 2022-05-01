import { Injectable } from '@angular/core';
import { from, Observable, of, switchMap } from 'rxjs';
import { doc, docData, Firestore, setDoc } from '@angular/fire/firestore';

import { User } from '@models';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) {}

  get currentUserProfile$(): Observable<User | null> {
    console.log('CALLED: ')
    return this.authService.currentUser$.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }

        const ref = doc(this.firestore, 'users', user?.uid);
        return docData(ref) as Observable<any>;
      })
    );
  }

  addUser(user: User): Observable<void> {
    const ref = doc(this.firestore, 'users', user.uid);
    return from(setDoc(ref, user));
  }
}
