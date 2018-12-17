import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { ExampleNg7LibModule } from 'example-ng7-lib';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ExampleNg7LibModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
