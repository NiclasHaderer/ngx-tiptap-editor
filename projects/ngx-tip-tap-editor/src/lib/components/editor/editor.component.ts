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
import { DialogService } from '../../services/dialog.service';
import { TiptapEventService } from '../../services/tiptap-event.service';
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
  providers: [TiptapEventService]
})
export class EditorComponent implements AfterViewInit, OnDestroy, OnDestroy {

  @Output() jsonChange = new EventEmitter<object>();
  @Output() htmlChange = new EventEmitter<string>();
  @Output() ready = new EventEmitter<Editor>();
  private tiptap: Editor | undefined;
  @ContentChild(EditorBodyComponent) private editorComponent: EditorBodyComponent | undefined;
  @ContentChild(EditorHeaderComponent) private headerComponent!: EditorHeaderComponent | undefined;

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
    this.tiptap = await this.tiptapService.getEditor(this.editorComponent.editorElement!);
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
      this.tiptap!.on('update', () => this.htmlChange.next(this.tiptap!.getHTML()));
      this.tiptap!.on('update', () => this.jsonChange.next(this.tiptap!.getJSON()));
    });
  }
}
