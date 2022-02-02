import {Injectable, NgZone} from '@angular/core';
import {fromEvent, merge, Observable, Subject, Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class TiptapEventService {

  private clickSubject = new Subject<MouseEvent>();
  public onClick$ = this.clickSubject.asObservable();
  private keyboardSubject = new Subject<KeyboardEvent>();
  /* tslint:disable */
  public update$ = merge(this.clickSubject, this.keyboardSubject);
  public onKeyboard$ = this.keyboardSubject.asObservable();
  private clickSubscription: Subscription | null = null;
  private keyboardSubscription: Subscription | null = null;

  /* tslint:enable */

  constructor(
    private ngZone: NgZone
  ) {
  }

  public registerShortcut(shortcut: string): Observable<KeyboardEvent> {
    const parts = shortcut.split('-');
    let key = parts[parts.length - 1];
    if (key === 'Space') key = ' ';
    const keyCodeSmall = key.toUpperCase().charCodeAt(0);
    const keyCodeLarge = key.toLowerCase().charCodeAt(0);

    const hasAlt = parts.includes('Alt');
    const hasShift = parts.includes('Shift');

    const hasMod = parts.includes('Mod');
    const hasCtrl = parts.includes('Ctrl');
    const hasCmd = parts.includes('Cmd');

    return this.onKeyboard$.pipe(
      filter(e => (
        // Check the keycode against the large and small letter (I hate you apple)
        (e.keyCode === keyCodeSmall || e.keyCode === keyCodeLarge) &&
        e.altKey === hasAlt &&
        e.shiftKey === hasShift &&
        // Check if the meta key was pressed, or the combined mod is allowed  (I really, really, hate you apple)
        (
          // Both ctrl and command key
          hasMod && (e.ctrlKey && !e.metaKey || !e.ctrlKey && e.metaKey)
          // Only ctrl or command key
          || e.ctrlKey === hasCtrl && e.metaKey === hasCmd && !hasMod
        )
      ))
    );
  }

  public setElement(element: HTMLDivElement): void {
    this.ngZone.runOutsideAngular(() => {
      this.clickSubscription?.unsubscribe();
      this.keyboardSubscription?.unsubscribe();
      this.clickSubscription = fromEvent<MouseEvent>(element, 'click').subscribe(e => this.clickSubject.next(e));
      this.keyboardSubscription = fromEvent<KeyboardEvent>(element, 'keydown').subscribe(e => this.keyboardSubject.next(e));
    });
  }
}
