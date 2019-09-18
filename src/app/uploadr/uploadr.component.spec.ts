import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadrComponent } from './uploadr.component';

describe('UploadrComponent', () => {
  let component: UploadrComponent;
  let fixture: ComponentFixture<UploadrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
