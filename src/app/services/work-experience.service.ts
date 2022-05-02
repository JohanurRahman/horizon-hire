import { Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkExperienceService {

  constructor(
    private firestore: Firestore
  ) {}

  addExperience(experience: any, uid: string): Observable<any> {
    const userSubCollection = collection(this.firestore, `users/${uid}/work-experience`);
    return from(addDoc(userSubCollection, experience));
  }

  deleteExperience(id: string, uid: string): Observable<void> {
    const ref = collection(this.firestore, `users/${uid}/work-experience`);
    return from(deleteDoc(doc(ref, id)));
  }

}
