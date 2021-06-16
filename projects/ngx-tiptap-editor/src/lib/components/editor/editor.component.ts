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
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
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
  @Output() public created = new EventEmitter<Editor>();

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
  private destroy$ = new Subject<boolean>();

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

    // Emit the event which indicates that the tiptap editor was created
    this.created.emit(this.tiptap);

    // Pass the editor the the editorBody component
    this.editorComponent.setEditor(this.tiptap);

    // Check if the header component was passed and if not disable it
    this.headerComponent && this.headerComponent.setEditor(this.tiptap);
    this.registerEvents();
  }

  public ngOnDestroy(): void {
    this.tiptap && this.tiptap.destroy();
    this.destroy$.next(true);
    this.destroy.complete();
  }

  private registerEvents(): void {
    if (!this.tiptap) return;
    this.ngZone.runOutsideAngular(() => {
      this.pipeTo(
        fromEditorEvent(this.tiptap!, 'update').pipe(map(({editor}) => editor.getJSON())),
        this.jsonChange
      );
      this.pipeTo(
        fromEditorEvent(this.tiptap!, 'update').pipe(map(({editor}) => editor.getHTML())),
        this.htmlChange
      );
      this.pipeTo(fromEditorEvent(this.tiptap!, 'beforeCreate'), this.beforeCreate);
      this.pipeTo(fromEditorEvent(this.tiptap!, 'create'), this.create);
      this.pipeTo(fromEditorEvent(this.tiptap!, 'update'), this.update);
      this.pipeTo(fromEditorEvent(this.tiptap!, 'selectionUpdate'), this.selectionUpdate);
      this.pipeTo(fromEditorEvent(this.tiptap!, 'transaction'), this.transaction);
      this.pipeTo(fromEditorEvent(this.tiptap!, 'focus'), this.focus);
      this.pipeTo(fromEditorEvent(this.tiptap!, 'blur'), this.blur);
      this.pipeTo(fromEditorEvent(this.tiptap!, 'destroy'), this.destroy);
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

  private pipeTo<T>(observable: Observable<T>, eventEmitter: EventEmitter<T>): void {
    observable
      .pipe(takeUntil(this.destroy$))
      .subscribe(e => eventEmitter.next(e));
  }
}