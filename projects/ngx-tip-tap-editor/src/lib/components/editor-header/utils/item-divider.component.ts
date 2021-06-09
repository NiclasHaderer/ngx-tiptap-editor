import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tip-item-divider',
  template: ``,
  styles: [`:host-context {
    width: 1px;
    border-left: solid 1px var(--tip-border-color);
    height: var(--tip-header-height);
    margin-top: calc(var(--tip-header-padding) * -1);
    margin-bottom: calc(var(--tip-header-padding) * -1);
  }`],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemDividerComponent {
}
