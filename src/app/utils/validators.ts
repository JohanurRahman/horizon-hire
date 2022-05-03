import { FormGroup } from '@angular/forms';
import * as moment from 'moment';

export function dateValidator (startDate: any, endDate: any) {
  return (formGroup: FormGroup) => {
    const start = formGroup.controls[startDate];
    const end = formGroup.controls[endDate];

    if (!start.value || !end.value) {
      return;
    }

    if (moment(start.value).isAfter(end.value)) {
      start.setErrors({ invalidDate: true })
      return;
    }

    return start.setErrors(null);
  };
}
