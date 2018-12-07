import { NgModule } from '@angular/core';
import { ExampleNg7LibComponent } from './example-ng7-lib.component';
import { FooComponent } from './foo/foo.component';
import { BarDirective } from './foo/bar.directive';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgScrollbarModule } from 'ngx-scrollbar';

@NgModule({
  declarations: [ExampleNg7LibComponent, FooComponent, BarDirective],
  imports: [
    CommonModule,
    BrowserModule,
    NgScrollbarModule
  ],
  exports: [ExampleNg7LibComponent, FooComponent, BarDirective]
})
export class ExampleNg7LibModule { }
