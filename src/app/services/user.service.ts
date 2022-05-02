import { Injectable } from '@angular/core';
import { combineLatest, from, Observable, of, switchMap, tap } from 'rxjs';
import { collection, doc, docData, Firestore, getDocs, setDoc, updateDoc } from '@angular/fire/firestore';

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

  get currentUserProfile$(): Observable<any> {
    return this.authService.currentUser$.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }

        const user$ = docData(doc(this.firestore, 'users', user?.uid));
        const workExperience$ = this.getWorkExperiences(user.uid);

        return combineLatest([user$, workExperience$]);

        // this.getWorkExperiences(user.uid).pipe(
        //   tap((response) => {
        //     const data: any[] = []
        //     response.forEach((doc) => {
        //       const vm = {
        //         ...doc.data(),
        //         id: doc.id
        //       }
        //
        //       data.push(vm);
        //     })
        //
        //     console.log('DATA: ', data);
        //   })
        // ).subscribe()
        // const querySnapshot = from(getDocs(collection(this.firestore, `users/${user.uid}/work-experience`)));
        // querySnapshot.subscribe(res =>  res.forEach((doc) => console.log('DOC: ', doc.id)));

        // const ref = doc(this.firestore, 'users', user?.uid);
        // return docData(ref) as Observable<any>;
      })
    );
  }

  getWorkExperiences(uId: string) {
    return from(getDocs(collection(this.firestore, `users/${uId}/work-experience`)))
  }

  addUser(user: User): Observable<void> {
    const ref = doc(this.firestore, 'users', user.uid);
    return from(setDoc(ref, user));
  }

  updateUser(user: User): Observable<void> {
    const ref = doc(this.firestore, 'users', user.uid);
    return from(updateDoc(ref, { ...user }));
  }
}
