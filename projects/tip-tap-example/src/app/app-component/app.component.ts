import { Component, OnInit } from '@angular/core';
import type { Extensions } from '@tiptap/core';
import { TaskItem } from '@tiptap/extension-task-item';
import { TaskList } from '@tiptap/extension-task-list';
import { TextAlign } from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import { BaseExtension, NgxLink, NgxMention } from 'ngx-tiptap-editor';
import { MentionCallback } from 'ngx-tiptap-editor';


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
  public angularExtensions = [
    BaseExtension.create(NgxMention, {}),
    BaseExtension.create(NgxLink, {openOnClick: false})
  ];


  public title = 'tip-tap-example';
  public editorContent: string | null = null;

  public log(e: any): any {
    console.log(e);
  }

  public ngOnInit(): void {
    const content = (localStorage.getItem('editor'));
    if (content) {
      this.editorContent = JSON.parse(content);
    }
  }

  public save($event: object): void {
    localStorage.setItem('editor', JSON.stringify($event));
  }

  public updateMention(callback: MentionCallback): void {
    callback({id: 'hello', label: 'world'});
  }
}
