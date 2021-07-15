import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, InjectionToken } from '@angular/core';
import { Editor } from '@tiptap/core';
import { SuggestionProps } from '@tiptap/suggestion';

export const MENTION_FETCH = new InjectionToken<MentionFetchFunction>('MENTION_FETCH');
export type MentionFetchFunction = (query: string) => { id: string, label?: string }[] | Promise<{ id: string, label?: string }[]>;

export interface MentionPreviewInterface {
  handleKeyPress(event: KeyboardEvent): boolean;

  updateProps(props: SuggestionProps): void;
}

@Component({
  selector: 'tip-mention-select',
  template: `
    <div *ngFor="let item of queryResult">
      {{item.id}}
    </div>
    <div *ngIf="queryResult.length === 0">
      No result was found
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MentionPreviewComponent implements MentionPreviewInterface {

  queryResult: {id: string}[] = [];

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

  public async updateProps({query, editor}: SuggestionProps): Promise<void> {
    this.queryResult = await this.fetchFunction(query);
    this.cd.detectChanges();
  }
}
