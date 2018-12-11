import {
  Component, OnInit, Input, QueryList, ContentChildren, AfterContentInit, ElementRef, ViewChild,
  AfterViewInit
} from '@angular/core';
import { FooOptions } from './foo-options';
import { BarDirective } from './bar.directive';
import { NgScrollbar } from 'ngx-scrollbar';

@Component({
  selector: 'enl-foo',
  templateUrl: './foo.component.html',
  styleUrls: ['./foo.component.scss']
})
export class FooComponent implements OnInit, AfterContentInit, AfterViewInit {
  objectKeys = Object.keys;
  @Input() options?: FooOptions;
  @ContentChildren(BarDirective) barDirectives !: QueryList<BarDirective>;
  @ViewChild(NgScrollbar) scrollBar: NgScrollbar;
  numberOfBars: number;
  firsts: BarDirective[] = [];
  ticking = false;
  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    let timer = null;
    this.scrollBar.view.addEventListener('scroll', _e => {
      _e.preventDefault();
      if (timer !== null) {
        this.scrollBar.verticalScrollbar.nativeElement.getElementsByClassName('scroll-thumbs')[0].classList.add('show');
        this.handleEvent(this, this.handleText);
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        this.scrollBar.verticalScrollbar.nativeElement.getElementsByClassName('scroll-thumbs')[0].classList.remove('show');
      }, 500);
    }, { passive: true });
  }


  // a generic event handler, to get rid of verbose/browser errors
  // https://developer.mozilla.org/en-US/docs/Web/Events/scroll#Example
  private handleEvent(thisScope: any, functionToBeExecuted: Function) {
    if (!this.ticking) {
      requestAnimationFrame(_ => {
        functionToBeExecuted.apply(thisScope);
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  private handleText() {
    const scrollTop = this.scrollBar.view.scrollTop;
    const windowHeight = this.scrollBar.view.offsetHeight;
    this.firsts.find(item => {
      const offsetTop = item.offsetTop;
      const offsetHeight = item.offsetHeight;
      const condition = scrollTop <= offsetTop && (offsetHeight + offsetTop) < (scrollTop + windowHeight);
      if (condition) {
        this.scrollBar.verticalScrollbar.nativeElement.getElementsByClassName('scroll-thumbs')[0].setAttribute('letter', item.character);
        return condition;
      }
    });
  }

  ngAfterContentInit() {
    this.calculateLength();
    this.barDirectives.changes.subscribe(_ => {
      this.calculateLength();
    });
  }

  private calculateLength() {
    setTimeout(_ => {
      this.numberOfBars = this.barDirectives.length;
      this.barDirectives.forEach(item => {
        this.firsts.push(item);
      });
      this.handleText();
    });
  }
}
