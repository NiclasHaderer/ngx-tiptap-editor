import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, InjectionToken } from '@angular/core';
import { Editor } from '@tiptap/core';
import { SuggestionProps } from '@tiptap/suggestion';
import { MentionData } from './ngx-mention';

export const MENTION_FETCH = new InjectionToken<MentionFetchFunction>('MENTION_FETCH');
export type MentionFetchFunction = (query: string) => MentionData[] | Promise<MentionData[]>;

export interface MentionPreviewInterface {
  handleKeyPress(event: KeyboardEvent): boolean;

  updateProps(props: SuggestionProps): void;
}

// @dynamic
@Component({
  selector: 'tip-mention-select',
  template: `
    <button *ngFor="let item of queryResult" (click)="setMention(item)" (keyup.enter)="setMention(item)">
      {{item.id}}
    </button>
    <div *ngIf="queryResult.length === 0">
      No result was found
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MentionPreviewComponent implements MentionPreviewInterface {
  public queryResult: { id: string }[] = [];
  private mentionProps!: SuggestionProps;

  constructor(
    private ngZone: ChangeDetectorRef,
    private cd: ChangeDetectorRef,
    private editor: Editor,
    @Inject(MENTION_FETCH) private fetchFunction: MentionFetchFunction
  ) {
  }

  handleKeyPress(event: KeyboardEvent): boolean {
    return false;
  }

  public async updateProps(props: SuggestionProps): Promise<void> {
    this.mentionProps = props;
    this.queryResult = await this.fetchFunction(props.query);
    this.cd.detectChanges();
  }

  public setMention(mention: { id: string }): void {
    this.mentionProps.command(mention);
  }
}
