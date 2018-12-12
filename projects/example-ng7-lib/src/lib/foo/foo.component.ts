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
  private _thumbClass: string;
  @Input() set thumbClass(val: string) {
    this._thumbClass = val;
  }
  get thumbClass() {
    return this._thumbClass;
  }
  private _barClass: string;
  @Input() set barClass(val: string) {
    this._barClass = val;
  }
  get barClass() {
    return this._barClass;
  }
  @Input() options?: FooOptions;
  @ContentChildren(BarDirective) barDirectives !: QueryList<BarDirective>;
  @ViewChild(NgScrollbar) scrollBar: NgScrollbar;
  @ViewChild('scrollThumbsIndicator') scrollThumbsIndicator: ElementRef;
  numberOfBars: number;
  all: BarDirective[] = [];
  firsts: { [x: string]: BarDirective } = {};
  ticking = false;
  indicatorResponsible: any;
  dummyFlag: boolean;
  constructor(private ele: ElementRef,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: any) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const mainIndicator = this.scrollThumbsIndicator.nativeElement;
    this.indicatorResponsible = this.scrollThumbsIndicator.nativeElement.getElementsByClassName('bubble-container')[0];

    this.stylizeMainIndicator(mainIndicator);

    let timer = null;

    // Approach 0
    this.scrollBar.verticalScrollbar.nativeElement.addEventListener('mouseover', _e => {
      timer = this.showIndicator(timer, 3000);
    });
    this.scrollBar.view.addEventListener('scroll', _e => {
      timer = this.showIndicator(timer);
    });

    // Approach 1
    // In this approach, we would modify function showIndicator

    // Approach 2
    // this.optimizedEventFiring().add(this.scrollBar.verticalScrollbar.nativeElement, 'mouseover', _ => {
    //   timer = this.showIndicator(timer, 3000);
    // });
    // this.optimizedEventFiring().add(this.scrollBar.view, 'scroll', _ => {
    //   timer = this.showIndicator(timer);
    // });

  }


  private stylizeMainIndicator(mainIndicator: any) {
    setTimeout(_ => {
      const width = this.scrollBar.verticalScrollbar.nativeElement.getElementsByClassName('ng-scrollbar-vertical')[0].offsetWidth;
      const height = this.scrollBar.verticalScrollbar.nativeElement.getElementsByClassName('ng-scrollbar-vertical')[0].offsetHeight;
      const top = this.scrollBar.verticalScrollbar.nativeElement.getElementsByClassName('ng-scrollbar-vertical')[0].offsetTop;
      const left = this.scrollBar.verticalScrollbar.nativeElement.getElementsByClassName('ng-scrollbar-vertical')[0].offsetLeft;
      mainIndicator.style.width = width + 'px';
      mainIndicator.style.top = top + 'px';
      mainIndicator.style.height = height + 'px';
      mainIndicator.style.left = left + 'px';
    });
  }

  private showIndicator(timer: any, delay?: number) {
    if (timer !== null) {
      this.indicatorResponsible.classList.add('show');

      // Approach 0
      this.handleText();

      // Approach 1
      // this.handleEvent(this, this.handleText);

      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      this.indicatorResponsible.classList.remove('show');
    }, delay ? delay : 500);
    return timer;
  }

  optimizedEventFiring() {

    let callbacks = [],
      running = false;

    // fired on event
    const executeEvent = () => {

      if (!running) {
        running = true;

        if (window.requestAnimationFrame) {
          window.requestAnimationFrame(runCallbacks);
        } else {
          setTimeout(runCallbacks, 66);
        }
      }

    };

    // run the actual callbacks
    const runCallbacks = () => {

      callbacks.forEach(function (callback) {
        callback();
      });

      running = false;
    };

    // adds callback to loop
    const addCallback = (callback) => {

      if (callback) {
        callbacks.push(callback);
      }

    };

    return {
      // public method to add additional callback
      add: (thisScope, event, callback) => {
        if (!callbacks.length) {
          thisScope.addEventListener(event, executeEvent);
        }
        addCallback(callback);
      }
    };
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
    const viewScrollTop = this.scrollBar.view.scrollTop;
    const viewScrollHeight = this.scrollBar.view.scrollHeight;
    const percentTop = (viewScrollTop * 100) / viewScrollHeight;
    // this.indicator.nativeElement.getElementsByClassName('text')[0].style.top = Math.round(percentTop) + '%';
    // this.indicator.nativeElement.getElementsByClassName('background')[0].style.top = Math.round(percentTop) + '%';
    this.indicatorResponsible.style.top = Math.round(percentTop) + '%';
    const viewClientHeight = this.scrollBar.view.clientHeight;
    const viewOffsetHeight = this.scrollBar.view.offsetHeight;
    this.all.find(item => {
      const offsetTop = item.offsetTop;
      const offsetHeight = item.offsetHeight;
      const condition = viewScrollTop <= offsetTop && (offsetHeight + offsetTop) < (viewScrollTop + viewOffsetHeight);
      if (condition) {
        this.scrollThumbsIndicator.nativeElement.getElementsByClassName('text')[0].innerHTML = item.character;
        return condition;
      }
    });
    this.dummyFlag = false;
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
