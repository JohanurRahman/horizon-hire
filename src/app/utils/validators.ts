import { FormGroup } from '@angular/forms';
import * as moment from 'moment';

export function dateValidator (startDate: string, endDate: string, currentRole: string) {
  return (formGroup: FormGroup) => {
    const start = formGroup.controls[startDate];
    const end = formGroup.controls[endDate];
    const current = formGroup.controls[currentRole];

    if (!start.value || !end.value) {
      return;
    }

    if (current.value) {
      return start.setErrors(null);
    }

    if (moment(start.value).isAfter(end.value)) {
      start.setErrors({ invalidDate: true })
      return;
    }

    return start.setErrors(null);
  };
}

export function validateImageFile(fileType) {
  const pattern = /image\/*/;

  return fileType.match(pattern);
}
