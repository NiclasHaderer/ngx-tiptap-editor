import { AfterViewInit, Directive, ElementRef, isDevMode, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import type { Editor } from '@tiptap/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TiptapEventService } from '../../../services/tiptap-event.service';
import { OptionComponent, SelectComponent } from '../../select/select.component';

export interface BaseControl {
  onEditorReady?(editor: Editor): void;
}

export abstract class BaseControl {
  private _editor: Editor | null = null;

  public get editor(): Editor | null {
    return this._editor;
  }

  public setEditor(editor: Editor): void {
    this._editor = editor;
    this.onEditorReady && this.onEditorReady(editor);
  }
}


@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class ExtendedBaseControl extends BaseControl implements OnDestroy {
  protected destroy$ = new Subject<boolean>();

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}

@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class ButtonBaseControl extends ExtendedBaseControl implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('button') protected button: ElementRef<HTMLElement> | undefined;

  protected abstract eventService: TiptapEventService;

  public ngOnInit(): void {
    this.eventService.update$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateButton());
  }

  public ngAfterViewInit(): void {
    if (!this.button && isDevMode()) {
      console.warn(`The button element in your control could not be found in ${this.constructor.name}\nPlease add #button to your control button element`);
    }
  }

  public setEditor(editor: Editor): void {
    super.setEditor(editor);
    this.updateButton();
  }

  protected abstract isActive(...args: any): boolean | Promise<boolean>;

  protected abstract can(...args: any): boolean | Promise<boolean>;

  private async updateButton(): Promise<void> {
    if (!this.button) return;

    const activeAction = (await this.isActive()) ? 'add' : 'remove';
    this.button.nativeElement.classList[activeAction]('active');

    if (await this.can()) {
      this.button.nativeElement.removeAttribute('disabled');
    } else {
      this.button.nativeElement.setAttribute('disabled', 'true');
    }
  }
}

@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class SelectBaseControl extends ExtendedBaseControl implements OnInit, OnDestroy, AfterViewInit {
  protected abstract eventService: TiptapEventService;
  protected abstract canStyleParams: any[] = [];

  @ViewChild(SelectComponent) protected select!: SelectComponent;
  @ViewChildren(OptionComponent) protected options!: QueryList<OptionComponent>;

  public ngOnInit(): void {
    this.eventService.update$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.updateSelectValue();
      this.updateDisabledValue();
    });
  }

  public ngAfterViewInit(): void {
    if (!isDevMode() && !this.select) {
      console.warn(`The select element in your control could not be found in ${this.constructor.name}\nPlease make sure you have a tip-select in your component`);
    }
  }

  public setEditor(editor: Editor): void {
    super.setEditor(editor);
    this.updateSelectValue();
    this.updateDisabledValue();
  }

  protected abstract canStyle(...args: any[]): boolean | Promise<boolean>;

  protected abstract currentActive(): any | Promise<any>;

  private async updateSelectValue(): Promise<void> {
    this.select.value = await this.currentActive();
  }

  private async updateDisabledValue(): Promise<void> {
    for (const [index, param] of this.canStyleParams.entries()) {
      const option = this.options.get(index);
      if (!option) continue;

      option.disabled = !(await this.canStyle(param));
    }
  }
}
