import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorBodyComponent } from './editor-body.component';

describe('EditorBodyComponent', () => {
  let component: EditorBodyComponent;
  let fixture: ComponentFixture<EditorBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditorBodyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
