import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastaComponent } from './toasta.component';

describe('ToastaComponent', () => {
  let component: ToastaComponent;
  let fixture: ComponentFixture<ToastaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ToastaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToastaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
