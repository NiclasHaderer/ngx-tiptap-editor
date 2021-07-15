import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  Renderer2,
  SecurityContext,
  ViewChild
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import type { Extensions } from '@tiptap/core';
import { generateHTML } from '@tiptap/core';

@Component({
  selector: 'tip-editor-preview',
  template: `
    <div #contentOutlet></div>`,
  styleUrls: ['./editor-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorPreviewComponent implements AfterViewInit {

  @Input()
  public set content(value: object | string | null) {
    this._content = value;
    this.renderOutput();
  }

  @Input() extensions: Extensions = [];

  @ViewChild('contentOutlet') private contentOutlet: ElementRef<HTMLDivElement> | undefined;
  @Input() private sanitizeHtml = true;

  private _content: object | string | null = null;

  constructor(
    private domSanitizer: DomSanitizer,
    private renderer: Renderer2,
  ) {
  }

  public ngAfterViewInit(): void {
    return this.renderOutput();
  }

  public renderOutput(content: object | string | null = this._content): void {
    if (!this.contentOutlet) return;

    let html = '';
    if (typeof content === 'string') {
      html = content;
    } else if (content) {
      // Hopefully fixes the github build, which seems to break for some reason
      html = generateHTML(content as any, this.extensions);
    }

    if (this.sanitizeHtml) {
      html = this.domSanitizer.sanitize(SecurityContext.HTML, html)!;
    }

    this.renderer.setProperty(this.contentOutlet.nativeElement, 'innerHTML', html);
  }

}
