import { animate, style, transition, trigger } from '@angular/animations';

export const ExpandHeight = trigger('expandHeight', [
  transition(':enter', [
    style({height: '0'}),
    animate('100ms cubic-bezier(.13,1.14,1,.92)', style({height: '*'})),
  ]),
  transition(':leave',
    animate('100ms cubic-bezier(.13,1.14,1,.92)', style({height: '0'}))
  )
]);

