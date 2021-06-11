import { AfterViewInit, Directive, ElementRef, Input, NgZone } from '@angular/core';

@Directive({
  selector: '[tipAutofocus]'
})
export class AutofocusDirective implements AfterViewInit {
  @Input('tipAutofocus') enable: boolean | string = true;

  constructor(
    private element: ElementRef,
    private ngZone: NgZone
  ) {
  }

  public ngAfterViewInit(): void {
    if (typeof this.enable === 'string' || this.enable) {
      this.ngZone.runOutsideAngular(() => setTimeout(() => this.element.nativeElement.focus()));
    }
  }
}
