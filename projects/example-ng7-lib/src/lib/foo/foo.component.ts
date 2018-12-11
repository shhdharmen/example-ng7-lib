import {
  Component, OnInit, Input, QueryList, ContentChildren, AfterContentInit, ElementRef, ViewChild,
  AfterViewInit,
  Renderer2,
  Inject
} from '@angular/core';
import { FooOptions } from './foo-options';
import { BarDirective } from './bar.directive';
import { NgScrollbar } from 'ngx-scrollbar';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'ng-scrollbar-indicator',
  templateUrl: './foo.component.html',
  styleUrls: ['./foo.component.scss']
})
export class FooComponent implements OnInit, AfterContentInit, AfterViewInit {
  objectKeys = Object.keys;
  customThumbClass: string;
  customBarClass: string;
  private _thumbClass: string;
  @Input() set thumbClass(val: string) {
    this.customThumbClass = val + 'x';
    this._thumbClass = val + ' ' + this.customThumbClass;
  };
  get thumbClass() {
    return this._thumbClass;
  }
  private _barClass: string;
  @Input() set barClass(val: string) {
    this.customBarClass = val + 'x';
    this._barClass = val + ' ' + this.customBarClass;
  };
  get barClass() {
    return this._barClass;
  }
  @Input() options?: FooOptions;
  @ContentChildren(BarDirective) barDirectives !: QueryList<BarDirective>;
  @ViewChild(NgScrollbar) scrollBar: NgScrollbar;
  numberOfBars: number;
  all: BarDirective[] = [];
  firsts: { [x: string]: BarDirective } = {};
  ticking = false;
  constructor(private ele: ElementRef,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: any) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const ele = this.document.createElement('span');
    ele.classList.add('scroll-thumbs-indicator')
    // ele.setAttribute('letter', 'N');
    this.scrollBar.verticalScrollbar.nativeElement.getElementsByClassName('scroll-thumbs')[0].appendChild(ele);
    let timer = null;
    this.scrollBar.view.addEventListener('scroll', _e => {
      _e.preventDefault();
      if (timer !== null) {
        this.scrollBar.verticalScrollbar.nativeElement.getElementsByClassName('scroll-thumbs-indicator')[0].classList.add('show');
        this.handleEvent(this, this.handleText);
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        this.scrollBar.verticalScrollbar.nativeElement.getElementsByClassName('scroll-thumbs-indicator')[0].classList.remove('show');
      }, 500);
    }, { passive: true });
  }


  // a generic event handler, to get rid of verbose/browser errors
  // https://developer.mozilla.org/en-US/docs/Web/Events/scroll#Example
  private handleEvent(thisScope: any, functionToBeExecuted: Function, args?: any[]) {
    if (!this.ticking) {
      requestAnimationFrame(_ => {
        functionToBeExecuted.apply(thisScope, args);
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  private handleText() {
    const scrollTop = this.scrollBar.view.scrollTop;
    const windowHeight = this.scrollBar.view.offsetHeight;
    this.all.find(item => {
      const offsetTop = item.offsetTop;
      const offsetHeight = item.offsetHeight;
      const condition = scrollTop <= offsetTop && (offsetHeight + offsetTop) < (scrollTop + windowHeight);
      if (condition) {
        this.scrollBar.verticalScrollbar.nativeElement.getElementsByClassName('scroll-thumbs-indicator')[0].setAttribute('letter', item.character);
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
        this.all.push(item);
        if (!this.firsts[item.character]) {
          this.firsts[item.character] = item;
        }
      });
      this.handleText();
    });
  }

  goToLetter(letter: string) {
    this.scrollBar.scrollYTo(this.firsts[letter.toUpperCase()].offsetTop, 150);
  }
}
