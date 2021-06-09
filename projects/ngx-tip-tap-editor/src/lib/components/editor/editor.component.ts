import { isPlatformBrowser } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    EventEmitter,
    Inject,
    OnDestroy,
    Output,
    PLATFORM_ID
} from '@angular/core';
import type { Editor } from '@tiptap/core';
import { OnChangeUpdate } from '../../models/types';
import { TiptapService } from '../../tiptap.service';
import { EditorBodyComponent } from '../editor-body/editor-body.component';
import { EditorHeaderComponent } from '../editor-header/editor-header.component';

@Component({
    selector: 'tip-editor',
    template: `
        <ng-content select="tip-editor-header"></ng-content>
        <ng-content select="tip-editor-body"></ng-content>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements AfterViewInit, OnDestroy {

    @Output() jsonChange = new EventEmitter<object>();
    @Output() htmlChange = new EventEmitter<string>();
    private tiptap!: Editor;
    @ContentChild(EditorBodyComponent) private editorComponent!: EditorBodyComponent;
    @ContentChild(EditorHeaderComponent) private headerComponent!: EditorHeaderComponent;

    constructor(
        private tiptapService: TiptapService,
        @Inject(PLATFORM_ID) private platformId: any
    ) {
    }


    public async ngAfterViewInit(): Promise<void> {
        if (!isPlatformBrowser(this.platformId)) return;

        this.tiptap = await this.tiptapService.getEditor(this.editorComponent.editorElement!);

        this.editorComponent.setEditor(this.tiptap);
        this.headerComponent.setEditor(this.tiptap);
        this.registerEvents();
    }

    public ngOnDestroy(): void {
        this.tiptap.off('update', this.emitHmlChange);
        this.tiptap.off('update', this.emitJsonChange);
    }

    private registerEvents(): void {
        this.tiptap.on('update', this.emitHmlChange.bind(this));
        this.tiptap.on('update', this.emitJsonChange.bind(this));
    }

    private emitHmlChange({editor}: OnChangeUpdate): void {
        this.htmlChange.next(editor.getHTML());
    }

    private emitJsonChange({editor}: OnChangeUpdate): void {
        this.jsonChange.next(editor.getJSON());
    }

}
