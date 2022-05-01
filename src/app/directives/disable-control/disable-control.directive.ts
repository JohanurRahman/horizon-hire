import { Directive, Input, OnChanges } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appDisableControl]'
})

export class DisableControlDirective implements OnChanges {

  @Input('disableControl') disableControl: boolean;

  constructor( private ngControl : NgControl ) {
  }

  ngOnChanges(changes) {
    if (changes['disableControl'] && this.ngControl.control) {
      const action = this.disableControl ? 'disable' : 'enable';
      this.ngControl.control[action]();
    }
  }

}
