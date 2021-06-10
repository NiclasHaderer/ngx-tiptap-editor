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
    <div #content (click)="onSelect.emit(this)" (keydown.enter)="onSelect.emit(this)"
         [class.active]="selected" class="select-option select-overflow-wrapper"
         tabindex="0">
      <ng-content></ng-content>
    </div>`,
  styleUrls: ['select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionComponent {

  public onSelect = new EventEmitter<OptionComponent>();
  @Input() value: any;

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
    return this.element.nativeElement.textContent;
  }

}

@Component({
  selector: 'tip-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectComponent implements AfterViewInit, OnDestroy, OnInit {
  @Input() public placeholder = '';
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
    @Inject(DOCUMENT) private document: Document
  ) {
  }

  private _value: any;

  @Input()
  set value(value: any) {
    this._value = value;
    this.updateComponent();
  }

  public ngOnInit(): void {
    fromEvent<KeyboardEvent>(this.document, 'keyup').pipe(
      filter(e => e.key === 'Escape'),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.visible = false;
      this.cd.markForCheck();
    });
    fromEvent<KeyboardEvent>(this.document, 'click').pipe(
      filter(e => !(e.target && this.element.nativeElement.contains(e.target as Node))),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.visible = false;
      this.cd.markForCheck();
    });
  }

  public ngAfterViewInit(): void {
    // Subscribe to click events on the options
    const options = this.optionList;
    this.optionList.changes.pipe(
      startWith(...options),
      switchMap(() => merge(...options.map(o => o.onSelect)))
    ).subscribe(component => this.selectionChanged(component));
    // Update the selected value for the initial select
    this.updateComponent(true);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Update the currently selected component
   */
  private selectionChanged(component: OptionComponent): void {
    this.selectedComponent = component;
    this.value = component.value;
  }

  /**
   * Select the current component depending on the selected value
   * @param triggerUpdate Should change detection be triggered
   */
  private updateComponent(triggerUpdate = false): void {
    if (!this.optionList) return;

    // Deselect all
    this.optionList.forEach(o => o.setSelected(false));

    // Skip the find if the correct object is already selected
    if (this.selectedComponent?.value !== this.value || this.value === undefined && this.selectedComponent?.value === undefined) {
      this.selectedComponent = this.optionList.find(o => o.value === this._value);
    }

    if (this.selectedComponent) {
      this.selectedComponent.setSelected(true, triggerUpdate);
      this.change.emit(this.selectedComponent.value);

      this.selectedText = this.selectedComponent.getContent();
      triggerUpdate ? this.cd.detectChanges() : this.cd.markForCheck();
    }
    this.visible = false;
  }
}
