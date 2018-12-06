import { Component, OnInit, Input, QueryList, ContentChildren, AfterContentInit, ContentChild, ElementRef } from '@angular/core';
import { FooOptions } from './foo-options';
import { BarDirective } from './bar.directive';

@Component({
  selector: 'enl-foo',
  templateUrl: './foo.component.html',
  styleUrls: ['./foo.component.scss']
})
export class FooComponent implements OnInit, AfterContentInit {
  objectKeys = Object.keys;
  @Input() options?: FooOptions;
  @ContentChildren(BarDirective) barDirectives !: QueryList<BarDirective>;
  @ContentChild('handle') handle: ElementRef;
  numberOfBars: number;
  lastChild: BarDirective;
  firsts: { [x: string]: string } = {};
  constructor() { }

  ngOnInit() {
  }

  ngAfterContentInit() {
    this.lastChild = this.barDirectives.last;
    this.calculateLength();
    this.barDirectives.changes.subscribe(_ => {
      this.calculateLength();
    });
  }

  private calculateLength() {
    setTimeout(_ => {
      this.numberOfBars = this.barDirectives.length;
      this.barDirectives.forEach(item => {
        if (!this.firsts[item.barName.charAt(0).toUpperCase()]) {
          this.firsts[item.barName.charAt(0).toUpperCase()] = item.barName;
        }
      });
    });
  }
}
