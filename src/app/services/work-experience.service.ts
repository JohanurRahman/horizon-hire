import { Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, Firestore, getDocs, updateDoc } from '@angular/fire/firestore';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { User, WorkExperience } from '@models';
import * as moment from 'moment';
import { QuerySnapshot } from '@firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class WorkExperienceService {

  private workExperiencesSource = new BehaviorSubject<WorkExperience[]>([]);
  currentWorkExperiences = this.workExperiencesSource.asObservable();

  constructor(
    private firestore: Firestore
  ) {}


  updateExperienceSource(workExperiences) {
    const data: WorkExperience[] = [];
    workExperiences.forEach((doc) => {
      data.push({ ...doc.data(), id: doc.id  })
    })

    data.sort((a, b) => {
      return moment(b.startDate, 'MMM YYYY').diff(moment(a.startDate, 'MMM YYYY'))
    })
    this.workExperiencesSource.next(data)
  }

  addExperience(experience: any, uid: string): Observable<any> {
    const userSubCollection = collection(this.firestore, `users/${uid}/work-experience`);
    return from(addDoc(userSubCollection, experience));
  }

  updateExperience(experience: any, id: string, uid: string): Observable<any> {
    const ref = collection(this.firestore, `users/${uid}/work-experience`);
    const document = doc(ref, id);
    return from(updateDoc(document, { ...experience }));
  }

  getWorkExperiences(uId: string) {
    return from(getDocs(collection(this.firestore, `users/${uId}/work-experience`)))
  }

  deleteExperience(id: string, uid: string): Observable<void> {
    const ref = collection(this.firestore, `users/${uid}/work-experience`);
    return from(deleteDoc(doc(ref, id)));
  }

}
