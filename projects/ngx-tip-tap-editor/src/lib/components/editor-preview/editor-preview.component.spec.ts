import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorPreviewComponent } from './editor-preview.component';

describe('EditorPreviewComponent', () => {
  let component: EditorPreviewComponent;
  let fixture: ComponentFixture<EditorPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditorPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
