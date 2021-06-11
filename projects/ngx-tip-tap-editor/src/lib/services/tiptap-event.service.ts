import { Injectable } from '@angular/core';
import { fromEvent, merge, Observable, Subject, Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TiptapEventService {

  private clickSubject = new Subject<MouseEvent>();
  private keyboardSubject = new Subject<KeyboardEvent>();
  public onClick$ = this.clickSubject.asObservable();
  public onKeyboard$ = this.keyboardSubject.asObservable();
  public update$ = merge(this.onClick$, this.onKeyboard$);
  private clickSubscription: Subscription | null = null;
  private keySubscription: Subscription | null = null;

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
      tap(e => console.log(e)),
      filter(e => (
        // Check the keycode against the large and small letter (I hate you mac)
        (e.keyCode === keyCodeSmall || e.keyCode === keyCodeLarge) &&
        e.altKey === hasAlt &&
        e.shiftKey === hasShift &&
        // Check if the meta key was pressed, or the combined mod is allowed
        (
          // Both ctrl and command key
          hasMod && (e.ctrlKey === hasCtrl || e.metaKey === hasCmd)
          // Only ctrl or command key
          || e.ctrlKey === hasCtrl && e.metaKey === hasCmd
        )
      ))
    );
  }

  public setElement(element: HTMLDivElement): void {
    this.clickSubscription?.unsubscribe();
    this.keyboardSubject?.unsubscribe();
    this.clickSubscription = fromEvent<MouseEvent>(element, 'click').subscribe(e => this.clickSubject.next(e));
    this.keySubscription = fromEvent<KeyboardEvent>(element, 'keydown').subscribe(e => this.keyboardSubject.next(e));
  }
}
