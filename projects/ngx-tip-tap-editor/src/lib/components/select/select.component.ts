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
  QueryList,
  Renderer2,
  SecurityContext,
  ViewChild
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { fromEvent, merge, Subject } from 'rxjs';
import { filter, startWith, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tip-option[value]',
  template: `
    <div (click)="onSelect.emit(this)" (keydown.enter)="!_disabled && onSelect.emit(this)"
         class="select-option select-overflow-wrapper"
         #option
         tabindex="0">
      <ng-content></ng-content>
    </div>`,
  styleUrls: ['select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionComponent {

  @ViewChild('option') private option: ElementRef<HTMLDivElement> | undefined;

  public onSelect = new EventEmitter<OptionComponent>();
  @Input() value: any;
  @Input() enforceHeight = false;
  @Input() useHtml = false;

  public _disabled = false;
  @Input() set disabled(value: boolean) {
    this.addOrRemoveClass(value, 'disabled');
    this._disabled = false;
  }

  constructor(private element: ElementRef) {
  }

  public setSelected(value: boolean): void {
    this.addOrRemoveClass(value, 'active');
  }

  private addOrRemoveClass(add: boolean, className: string): void {
    const operation = add ? 'add' : 'remove';
    this.option && this.option.nativeElement.classList[operation](className);
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
  @Input() public defaultValue = '';
  @Input() public showIcon = true;

  // tslint:disable-next-line:no-output-native
  @Output() public change = new EventEmitter<any>();
  // Is the dropdown visible
  public visible = false;
  @ContentChildren(OptionComponent, {descendants: true}) private optionList!: QueryList<OptionComponent>;
  @ViewChild('selectPreview') private selectPreview: ElementRef<HTMLDivElement> | undefined;
  private destroy$ = new Subject();

  constructor(
    private cd: ChangeDetectorRef,
    private element: ElementRef,
    private ngZone: NgZone,
    private renderer2: Renderer2,
    private sanitizer: DomSanitizer,
    @Inject(DOCUMENT) private document: Document
  ) {
  }

  private _value: any;

  get value(): any {
    return this._value;
  }

  @Input()
  set value(value: any) {
    // Nothing changed
    if (value === this._value) return;

    this._value = value;
    this.updateComponent(false);
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
      switchMap(() => merge(...options.map(o => o.onSelect))),
      takeUntil(this.destroy$),
    ).subscribe(component => {
      // Nothing changed
      if (this._value === component.value) return;
      this._value = component.value;
      this.visible = false;
      this.updateComponent(true);
    });
    // Update the selected value for the initial select
    this.updateComponent(false);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Select the current component depending on the selected value
   * @param emitUpdate Should the change be propagated
   */
  private updateComponent(emitUpdate: boolean): void {
    // No options => no update
    if (!this.optionList) return;

    // If no value is provided use the default value
    if (!this.value && this.defaultValue) {
      this._value = this.defaultValue;
    }

    // Deselect all
    this.optionList.forEach(o => o.setSelected(false));

    // Select right one
    const selectedComponent = this.optionList.find(o => o.value === this._value);

    let previewText = this.placeholder;
    // A component is selected, so select the component
    if (selectedComponent) {
      selectedComponent.setSelected(true);
      previewText = selectedComponent.getContent();

      emitUpdate && this.change.emit(selectedComponent.value);
    }

    const sanitizedHtml = this.sanitizer.sanitize(SecurityContext.HTML, previewText)!;
    this.selectPreview && this.renderer2.setProperty(this.selectPreview?.nativeElement, 'innerHTML', sanitizedHtml);
  }
}
