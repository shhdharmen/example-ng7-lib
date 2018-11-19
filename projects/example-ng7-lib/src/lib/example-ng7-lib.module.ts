import { NgModule } from '@angular/core';
import { ExampleNg7LibComponent } from './example-ng7-lib.component';
import { FooComponent } from './foo/foo.component';

@NgModule({
  declarations: [ExampleNg7LibComponent, FooComponent],
  imports: [
  ],
  exports: [ExampleNg7LibComponent, FooComponent]
})
export class ExampleNg7LibModule { }
