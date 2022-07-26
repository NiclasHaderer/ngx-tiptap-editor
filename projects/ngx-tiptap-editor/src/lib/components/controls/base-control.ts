import {
  AfterViewInit,
  Directive,
  ElementRef,
  isDevMode,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import type {Editor} from '@tiptap/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {fromEditorEvent} from '../../helpers';
import {EditorEvent} from '../../models/types';
import {OptionComponent, SelectComponent} from '../select/select.component';

export interface BaseControl {
  onEditorReady?(editor: Editor): void;

  onEditorDestroy?(): void;
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

  public setEditor(editor: Editor): void {
    super.setEditor(editor);
    fromEditorEvent(editor, 'destroy', true).pipe(takeUntil(this.destroy$))
      .subscribe(() => this.onEditorDestroy && this.onEditorDestroy());
  }

  protected isEditable(): boolean {
    return !!this.editor?.isEditable;
  }
}

@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class ButtonBaseControl extends ExtendedBaseControl implements OnDestroy, AfterViewInit {
  @ViewChild('button') protected button: ElementRef<HTMLElement> | undefined;

  protected constructor(
    protected readonly updateEvent: EditorEvent = 'transaction'
  ) {
    super();
  }

  public ngAfterViewInit(): void {
    if (!this.button && isDevMode()) {
      console.warn(`The button element in your control could not be found in ${this.constructor.name}\nPlease add #button to your control button element`);
    }
  }

  public setEditor(editor: Editor): void {
    super.setEditor(editor);
    fromEditorEvent(editor, this.updateEvent).pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateButton());
    this.updateButton();
  }

  protected abstract isActive(...args: any): boolean | Promise<boolean>;

  protected abstract can(...args: any): boolean | Promise<boolean>;

  private async updateButton(): Promise<void> {
    if (!this.button) return;

    const activeAction = (await this.isActive()) ? 'add' : 'remove';
    this.button.nativeElement.classList[activeAction]('tip-active');

    if (await this.can() && this.isEditable()) {
      this.button.nativeElement.removeAttribute('disabled');
    } else {
      this.button.nativeElement.setAttribute('disabled', 'true');
    }
  }
}

@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class SelectBaseControl extends ExtendedBaseControl implements OnDestroy, AfterViewInit {

  protected abstract canStyleParams: any[];

  @ViewChild(SelectComponent) protected select!: SelectComponent;
  @ViewChildren(OptionComponent) protected options!: QueryList<OptionComponent>;

  protected constructor(
    protected readonly updateEvent: EditorEvent = 'transaction'
  ) {
    super();
  }

  public ngAfterViewInit(): void {
    if (!isDevMode() && !this.select) {
      console.warn(`The select element in your control could not be found in ${this.constructor.name}\nPlease make sure you have a tip-select in your component`);
    }
  }

  public setEditor(editor: Editor): void {
    super.setEditor(editor);
    fromEditorEvent(editor, this.updateEvent).pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateSelectValue();
        this.updateDisabledValue();
      });
    this.updateSelectValue();
    this.updateDisabledValue();
  }

  protected abstract canStyle(...args: any[]): boolean | Promise<boolean>;

  protected abstract currentActive(): any | Promise<any>;

  private async updateSelectValue(): Promise<void> {
    this.select.value = await this.currentActive();
  }

  private async updateDisabledValue(): Promise<void> {
    const optionsList = this.options.toArray();
    for (const [index, param] of this.canStyleParams.entries()) {
      const option = optionsList[index];
      if (!option) continue;

      option.disabled = !(await this.canStyle(param) && this.isEditable());
    }
  }
}
