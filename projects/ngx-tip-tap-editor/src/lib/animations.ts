import { animate, style, transition, trigger } from '@angular/animations';

export const FadeInAnimation = trigger('fadeIn', [
  transition(':enter', [
    style({opacity: 0}),
    animate('150ms cubic-bezier(.13,1.14,1,.92)', style({opacity: 1})),
  ]),
  transition(':leave', [
    animate('150ms cubic-bezier(.13,1.14,1,.92)', style({opacity: 0}))
  ])
]);
