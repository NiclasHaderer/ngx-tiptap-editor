import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Extensions } from '@tiptap/core';
import { TaskItem } from '@tiptap/extension-task-item';
import { TaskList } from '@tiptap/extension-task-list';
import { TextAlign } from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import { MentionCallback, MentionData, MentionFetchFunction, NgxLink, NgxMention, TipBaseExtension } from 'ngx-tiptap-editor';
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
    TextAlign.configure({types: ['heading', 'paragraph']}),
    TaskList,
    TaskItem.configure({nested: true}),
  ];
  public angularExtensions: ExtensionBuilder<any, any>[] = [
    TipBaseExtension.create(NgxMention, {mentionFetchFunction: fetchMentions}),
    TipBaseExtension.create(NgxLink, {native: {openOnClick: false}})
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

  public getMention(callback: MentionCallback): void {
    const mention = prompt('Mention me:');
    if (mention) callback({id: mention});
  }

  public showMention(mention: MentionData): void {
    alert(mention.label ? mention.label : mention.id);
  }
}


const fetchMentions: MentionFetchFunction = (query) => {
  return [
    {id: 'Lea Thompson'},
    {id: 'Cyndi Lauper'},
    {id: 'Tom Cruise'},
    {id: 'Madonna'},
    {id: 'Jerry Hall'},
    {id: 'Joan Collins'},
    {id: 'Winona Ryder'},
    {id: 'Christina Applegate'},
    {id: 'Alyssa Milano'},
    {id: 'Molly Ringwald'},
    {id: 'Ally Sheedy'},
    {id: 'Debbie Harry'},
    {id: 'Olivia Newton-John'},
    {id: 'Elton John'},
    {id: 'Michael J. Fox'},
    {id: 'Axl Rose'},
    {id: 'Emilio Estevez'},
    {id: 'Ralph Macchio'},
    {id: 'Rob Lowe'},
    {id: 'Jennifer Grey'},
    {id: 'Mickey Rourke'},
    {id: 'John Cusack'},
    {id: 'Matthew Broderick'},
    {id: 'Justine Bateman'},
    {id: 'Lisa Bonet'}
  ].filter(({id: item}) => item.toLowerCase().startsWith(query.toLowerCase())).slice(0, 10);
};

