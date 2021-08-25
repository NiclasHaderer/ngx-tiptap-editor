import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  Input,
  isDevMode,
  NgZone,
  OnChanges,
  Renderer2,
  SecurityContext,
  SimpleChanges,
  Type,
  ViewChild
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import type { Extensions } from '@tiptap/core';
import { generateHTML } from '@tiptap/core';
import { TipBaseExtension } from '../../extensions/tip-base-extension';
import { ExtensionBuilder } from '../../extensions/base-extension.model';

@Component({
  selector: 'tip-editor-preview',
  template: `
    <div #contentOutlet></div>
  `,
  styleUrls: ['./editor-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorPreviewComponent implements AfterViewInit, OnChanges {

  @Input()
  public set content(value: object | string | null) {
    this._content = value;
    this.renderOutput();
  }

  @Input() public extensions: Extensions = [];
  @Input() public angularExtensions: ExtensionBuilder<any, Type<TipBaseExtension<any>>>[] = [];

  @ViewChild('contentOutlet') private contentOutlet: ElementRef<HTMLDivElement> | undefined;
  @Input() private sanitizeHtml = true;

  private _content: object | string | null = null;
  private builtExtensions: Extensions = [];

  constructor(
    private domSanitizer: DomSanitizer,
    private renderer: Renderer2,
    private injector: Injector,
    private ngZone: NgZone
  ) {
  }

  public ngOnChanges(_: SimpleChanges): void {
    const builtAngularExtensions = this.angularExtensions.map(builder => this.ngZone.run(() => builder.build(this.injector)));
    this.builtExtensions = [
      ...this.extensions,
      ...builtAngularExtensions.map(e => e.nativeExtension)
    ];

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
      html = generateHTML(content as any, this.builtExtensions);
    }

    if (this.sanitizeHtml) {
      html = this.domSanitizer.sanitize(SecurityContext.HTML, html)!;

      if (isDevMode()) {
        console.warn('The editor preview is sanetizing your HTML. This may lead to missing HTML.');
      }
    }

    this.renderer.setProperty(this.contentOutlet.nativeElement, 'innerHTML', html);
  }


}
