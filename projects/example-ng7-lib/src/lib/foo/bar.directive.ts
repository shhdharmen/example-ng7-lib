import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[enlBar]'
})
export class BarDirective {
  @Input('enlBar') barName: string;
  constructor() { }

}
