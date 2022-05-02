export interface User {
  uid: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  title?: string;
  photoURL?: string;
  workExperiences?: WorkExperience[];
}

export interface WorkExperience {
  id: string;
  title: string;
  companyLogo?: string;
  companyName: string;
  current: boolean;
  description: string;
  startDate: string;
  endDate: string;
  location?: string;
}
