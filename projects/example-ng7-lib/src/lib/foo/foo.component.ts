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
  @ViewChild('handle') handle: ElementRef;
  @ViewChild('handleParent') handleParent: ElementRef;
  @ViewChild(NgScrollbar) scrollBar: NgScrollbar;
  numberOfBars: number;
  lastChild: BarDirective;
  firsts: { [x: string]: string } = {};
  executed = false;
  ticking = false;
  currentInEvent: { in: string; out: string; };
  currentOutEvent: { in: string; out: string; };
  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    [{ in: 'mousedown', out: 'mouseup' },
    { in: 'mouseover', out: 'mouseleave' }].forEach(ev => {
      this.scrollBar.verticalScrollbar.nativeElement.addEventListener(ev.in, _ => {
        if (!this.currentOutEvent || (this.currentOutEvent.out === 'mousedown' && this.currentOutEvent.out === ev.out)) {
          this.currentInEvent = ev;
          this.handle.nativeElement.classList.add('show');
        }
      }, { passive: true });
      this.scrollBar.verticalScrollbar.nativeElement.addEventListener(ev.out, () => {
        if (ev.out === this.currentInEvent.out) {
          this.currentOutEvent = ev;
          this.handle.nativeElement.classList.remove('show');
        }
      }, { passive: true });
    });
    this.handle.nativeElement.addEventListener('wheel', (_e: WheelEvent) => {
      if (_e.cancelable) {
        const top = this.scrollBar.view.scrollTop;
        this.handleEvent(this.scrollBar, this.scrollBar.scrollYTo, [top + (_e.deltaY < 0 ? -200 : 200), 150]);
      }
    }, { passive: true });
    this.handleParent.nativeElement.addEventListener('wheel', (_e: WheelEvent) => {
      if (_e.cancelable) {
        const top = this.scrollBar.view.scrollTop;
        this.handleEvent(this.scrollBar, this.scrollBar.scrollYTo, [top + (_e.deltaY < 0 ? -200 : 200), 150]);
      }
    }, { passive: true });
    this.scrollBar.view.addEventListener('scroll', _e => {
      _e.preventDefault();
      const last_known_scroll_position = this.scrollBar.view.scrollTop;
      this.handleEvent(this, this.handlePosition, [last_known_scroll_position]);
    }, { passive: true });
  }

  private handleEvent(thisScope: any, functionToBeExecuted: Function, args: any[]) {
    if (!this.executed) {
      this.executed = true;
      if (!this.ticking) {
        requestAnimationFrame(_ => {
          functionToBeExecuted.apply(thisScope, args);
          this.ticking = false;
        });
        this.ticking = true;
      }
      setTimeout(() => {
        this.executed = false;
      });
    }
  }

  private handlePosition(last_known_scroll_position: any) {
    const offsetHeight = this.handleParent.nativeElement.offsetHeight;
    const scrollHeight = this.scrollBar.view.scrollHeight;
    const scrolledPercent = last_known_scroll_position / scrollHeight * 100;
    this.handle.nativeElement.style.top = (scrolledPercent / 100 * offsetHeight < 6 ? 6 : scrolledPercent / 100 * offsetHeight) + 'px';
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
