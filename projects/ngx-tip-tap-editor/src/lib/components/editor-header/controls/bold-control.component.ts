import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs';
import { TiptapEventService } from '../../../services/tiptap-event.service';
import { BaseControl } from './base-control';


@Component({
  selector: 'tip-bold-control',
  styleUrls: ['_styles.scss'],
  template: `
    <button (click)="toggleBold()" [class.active]="editor?.isActive('bold')" #button>
      <div class="content-wrapper" #ref>
        <ng-content #ref></ng-content>
      </div>
      <i *ngIf="ref.childNodes.length === 0" class="material-icons">format_bold</i>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: BaseControl, useExisting: forwardRef(() => BoldControlComponent)}],
})
export class BoldControlComponent extends BaseControl implements OnInit, OnDestroy {
  @ViewChild('button') private button: ElementRef<HTMLElement> | undefined;
  private subscription: Subscription | undefined;

  constructor(
    private eventService: TiptapEventService
  ) {
    super();
  }

  public ngOnInit(): void {
    this.subscription = this.eventService.update$.subscribe(() => this.setActive());
  }

  public ngOnDestroy(): void {
    this.subscription && this.subscription.unsubscribe();
  }

  public toggleBold(): void {
    this.editor && this.editor.chain().focus().toggleBold().focus().run();
  }

  private setActive(): void {
    const addRemove = this.editor?.isActive('bold') ? 'add' : 'remove';
    this.button && this.button.nativeElement.classList[addRemove]('active');
  }
}
