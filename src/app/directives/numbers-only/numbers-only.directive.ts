import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appNumbersOnly]'
})
export class NumbersOnlyDirective {

  numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  constructor() { }

  @HostListener('keypress', ['$event']) onKeyPress(event) {
    const evt = event as KeyboardEvent;

    if (!this.numbers.includes(evt.key)) {
      evt.preventDefault();
    }
  }

}
