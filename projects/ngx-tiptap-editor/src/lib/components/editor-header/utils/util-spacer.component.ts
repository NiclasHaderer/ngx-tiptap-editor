import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tip-util-spacer',
  template: ``,
  styles: [`:host-context {
    flex-grow: 1;
  }`],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UtilSpacerComponent {
}
