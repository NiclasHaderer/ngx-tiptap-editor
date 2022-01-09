import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tip-util-br',
  template: ``,
  styles: [`:host-context {
    flex-basis: 100%;
  }`],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UtilBreakLineComponent {
}
