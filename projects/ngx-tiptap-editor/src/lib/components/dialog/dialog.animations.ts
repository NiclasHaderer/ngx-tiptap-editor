import { animate, query, style, transition, trigger } from '@angular/animations';

export const PopOverPopUpAnimation = trigger('popUp', [
  transition(':enter', [
    query('.popover-wrapper', [
      style({opacity: 0, transform: 'translate(-50%, -50%)'}),
      animate('150ms cubic-bezier(.13,1.14,1,.92)', style({opacity: 1, transform: '*'})),
    ])
  ]),
  transition(':leave',
    query('.popover-wrapper', [
      animate('150ms cubic-bezier(.13,1.14,1,.92)', style({opacity: 0, transform: 'translate(-50%, -50%)'})),
    ])),
]);


export const OverlayPopUpAnimation = trigger('popUp', [
  transition(':enter', [
    query('.dialog-wrapper', [
      style({transform: 'translate(-50%, -30%)'}),
      animate('150ms cubic-bezier(.13,1.14,1,.92)', style({transform: '*'})),
    ])
  ]),
  transition(':leave',
    query('.dialog-wrapper', [
      animate('150ms cubic-bezier(.13,1.14,1,.92)', style({transform: 'translate(-50%, -30%)'})),
    ])),
]);

