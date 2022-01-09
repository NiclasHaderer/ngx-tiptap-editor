import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Inject,
  Injector,
  Input,
  isDevMode,
  NgZone,
  OnDestroy,
  Optional,
  Output,
  PLATFORM_ID,
  Type
} from '@angular/core';
import type { Content, EditorOptions, Extensions } from '@tiptap/core';
import { Editor } from '@tiptap/core';
import type { ParseOptions } from 'prosemirror-model';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { ExtensionBuilder } from '../../extensions/base-extension.model';
import { TipBaseExtension } from '../../extensions/tip-base-extension';
import { fromEditorEvent, getDuplicates } from '../../helpers';
import { EditorEventReturn } from '../../models/types';
import { GLOBAL_ANGULAR_EXTENSIONS, GLOBAL_EXTENSIONS } from '../../providers';
import { TiptapEventService } from '../../services/tiptap-event.service';
import { TiptapExtensionService } from '../../services/tiptap-extension.service';
import { EditorBodyComponent } from '../editor-body/editor-body.component';
import { EditorFooterComponent } from '../editor-footer/editor-footer.component';
import { EditorHeaderComponent } from '../editor-header/editor-header.component';

// tslint:disable:no-output-native
@Component({
  selector: 'tip-editor',
  template: `
    <ng-content select="tip-editor-header"></ng-content>
    <ng-content select="tip-editor-body"></ng-content>
    <ng-content select="tip-editor-footer"></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./editor.component.scss'],
  providers: [TiptapEventService, TiptapExtensionService]
})
export class EditorComponent implements AfterViewInit, OnDestroy {

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
  @Input() public editorProps: EditorOptions['editorProps'] = {};
  @Input() public parseOptions: ParseOptions = {};
  @Input() public enableInputRules = true;
  @Input() public enablePasteRules = true;
  @Input() public extensions: Extensions = [];
  @Input() public angularExtensions: ExtensionBuilder<any, Type<TipBaseExtension<any>>>[] = [];
  @Input() public runEventsOutsideAngular = true;

  // Load children
  @ContentChild(EditorBodyComponent) private editorComponent: EditorBodyComponent | undefined;
  @ContentChild(EditorHeaderComponent) private headerComponent: EditorHeaderComponent | undefined;
  @ContentChild(EditorFooterComponent) private footerComponent: EditorFooterComponent | undefined;
  private tiptap: Editor | undefined;
  private destroy$ = new Subject<boolean>();
  private builtExtensions: TipBaseExtension<any>[] = [];

  constructor(
    private ngZone: NgZone,
    private injector: Injector,
    private tiptapExtensionService: TiptapExtensionService,
    @Inject(PLATFORM_ID) private platformId: any,
    @Optional() @Inject(GLOBAL_EXTENSIONS) private globalExtensions: Extensions | null,
    @Optional() @Inject(GLOBAL_ANGULAR_EXTENSIONS) private globalAngularExtensions: ExtensionBuilder<any, any>[] | null,
    eventService: TiptapEventService,
    element: ElementRef,
  ) {
    eventService.setElement(element.nativeElement);
  }

  public get editor(): Editor | null {
    return this.tiptap ? this.tiptap : null;
  }


  public async ngAfterViewInit(): Promise<void> {
    // On the serve you don't need an editor
    if (!isPlatformBrowser(this.platformId)) return;

    if (!this.editorComponent) {
      throw new Error('You have to pass the tip-editor-body as a child of the tip-editor. Otherwise you cannot see anything');
    }

    // Attach the editor to the editor element
    this.tiptap = this.ngZone.runOutsideAngular(() => new Editor({
      ...this.buildEditorOptions(),
      element: this.editorComponent!.editorElement!,
    }));

    this.setEditorInAngularExtension();

    // Emit the event which indicates that the tiptap editor was created
    this.created.emit(this.tiptap);

    // Pass the editor the the editorBody component
    this.editorComponent.setEditor(this.tiptap);

    // Check if the header component was passed and if not disable it
    this.headerComponent && this.headerComponent.setEditor(this.tiptap);
    this.footerComponent && this.footerComponent.setEditor(this.tiptap);
    this.registerEvents();
  }

  public ngOnDestroy(): void {
    this.tiptap && this.tiptap.destroy();
    this.destroy$.next(true);
    this.destroy.complete();
  }

  private registerEvents(): void {
    if (!this.tiptap) return;

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
      extensions: this.mergeNativeAndAngularExtensions()
    };
  }

  private mergeNativeAndAngularExtensions(): Extensions {
    // Set collection of native extensions in the extension service
    const nativeExtensions: Extensions = [...this.extensions];
    if (this.globalExtensions) nativeExtensions.push(...this.globalExtensions);
    const nativeDuplicates = getDuplicates(nativeExtensions, item => item.name);
    if (nativeDuplicates && isDevMode()) {
      throw new Error(`Duplicate tiptap extensions found ${JSON.stringify(Object.keys(nativeDuplicates))}`);
    }
    this.tiptapExtensionService.setNativeExtensions(nativeExtensions);

    // Build the angular extensions and set them in the extension service
    const angularExtensions: ExtensionBuilder<any, any>[] = [...this.angularExtensions];
    if (this.globalAngularExtensions) angularExtensions.push(...this.globalAngularExtensions);
    this.builtExtensions = angularExtensions.map(extension => this.ngZone.run(() => extension.build(this.injector)));
    const ngDuplicates = getDuplicates(this.builtExtensions, item => item.constructor.name);
    if (ngDuplicates && isDevMode()) {
      throw new Error(`Duplicate angular-tiptap extensions found (Key is class name): ${JSON.stringify(Object.keys(ngDuplicates))}`);
    }
    this.tiptapExtensionService.setAngularExtensions(this.builtExtensions);
    return [
      ...this.extensions,
      ...this.builtExtensions.map(e => e.nativeExtension)
    ];
  }

  private pipeTo<T>(observable: Observable<T>, eventEmitter: EventEmitter<T>): void {
    observable
      .pipe(takeUntil(this.destroy$))
      .subscribe(e => {
        if (this.runEventsOutsideAngular) {
          this.ngZone.runOutsideAngular(() => eventEmitter.next(e));
        } else {
          this.ngZone.run(() => eventEmitter.next(e));
        }
      });
  }

  private setEditorInAngularExtension(): void {
    for (const angularExtension of this.builtExtensions) {
      angularExtension.editor = this.tiptap!;
    }
  }
}
