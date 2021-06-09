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
import { TipTapModule } from '../../models/types';
import { TiptapService } from '../../tiptap.service';

@Component({
  selector: 'tip-editor-preview[content]',
  template: `
    <div #contentOutlet></div>`,
  styleUrls: ['./editor-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorPreviewComponent implements OnInit, AfterViewInit {

  @ViewChild('contentOutlet') private contentOutlet: ElementRef<HTMLDivElement> | undefined;
  @Input() private sanitizeHtml = true;

  private _content: object | string | undefined;

  @Input()
  public set content(value: object | string) {
    this._content = value;
    this.renderOutput().then();
  }

  private tipTap!: TipTapModule;

  constructor(
    private tiptapService: TiptapService,
    private domSanitizer: DomSanitizer,
    private renderer: Renderer2,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.tipTap = await this.tiptapService.getTipTap();
  }

  public ngAfterViewInit(): Promise<void> {
    return this.renderOutput();
  }

  private async renderOutput(): Promise<void> {
    if (!this.contentOutlet) return;

    let html = '';
    if (typeof this._content === 'string') {
      html = this._content;
    } else if (this._content) {
      html = this.tipTap.generateHTML(this._content, await this.tiptapService.getExtensions());
    }

    if (this.sanitizeHtml) {
      html = this.domSanitizer.sanitize(SecurityContext.HTML, html)!;
    }

    this.renderer.setProperty(this.contentOutlet.nativeElement, 'innerHTML', html);
  }

}
