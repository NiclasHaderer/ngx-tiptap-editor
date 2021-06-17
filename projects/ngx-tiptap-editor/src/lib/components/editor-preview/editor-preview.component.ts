import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  SecurityContext,
  ViewChild
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import type { Extensions } from '@tiptap/core';
import { TipTapModule } from '../../models/types';
import { TiptapService } from '../../services/tiptap.service';

@Component({
  selector: 'tip-editor-preview',
  template: `
    <div #contentOutlet></div>`,
  styleUrls: ['./editor-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorPreviewComponent implements OnInit, AfterViewInit {

  @Input()
  public set content(value: object | string | null) {
    this._content = value;
    this.renderOutput();
  }

  @Input() extensions: Extensions = [];

  @ViewChild('contentOutlet') private contentOutlet: ElementRef<HTMLDivElement> | undefined;
  @Input() private sanitizeHtml = true;
  private tipTap!: TipTapModule;

  private _content: object | string | null = null;

  constructor(
    private tiptapService: TiptapService,
    private domSanitizer: DomSanitizer,
    private renderer: Renderer2,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.tipTap = await this.tiptapService.getTipTap();
  }

  public ngAfterViewInit(): void {
    return this.renderOutput();
  }

  public renderOutput(content = this._content): void {
    if (!this.contentOutlet) return;

    let html = '';
    if (typeof content === 'string') {
      html = content;
    } else if (content) {
      html = this.tipTap.generateHTML(content, this.extensions);
    }

    if (this.sanitizeHtml) {
      html = this.domSanitizer.sanitize(SecurityContext.HTML, html)!;
    }

    this.renderer.setProperty(this.contentOutlet.nativeElement, 'innerHTML', html);
  }

}
