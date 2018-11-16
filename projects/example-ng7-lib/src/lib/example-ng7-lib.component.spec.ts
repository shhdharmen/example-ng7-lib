import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExampleNg7LibComponent } from './example-ng7-lib.component';

describe('ExampleNg7LibComponent', () => {
  let component: ExampleNg7LibComponent;
  let fixture: ComponentFixture<ExampleNg7LibComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExampleNg7LibComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExampleNg7LibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
