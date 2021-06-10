import { animate, state, style, transition, trigger } from '@angular/animations';

// TODO animations
const open = state('open', style({
  opacity: 1,
}));
const closed = state('closed', style({
  opacity: 0,
}));

export const BackgroundAnimation = trigger('openClose', [

  transition(':enter', [
    animate('333ms'), closed, open
  ]),
  transition(':leave', [
    animate('333ms'), open, closed
  ]),
]);
