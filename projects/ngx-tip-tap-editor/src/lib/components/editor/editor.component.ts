import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  Output,
  PLATFORM_ID
} from '@angular/core';
import type { Content, Editor, EditorOptions } from '@tiptap/core';
import type { ParseOptions } from 'prosemirror-model';
import type { EditorProps } from 'prosemirror-view';
import { map } from 'rxjs/operators';
import { fromEditorEvent } from '../../helpers';
import { EditorEventReturn } from '../../models/types';
import { DialogService } from '../../services/dialog.service';
import { TiptapEventService } from '../../services/tiptap-event.service';
import { TiptapService } from '../../services/tiptap.service';
import { EditorBodyComponent } from '../editor-body/editor-body.component';
import { EditorHeaderComponent } from '../editor-header/editor-header.component';

// tslint:disable:no-output-native


@Component({
  selector: 'tip-editor',
  template: `
    <ng-content select="tip-editor-header"></ng-content>
    <ng-content select="tip-editor-body"></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./editor.component.scss'],
  providers: [TiptapEventService]
})
export class EditorComponent implements AfterViewInit, OnDestroy, OnDestroy {

  // Content change
  @Output() public jsonChange = new EventEmitter<Record<string, any>>();
  @Output() public htmlChange = new EventEmitter<string>();

  // Editor set
  @Output() public ready = new EventEmitter<Editor>();

  // Editor events
  @Output() public beforeCreate = new EventEmitter<EditorEventReturn['beforeCreate']>();
  @Output() public create = new EventEmitter<EditorEventReturn['create']>();
  @Output() public update = new EventEmitter<EditorEventReturn['update']>();
  @Output() public selectionUpdate = new EventEmitter<EditorEventReturn['selectionUpdate']>();
  @Output() public transaction = new EventEmitter<EditorEventReturn['transaction']>();
  @Output() public focus = new EventEmitter<EditorEventReturn['focus']>();
  @Output() public blur = new EventEmitter<EditorEventReturn['blur']>();
  @Output() public destroy = new EventEmitter<EditorEventReturn['destroy']>();

  // Editor input params
  @Input() public content: object | string | null = null;
  @Input() public injectCSS = true;
  @Input() public autofocus = true;
  @Input() public editable = true;
  @Input() public editorProps: EditorProps = {};
  @Input() public parseOptions: ParseOptions = {};
  @Input() public enableInputRules = true;
  @Input() public enablePasteRules = true;

  // Load children
  @ContentChild(EditorBodyComponent) private editorComponent: EditorBodyComponent | undefined;
  @ContentChild(EditorHeaderComponent) private headerComponent!: EditorHeaderComponent | undefined;
  private tiptap: Editor | undefined;


  constructor(
    private tiptapService: TiptapService,
    private ngZone: NgZone,
    private element: ElementRef,
    @Inject(PLATFORM_ID) private platformId: any,
    dialogService: DialogService,
    eventService: TiptapEventService
  ) {
    eventService.setElement(element.nativeElement);
  }


  public async ngAfterViewInit(): Promise<void> {
    // On the serve you don't need an editor
    if (!isPlatformBrowser(this.platformId)) return;

    if (!this.editorComponent) {
      throw new Error('You have to pass the tip-editor-body as a child of the tip-editor. Otherwise you cannot see anything');
    }

    // Attach the editor to the editor element
    this.tiptap = await this.tiptapService.getEditor(this.editorComponent.editorElement!, this.buildEditorOptions());

    this.ready.emit(this.tiptap);
    // Pass the editor the the editorBody component
    this.editorComponent.setEditor(this.tiptap);

    // Check if the header component was passed and if not disable it
    this.headerComponent && this.headerComponent.setEditor(this.tiptap);
    this.registerEvents();
  }

  public ngOnDestroy(): void {
    this.tiptap && this.tiptap.destroy();
  }

  private registerEvents(): void {
    if (!this.tiptap) return;
    this.ngZone.runOutsideAngular(() => {
      this.jsonChange.source = fromEditorEvent(this.tiptap!, 'update').pipe(map(({editor}) => editor.getJSON()));
      this.htmlChange.source = fromEditorEvent(this.tiptap!, 'update').pipe(map(({editor}) => editor.getHTML()));
      this.beforeCreate.source = fromEditorEvent(this.tiptap!, 'beforeCreate');
      this.create.source = fromEditorEvent(this.tiptap!, 'create');
      this.update.source = fromEditorEvent(this.tiptap!, 'update');
      this.selectionUpdate.source = fromEditorEvent(this.tiptap!, 'selectionUpdate');
      this.transaction.source = fromEditorEvent(this.tiptap!, 'transaction');
      this.focus.source = fromEditorEvent(this.tiptap!, 'focus');
      this.blur.source = fromEditorEvent(this.tiptap!, 'blur');
      this.destroy.source = fromEditorEvent(this.tiptap!, 'destroy');
    });
  }

  private buildEditorOptions(): Partial<EditorOptions> {
    return {
      content: this.content as unknown as Content,
      autofocus: this.autofocus,
      injectCSS: this.injectCSS,
      editable: this.editable,
      editorProps: this.editorProps,
      parseOptions: this.parseOptions,
      enableInputRules: this.enableInputRules,
      enablePasteRules: this.enablePasteRules,
    };
  }
}
