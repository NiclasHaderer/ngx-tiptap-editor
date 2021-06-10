import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Inject,
  NgZone,
  OnDestroy,
  Output,
  PLATFORM_ID
} from '@angular/core';
import type { Editor } from '@tiptap/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OnChangeUpdate } from '../../models/types';
import { DialogService } from '../../services/dialog.service';
import { TiptapService } from '../../services/tiptap.service';
import { EditorBodyComponent } from '../editor-body/editor-body.component';
import { EditorHeaderComponent } from '../editor-header/editor-header.component';

@Component({
  selector: 'tip-editor',
  template: `
    <ng-content select="tip-editor-header"></ng-content>
    <ng-content select="tip-editor-body"></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements AfterViewInit, OnDestroy, OnDestroy {

  @Output() jsonChange = new EventEmitter<object>();
  @Output() htmlChange = new EventEmitter<string>();
  @Output() ready = new EventEmitter<Editor>();
  private tiptap!: Editor;
  @ContentChild(EditorBodyComponent) private editorComponent!: EditorBodyComponent;
  @ContentChild(EditorHeaderComponent) private headerComponent!: EditorHeaderComponent;
  private destroy$ = new Subject<boolean>();

  constructor(
    private tiptapService: TiptapService,
    private ngZone: NgZone,
    private element: ElementRef,
    @Inject(PLATFORM_ID) private platformId: any,
    private dialogService: DialogService
  ) {
  }


  public async ngAfterViewInit(): Promise<void> {
    // Emit these events to trigger change detection every time the user clicks, or makes an input
    fromEvent(this.element.nativeElement, 'keyup').pipe(takeUntil(this.destroy$)).subscribe();
    fromEvent(this.element.nativeElement, 'click').pipe(takeUntil(this.destroy$)).subscribe();

    if (!isPlatformBrowser(this.platformId)) return;
    this.tiptap = await this.tiptapService.getEditor(this.editorComponent.editorElement!);
    this.ready.emit(this.tiptap);
    this.editorComponent.setEditor(this.tiptap);
    this.headerComponent.setEditor(this.tiptap);
    this.registerEvents();
  }

  public ngOnDestroy(): void {
    this.tiptap.off('update', this.emitHmlChange);
    this.tiptap.off('update', this.emitJsonChange);
    this.tiptap.destroy();
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  private registerEvents(): void {
    if (!this.tiptap) return;
    this.ngZone.runOutsideAngular(() => {
      this.tiptap.on('update', this.emitHmlChange.bind(this));
      this.tiptap.on('update', this.emitJsonChange.bind(this));
    });
  }

  private emitHmlChange({editor}: OnChangeUpdate): void {
    this.htmlChange.next(editor.getHTML());
  }

  private emitJsonChange({editor}: OnChangeUpdate): void {
    this.jsonChange.next(editor.getJSON());
  }

}
