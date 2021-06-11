import { AfterViewInit, Directive, ElementRef, isDevMode, OnDestroy, OnInit, ViewChild } from '@angular/core';
import type { Editor } from '@tiptap/core';
import { Subscription } from 'rxjs';
import { TiptapEventService } from '../../../services/tiptap-event.service';


export abstract class BaseControl {
  private _editor: Editor | null = null;

  public get editor(): Editor | null {
    return this._editor;
  }

  public setEditor(editor: Editor): void {
    this._editor = editor;
  }

}

@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class ButtonBaseControl extends BaseControl implements OnInit, OnDestroy, AfterViewInit {
  private subscription!: Subscription;
  @ViewChild('button') protected button: ElementRef<HTMLElement> | undefined;

  protected abstract eventService: TiptapEventService;

  public ngOnInit(): void {
    this.subscription = this.eventService.update$.subscribe(() => this.updateClasses());
  }

  public ngAfterViewInit(): void {
    if (!this.button && isDevMode()) {
      console.warn(`The button element in your control could not be found in ${this.constructor.name}\nPlease add #button to your control button element`);
    }
  }

  public ngOnDestroy(): void {
    this.subscription && this.subscription.unsubscribe();
  }

  protected abstract isActive(...args: any): boolean;

  protected abstract can(...args: any): boolean;

  private updateClasses(): void {
    if (!this.button) return;

    const activeAction = this.isActive() ? 'add' : 'remove';
    this.button.nativeElement.classList[activeAction]('active');

    const disabledAction = this.can() ? 'add' : 'remove';
    this.button.nativeElement.classList[disabledAction]('disabled');
  }
}
