import { DOCUMENT } from '@angular/common';
import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild
} from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

// tslint:disable-next-line:directive-selector
@Directive({selector: 'tip-option'})
export class OptionDirective {
  @Input() selected!: boolean | undefined;
  @Input() value!: any;
  @Input() text!: string;
}

// @dynamic
@Component({
  selector: 'tip-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectComponent implements AfterViewInit, AfterViewChecked, OnInit, OnDestroy {
  public isOpen = false;
  public selectedElement: OptionDirective | undefined;
  @ContentChildren(OptionDirective) optionQuery!: QueryList<OptionDirective>;
  @ViewChild('select') private select!: ElementRef<HTMLDivElement>;
  // tslint:disable-next-line:no-output-native
  @Output() public change = new EventEmitter<any>();
  private destroy$ = new Subject<boolean>();

  constructor(
    private cd: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document
  ) {
  }

  public ngOnInit(): void {
    fromEvent<KeyboardEvent>(this.document, 'keyup').pipe(
      filter(e => e.key === 'Escape'),
      takeUntil(this.destroy$)
    ).subscribe((e) => this.isOpen = false);

    fromEvent<KeyboardEvent>(this.document, 'click').pipe(
      filter(e => !(e.target && this.select.nativeElement.contains(e.target as Node))),
      takeUntil(this.destroy$)
    ).subscribe((e) => this.isOpen = false);
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public selectElement(option: OptionDirective): void {
    this.optionQuery.forEach(o => o.selected = false);
    option.selected = true;
    this.selectedElement = option;
    this.change.emit(option.value);
  }

  public ngAfterViewInit(): void {
    this.selectedElement = this.optionQuery.find(o => !!o.selected);
    this.cd.detectChanges();
  }

  public ngAfterViewChecked(): void {
    this.selectedElement = this.optionQuery.find(o => !!o.selected);
    this.cd.detectChanges();
  }
}

