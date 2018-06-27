import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxToastaComponent } from './ngx-toasta.component';

describe('NgxToastaComponent', () => {
  let component: NgxToastaComponent;
  let fixture: ComponentFixture<NgxToastaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxToastaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxToastaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
