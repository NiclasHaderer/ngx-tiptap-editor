import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  QueryList
} from '@angular/core';
import { fromEvent, merge, Subject } from 'rxjs';
import { filter, startWith, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tip-option[value]',
  template: `
    <div #content (click)="onSelect.emit(this)" (keydown.enter)="!disabled && onSelect.emit(this)"
         [class.active]="selected" class="select-option select-overflow-wrapper"
         [class.disabled]="disabled"
         tabindex="0">
      <ng-content></ng-content>
    </div>`,
  styleUrls: ['select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionComponent {

  public onSelect = new EventEmitter<OptionComponent>();
  @Input() value: any;
  @Input() useHtml = false;
  @Input() disabled = false;

  constructor(private element: ElementRef, private cd: ChangeDetectorRef) {
  }

  private _selected = false;

  public get selected(): boolean {
    return this._selected;
  }

  public setSelected(value: boolean, triggerUpdate: boolean = false): void {
    this._selected = value;
    triggerUpdate ? this.cd.detectChanges() : this.cd.markForCheck();
  }

  getContent(): string {
    return this.useHtml ? this.element.nativeElement.innerHTML : this.element.nativeElement.textContent;
  }

}

// TODO improve change detection which runs to often
// @dynamic
@Component({
  selector: 'tip-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectComponent implements AfterViewInit, OnDestroy, OnInit {
  @Input() public width = '180px';
  @Input() public placeholder = '';
  @Input() public defaultValue: any;
  @Input() public showDropdown = true;

  // tslint:disable-next-line:no-output-native
  @Output() public change = new EventEmitter<any>();
  public visible = false;
  public selectedText = '';
  public selectedComponent: OptionComponent | undefined;
  @ContentChildren(OptionComponent, {descendants: true}) private optionList!: QueryList<OptionComponent>;
  private destroy$ = new Subject();

  constructor(
    private cd: ChangeDetectorRef,
    private element: ElementRef,
    private ngZone: NgZone,
    @Inject(DOCUMENT) private document: Document
  ) {
  }

  private _value: any;

  get value(): any {
    return this._value;
  }

  @Input()
  set value(value: any) {
    this._value = value;
    this.updateComponent(false, false);
  }

  public ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      fromEvent<KeyboardEvent>(this.document, 'keyup').pipe(
        filter(e => e.key === 'Escape'),
        filter(() => this.visible),
        takeUntil(this.destroy$)
      ).subscribe(() => {
        this.ngZone.run(() => {
          this.visible = false;
          this.cd.markForCheck();
        });
      });
      fromEvent<KeyboardEvent>(this.document, 'click').pipe(
        filter(e => !(e.target && this.element.nativeElement.contains(e.target as Node))),
        filter(() => this.visible),
        takeUntil(this.destroy$)
      ).subscribe(() => {
        this.ngZone.run(() => {
          this.visible = false;
          this.cd.markForCheck();
        });
      });
    });
  }

  public ngAfterViewInit(): void {
    // Subscribe to click events on the options
    const options = this.optionList;
    this.optionList.changes.pipe(
      startWith(...options),
      switchMap(() => merge(...options.map(o => o.onSelect)))
    ).subscribe(component => {
      this._value = component.value;
      this.visible = false;
      this.updateComponent();
    });
    // Update the selected value for the initial select
    this.updateComponent(true);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Select the current component depending on the selected value
   * @param triggerUpdate Should change detection be triggered
   * @param emitUpdate Should the change be propagated
   */
  private updateComponent(triggerUpdate = false, emitUpdate = true): void {
    if (!this.optionList) return;

    if (!this.value && this.defaultValue) {
      this._value = this.defaultValue;
    }

    // Deselect all
    this.optionList.forEach(o => o.setSelected(false));
    // Select right one
    this.selectedComponent = this.optionList.find(o => o.value === this._value);

    if (this.selectedComponent) {
      this.selectedComponent.setSelected(true, triggerUpdate);
      emitUpdate && this.change.emit(this.selectedComponent.value);

      this.selectedText = this.selectedComponent.getContent();
      triggerUpdate && this.cd.detectChanges();
    }
    this.cd.markForCheck();
  }
}
