import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tip-control-spacer',
  template: ``,
  styles: [`:host-context {
    flex-grow: 1;
  }`],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSpacerComponent {
}
