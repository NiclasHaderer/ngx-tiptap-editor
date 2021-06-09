import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tip-item-spacer',
  template: ``,
  styles: [`:host-context {
    flex-grow: 1;
  }`],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemSpacerComponent {
}
