import { AfterViewInit, ChangeDetectionStrategy, Component, ContentChild, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EditorPreviewComponent } from '../editor-preview/editor-preview.component';
import { EditorComponent } from '../editor/editor.component';

@Component({
  selector: 'tip-side-by-side',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content select="tip-editor"></ng-content>
    <div class="preview-wrapper">
      <div class="preview-heading v-center h-center">
        <h2 class="no-margin">Preview</h2>
      </div>
      <ng-content select="tip-editor-preview"></ng-content>
    </div>
  `,
  styles: [`
    :host-context {
      display: flex;
      width: 100%;
    }

    .preview-heading {
      border-bottom: solid 1px var(--tip-border-color);
      padding: var(--tip-header-padding);
      height: var(--tip-header-height);
      box-sizing: border-box;
    }

    .preview-wrapper {
      border: solid 1px var(--tip-border-color);
      border-left: none;
      width: 50%;
    }

    ::ng-deep tip-side-by-side > tip-editor {
      width: 50%;
    }
  `]
})
export class SideBySideComponent implements AfterViewInit, OnDestroy {
  @ContentChild(EditorComponent) private editor!: EditorComponent;
  @ContentChild(EditorPreviewComponent) private preview!: EditorPreviewComponent;

  private destroy$ = new Subject<boolean>();

  public ngAfterViewInit(): void {
    this.editor.jsonChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((content) => {
        this.preview.renderOutput(content);
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
