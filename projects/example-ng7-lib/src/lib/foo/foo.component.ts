import {
  Component, OnInit, Input, QueryList, ContentChildren, AfterContentInit, ElementRef, ViewChild,
  AfterViewInit,
  HostListener
} from '@angular/core';
import { FooOptions, EChangeWhen, ETheme } from './foo-options';
import { BarDirective } from './bar.directive';
import { NgScrollbar } from 'ngx-scrollbar';

@Component({
  selector: 'ng-scrollbar-indicator',
  templateUrl: './foo.component.html',
  // styleUrls: ['./foo.component.scss']
})
export class FooComponent implements OnInit, AfterContentInit, AfterViewInit {
  // Inputs
  private _thumbClass: string;
  listToBeConsidered: { [x: string]: BarDirective; };
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
  @Input() options?: FooOptions = {
    containerHeight: 500,
    changeWhen: EChangeWhen.visible,
    theme: ETheme.waterDrop
  };

  // Children
  @ContentChildren(BarDirective) barDirectives !: QueryList<BarDirective>;
  @ViewChild(NgScrollbar) scrollBar: NgScrollbar;
  @ViewChild('scrollThumbsIndicator') scrollThumbsIndicator: ElementRef;

  // Properties
  objectKeys = Object.keys;
  numberOfBars: number;
  all: BarDirective[] = [];
  firsts: { [x: string]: BarDirective } = {};
  lasts: { [x: string]: BarDirective } = {};
  ticking = false;
  indicatorResponsible: any;
  mainIndicator: any;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.mainIndicator = this.scrollThumbsIndicator.nativeElement;
    this.indicatorResponsible = this.scrollThumbsIndicator.nativeElement.getElementsByClassName('bubble-container')[0];
    if (this.options.changeWhen === EChangeWhen.top) {
      this.listToBeConsidered = this.lasts;
    } else {
      this.listToBeConsidered = this.firsts;
    }
    this.stylizeMainIndicator();

    let timer = null;

    // Approach 0
    // We have to check if scrollbar is there or not, specifically for mobile devices
    if (this.scrollBar.verticalScrollbar) {
      this.scrollBar.verticalScrollbar.nativeElement.addEventListener('mouseover', (_e: MouseEvent) => {
        timer = this.showIndicator(timer, 3000);
      });
    }
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


  private stylizeMainIndicator() {
    setTimeout(() => {
      let width = 0, height = 0, top = 0, left = 0;
      if (this.scrollBar.verticalScrollbar) {
        // for non-mobile devices
        width = this.scrollBar.verticalScrollbar.nativeElement.getElementsByClassName('ng-scrollbar-vertical')[0].offsetWidth;
        height = this.scrollBar.verticalScrollbar.nativeElement.getElementsByClassName('ng-scrollbar-vertical')[0].offsetHeight;
        top = this.scrollBar.verticalScrollbar.nativeElement.getElementsByClassName('ng-scrollbar-vertical')[0].offsetTop;
        left = this.scrollBar.verticalScrollbar.nativeElement.getElementsByClassName('ng-scrollbar-vertical')[0].offsetLeft;
      } else {
        // for mobile devices
        width = 8;
        height = this.scrollBar.view.offsetHeight;
        top = this.scrollBar.view.offsetTop;
        left = this.scrollBar.view.offsetWidth - 8;
      }
      this.mainIndicator.style.width = width + 'px';
      this.mainIndicator.style.top = top + 'px';
      this.mainIndicator.style.height = height + 'px';
      this.mainIndicator.style.left = left + 'px';
    });
  }

  showIndicator(timer: any, delay?: number) {
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

  // optimizedEventFiring from https://developer.mozilla.org/en-US/docs/Web/Events/resize#requestAnimationFrame
  private optimizedEventFiring() {

    const callbacks = [];
    let running = false;

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

      callbacks.forEach((callback) => {
        callback();
      });

      running = false;
    };

    // adds callback to loop
    const addCallback = (callback: any) => {

      if (callback) {
        callbacks.push(callback);
      }

    };

    return {
      // public method to add additional callback
      add: (thisScope: any, event: string, callback: any) => {
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
    this.indicatorResponsible.style.top = (Math.round(percentTop * 100) / 100) + '%';
    const viewOffsetHeight = this.scrollBar.view.offsetHeight;
    const keys = this.objectKeys(this.listToBeConsidered);
    keys.find(key => {
      const item = this.listToBeConsidered[key];
      const offsetTop = item.offsetTop;
      const offsetHeight = item.offsetHeight;
      const condition = viewScrollTop <= offsetTop && (offsetHeight + offsetTop) < (viewScrollTop + viewOffsetHeight);
      if (condition) {
        this.scrollThumbsIndicator.nativeElement.getElementsByClassName('text')[0].innerHTML = item.character;
        return condition;
      }
    });
    // this.all.find(item => {
    //   const offsetTop = item.offsetTop;
    //   const offsetHeight = item.offsetHeight;
    //   const condition = viewScrollTop <= offsetTop && (offsetHeight + offsetTop) < (viewScrollTop + viewOffsetHeight);
    //   if (condition) {
    //     this.scrollThumbsIndicator.nativeElement.getElementsByClassName('text')[0].innerHTML = item.character;
    //     return condition;
    //   }
    // });
  }

  ngAfterContentInit() {
    this.calculateLength();
    this.barDirectives.changes.subscribe(_ => {
      this.calculateLength();
    });
  }

  private calculateLength() {
    setTimeout(() => {
      this.numberOfBars = this.barDirectives.length;
      this.barDirectives.forEach(item => {
        this.all.push(item);
        if (!this.firsts[item.character]) {
          this.firsts[item.character] = item;
        }
        this.lasts[item.character] = item;
      });
      this.handleText();
    });
  }

  goToLetter(letter: string) {
    this.scrollBar.scrollYTo(this.firsts[letter.toUpperCase()].offsetTop, 150);
  }

  @HostListener('window:resize')
  onresize() {
    this.stylizeMainIndicator();
  }

  // ngx-scroll-bar functions form https://www.npmjs.com/package/ngx-scrollbar#scroll-functions
  scrollTo(options: ScrollToOptions) {
    return this.scrollBar.scrollTo(options).subscribe();
  }
  scrollToElement(selector: any, offset?: any, duration?: any, easeFunc?: any) {
    return this.scrollBar.scrollToElement(selector, offset, duration, easeFunc).subscribe();
  }
  scrollYTo(position: any, duration?: any, easeFunc?: any) {
    return this.scrollBar.scrollYTo(position, duration, easeFunc).subscribe();
  }
  scrollToTop(duration?: any, easeFunc?: any) {
    return this.scrollBar.scrollToTop(duration, easeFunc).subscribe();
  }
  scrollToBottom(duration?: any, easeFunc?: any) {
    return this.scrollBar.scrollToBottom(duration, easeFunc).subscribe();
  }

}
