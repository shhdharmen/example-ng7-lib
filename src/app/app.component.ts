import { Component, OnInit, ViewChild } from '@angular/core';
import { DATA } from './MOCK_DATA';
import { FooComponent, FooOptions, EChangeWhen, ETheme, EPosition, EShowWhen } from 'projects/example-ng7-lib/src/public_api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  options: FooOptions = {
    enable: true,
    changeWhen: EChangeWhen.top,
    containerHeight: 500,
    theme: ETheme.circular,
    position: EPosition.top,
    showWhen: EShowWhen.scroll
  };
  title = 'example-ng7-lib-app';
  DATA: { 'first_name': string }[];

  @ViewChild('indicatorRef') indicatorRef: FooComponent;
  ngOnInit() {
    this.DATA = DATA.sort((a, b) => a.first_name < b.first_name ? -1 : (a.first_name > b.first_name ? 1 : 0));
  }
}
