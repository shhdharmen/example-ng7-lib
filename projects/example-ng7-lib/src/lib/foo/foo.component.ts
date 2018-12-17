import {
  Component, OnInit, Input, QueryList, ContentChildren, AfterContentInit, ElementRef, ViewChild,
  AfterViewInit,
  HostListener,
  OnChanges
} from '@angular/core';
import { FooOptions, EChangeWhen, ETheme, EPosition, EShowWhen } from './foo-options';
import { BarDirective } from './bar.directive';
// import { NgScrollbar } from 'ngx-scrollbar';

/**
 * Class for ng-scrollbar-indicator.
 * @selector ng-scrollbar-indicator
 */
@Component({
  selector: 'ng-scrollbar-indicator',
  templateUrl: './foo.component.html'
})
export class FooComponent implements OnInit, AfterContentInit, AfterViewInit, OnChanges {
  // Inputs
  private _thumbClass: string;
  /**
   * @see {@link https://www.npmjs.com/package/ngx-scrollbar#styling}
  */
  @Input() set thumbClass(val: string) {
    this._thumbClass = val;
  }
  get thumbClass() {
    return this._thumbClass;
  }
  private _barClass: string;
  /**
   * @see {@link https://www.npmjs.com/package/ngx-scrollbar#styling}
  */
  @Input() set barClass(val: string) {
    this._barClass = val;
  }
  get barClass() {
    return this._barClass;
  }
  /**
   * Default options for ng-scrollbar-indicator
  */
  defaultOptions: FooOptions = {
    changeWhen: EChangeWhen.top,
    containerHeight: 500,
    position: EPosition.top,
    showWhen: EShowWhen.scroll,
    theme: ETheme.waterDrop,
    showCharacterPanel: false
  };
  /**
   * User input for options
  */
  @Input() options: FooOptions;

  // Children
  @ContentChildren(BarDirective) private barDirectives !: QueryList<BarDirective>;
  // @ViewChild(NgScrollbar) scrollBar: NgScrollbar;
  @ViewChild('mainDiv') scrollBar: ElementRef;
  @ViewChild('scrollThumbsIndicator') private scrollThumbsIndicator: ElementRef;

  // Properties
  /**Current character in indicator */
  activeCharacter: string;
  objectKeys = Object.keys;
  private numberOfItems: number;
  /**All Items Array */
  all: BarDirective[] = [];
  /**JSON Object with first item of each character */
  firsts: { [x: string]: BarDirective } = {};
  /**JSON Object with last item of each character */
  lasts: { [x: string]: BarDirective } = {};
  private listToBeConsidered: string[];
  private characters = [];
  private ticking = false;
  private indicatorResponsible: any;
  private mainIndicator: any;
  private handleTextFunctions: {
    [EPosition.auto]: Function,
    [EPosition.top]: Function
  };
  eShowWhen = EShowWhen;

  constructor() {
  }

  ngOnInit() {
    this.initHandlerFunctions();
  }

  ngOnChanges() {
    this.checkOptions();
  }

  private checkOptions() {
    if (this.options) {
      this.options.changeWhen = this.options.changeWhen ? this.options.changeWhen : this.defaultOptions.changeWhen;
      this.options.containerHeight = this.options.containerHeight ? this.options.containerHeight : this.defaultOptions.containerHeight;
      this.options.position = this.options.position ? this.options.position : this.defaultOptions.position;
      this.options.showWhen = this.options.showWhen ? this.options.showWhen : this.defaultOptions.showWhen;
      this.options.theme = this.options.theme ? this.options.theme : this.defaultOptions.theme;
    } else {
      this.options = Object.assign({}, this.defaultOptions);
    }
  }

  private initHandlerFunctions() {
    this.handleTextFunctions = {
      [EPosition.auto]: () => {
        // const viewScrollTop = this.scrollBar.view.scrollTop;
        const viewScrollTop = this.scrollBar.nativeElement.scrollTop;
        // const viewScrollHeight = this.scrollBar.view.scrollHeight;
        const viewScrollHeight = this.scrollBar.nativeElement.scrollHeight;
        const percentTop = (viewScrollTop * 100) / viewScrollHeight;
        this.indicatorResponsible.style.top = (Math.round(percentTop * 100) / 100) + '%';
        // const viewOffsetHeight = this.scrollBar.view.offsetHeight;
        const viewOffsetHeight = this.scrollBar.nativeElement.offsetHeight;
        this.listToBeConsidered.find(key => {
          const firstItem = this.firsts[key];
          const lastItem = this.lasts[key];
          const condition = (viewScrollTop <= firstItem.offsetTop &&
            (firstItem.offsetHeight + firstItem.offsetTop) < (viewScrollTop + viewOffsetHeight)) ||
            (viewScrollTop <= lastItem.offsetTop &&
              (lastItem.offsetHeight + lastItem.offsetTop) < (viewScrollTop + viewOffsetHeight));
          if (condition) {
            this.activeCharacter = key;
            return condition;
          }
        });
      },
      [EPosition.top]: () => {
        // const viewScrollTop = this.scrollBar.view.scrollTop;
        const viewScrollTop = this.scrollBar.nativeElement.scrollTop;
        // const viewOffsetHeight = this.scrollBar.view.offsetHeight;
        const viewOffsetHeight = this.scrollBar.nativeElement.offsetHeight;
        this.listToBeConsidered.find(key => {
          const firstItem = this.firsts[key];
          const lastItem = this.lasts[key];
          const condition = (viewScrollTop <= firstItem.offsetTop &&
            (firstItem.offsetHeight + firstItem.offsetTop) < (viewScrollTop + viewOffsetHeight)) ||
            (viewScrollTop <= lastItem.offsetTop &&
              (lastItem.offsetHeight + lastItem.offsetTop) < (viewScrollTop + viewOffsetHeight));
          if (condition) {
            this.activeCharacter = key;
            return condition;
          }
        });
      }
    };
  }

  ngAfterViewInit() {
    this.mainIndicator = this.scrollThumbsIndicator.nativeElement;
    this.indicatorResponsible = this.scrollThumbsIndicator.nativeElement.getElementsByClassName('indicator-container')[0];

    this.stylizeMainIndicator();

    let timer = null;

    // Approach 0
    // We have to check if scrollbar is there or not, specifically for mobile devices
    // if (this.scrollBar.verticalScrollbar) {
    //   this.scrollBar.verticalScrollbar.nativeElement.addEventListener('mouseover', (_e: MouseEvent) => {
    //     timer = this.showIndicator(timer, 3000);
    //   });
    // }
    // this.scrollBar.view.addEventListener('scroll', _e => {
    this.scrollBar.nativeElement.addEventListener('scroll', _e => {
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
      // if (this.scrollBar.verticalScrollbar) {
      // for non-mobile devices
      // width = this.scrollBar.verticalScrollbar.nativeElement.getElementsByClassName('ng-scrollbar-vertical')[0].offsetWidth;
      // height = this.scrollBar.verticalScrollbar.nativeElement.getElementsByClassName('ng-scrollbar-vertical')[0].offsetHeight;
      // top = this.scrollBar.verticalScrollbar.nativeElement.getElementsByClassName('ng-scrollbar-vertical')[0].offsetTop;
      // left = this.scrollBar.verticalScrollbar.nativeElement.getElementsByClassName('ng-scrollbar-vertical')[0].offsetLeft;
      // } else {
      // for mobile devices
      width = 8;
      // height = this.scrollBar.view.offsetHeight;
      height = this.scrollBar.nativeElement.offsetHeight;
      // top = this.scrollBar.view.offsetTop;
      top = this.scrollBar.nativeElement.offsetTop;
      // left = this.scrollBar.view.offsetWidth - 8;
      left = this.scrollBar.nativeElement.offsetWidth - 8;
      // }
      this.mainIndicator.style.width = width + 'px';
      this.mainIndicator.style.top = (top + 23) + 'px';
      this.mainIndicator.style.height = (height - 46) + 'px';
      this.mainIndicator.style.left = left + 'px';
    });
  }

  /**This will show the indicator.
   * @description This will add 'show' class to the indicator. And After delay(default 500), if will remove the same.
   */
  showIndicator(timer: any, delay = 500) {
    if (timer !== null) {
      this.indicatorResponsible.classList.add('show');

      // Approach 0
      // this.handleText();
      this.handleTextFunctions[this.options.position]();

      // Approach 1
      // this.handleEvent(this, this.handleText);

      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      this.indicatorResponsible.classList.remove('show');
    }, delay);
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

  ngAfterContentInit() {
    this.startCalculation();
    this.barDirectives.changes.subscribe(_ => {
      this.startCalculation();
    });
  }

  private startCalculation() {
    setTimeout(() => {
      this.numberOfItems = this.barDirectives.length;
      this.barDirectives.forEach(item => {
        this.all.push(item);
        if (!this.firsts[item.character]) {
          this.characters.push(item.character);
          this.firsts[item.character] = item;
        }
        this.lasts[item.character] = item;
      });
      if (this.options.changeWhen === EChangeWhen.top) {
        this.listToBeConsidered = this.characters;
      } else {
        this.listToBeConsidered = this.characters.reverse();
      }
      this.handleTextFunctions[this.options.position]();
    });
  }

  /**Scroll to a specific letter, in given duration(default 150), positioned first of last. Returns the offsetTop if element found, else -1.
   */
  goToLetter(letter: string, duration: number = 150, position: string = 'first'): number {
    try {
      const offsetTop = this[position + 's'][letter.toUpperCase()].offsetTop;
      // this.scrollBar.scrollYTo(offsetTop, duration).subscribe(_ => {
      //   return offsetTop;
      // }, err => {
      //   console.log('Error in ng-scrollbar\'s scrollYTo function. Full error log can be found below:\n', err);
      //   return -1;
      // });
      this.scrollBar.nativeElement.scrollTo({ top: offsetTop, behavior: 'smooth' });
      return offsetTop;
    } catch (e) {
      console.error('The letter you tried to scroll to, could not be found in list. Full error log can be found below:\n', e);
      return -1;
    }
  }

  @HostListener('window:resize')
  onresize() {
    this.stylizeMainIndicator();
  }
}
