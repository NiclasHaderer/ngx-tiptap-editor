import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Extensions } from '@tiptap/core';
import { TaskItem } from '@tiptap/extension-task-item';
import { TaskList } from '@tiptap/extension-task-list';
import { TextAlign } from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import { MentionCallback, NgxLink, NgxMention, TipBaseExtension } from 'ngx-tiptap-editor';
import { ExtensionBuilder } from '../../../../ngx-tiptap-editor/src/lib/extensions/base-extension.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public extensions: Extensions = [
    StarterKit,
    Underline,
    TextAlign,
    TaskList,
    TaskItem.configure({nested: true}),
  ];
  public angularExtensions: ExtensionBuilder<any, any>[] = [
    TipBaseExtension.create(NgxMention, {}),
    TipBaseExtension.create(NgxLink, {openOnClick: false})
  ];

  public title = 'tip-tap-example';
  public editorContent: string | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
  ) {
  }


  public ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const content = (localStorage.getItem('editor'));
    if (content) {
      this.editorContent = JSON.parse(content);
    }
  }

  public log(e: any): any {
    console.log(e);
  }

  public save($event: object): void {
    localStorage.setItem('editor', JSON.stringify($event));
  }

  public updateMention(callback: MentionCallback): void {
    callback({id: 'hello', label: 'world'});
  }
}
