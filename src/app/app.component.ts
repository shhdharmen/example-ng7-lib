import { Component, OnInit } from '@angular/core';
import { FooOptions } from 'projects/example-ng7-lib/src/lib/foo/foo-options';
import { DATA } from './MOCK_DATA';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  options: FooOptions;
  title = 'example-ng7-lib-app';
  DATA: { 'first_name': string }[];

  ngOnInit() {
    this.DATA = DATA.sort((a, b) => a.first_name < b.first_name ? -1 : (a.first_name > b.first_name ? 1 : 0)).splice(750, DATA.length - 1);
  }
}
