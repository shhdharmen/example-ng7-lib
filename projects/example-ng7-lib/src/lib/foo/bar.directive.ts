import { Directive, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[enlBar]'
})
export class BarDirective {
  @Input('enlBar') barName: string;
  constructor(private ele: ElementRef) { }

  get character() {
    return this.barName.charAt(0).toUpperCase();
  }

  get offsetTop() {
    return this.ele.nativeElement.offsetTop;
  }

  get offsetHeight() {
    return this.ele.nativeElement.offsetHeight;
  }

}
