import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tip-util-hr',
  template: `
    <hr>`,
  styles: [`
    :host-context {
      display: contents;
    }

    hr {
      flex-basis: calc(100% + var(--tip-header-padding) * 2);
      margin: var(--tip-header-padding) calc(var(--tip-header-padding) * -1);
      border: none;
      border-top: solid 1px var(--tip-border-color);
    }`],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UtilHorizontalDividerComponent {
}
