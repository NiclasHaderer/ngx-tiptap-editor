import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tip-util-padding',
  template: ``,
  styles: [`:host-context {
    width: calc(var(--tip-header-padding) / 2);
  }`],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UtilPaddingComponent {
}
