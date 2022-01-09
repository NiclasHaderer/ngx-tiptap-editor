import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorFooterComponent } from './editor-footer.component';

describe('EditorFooterComponent', () => {
  let component: EditorFooterComponent;
  let fixture: ComponentFixture<EditorFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditorFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
