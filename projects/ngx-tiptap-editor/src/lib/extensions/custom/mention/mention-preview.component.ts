import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { SuggestionProps } from '@tiptap/suggestion';

@Component({
  selector: 'tip-mention-select',
  template: `
    <div *ngFor="let item of queryResult">
      {{item}}
    </div>
    <div *ngIf="queryResult.length === 0">
      No result was found
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MentionPreviewComponent {

  queryResult: string[] = [];

  query = [
    'Lea Thompson', 'Cyndi Lauper', 'Tom Cruise', 'Madonna', 'Jerry Hall', 'Joan Collins', 'Winona Ryder', 'Christina Applegate', 'Alyssa Milano', 'Molly Ringwald', 'Ally Sheedy', 'Debbie Harry', 'Olivia Newton-John', 'Elton John', 'Michael J. Fox', 'Axl Rose', 'Emilio Estevez', 'Ralph Macchio', 'Rob Lowe', 'Jennifer Grey', 'Mickey Rourke', 'John Cusack', 'Matthew Broderick', 'Justine Bateman', 'Lisa Bonet',
  ];

  constructor(
    private ngZone: ChangeDetectorRef,
    private cd: ChangeDetectorRef
  ) {
  }

  handleKeyPress(event: KeyboardEvent): boolean {
    return false;
  }

  public updateProps({query, editor}: SuggestionProps): void {
    this.queryResult = this.query.filter(i => i.toLowerCase().includes(query.toLowerCase()));
    this.cd.detectChanges();
  }
}
