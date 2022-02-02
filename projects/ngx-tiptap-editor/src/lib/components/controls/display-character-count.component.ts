import {ChangeDetectionStrategy, Component, ElementRef, forwardRef, Input, ViewChild} from '@angular/core';
import {Editor, Extension} from '@tiptap/core';
import {CharacterCountOptions, CharacterCountStorage} from '@tiptap/extension-character-count';
import {CharacterCount} from '@tiptap/extension-character-count/src/character-count';
import {takeUntil} from 'rxjs/operators';
import {TiptapEventService} from '../../services/tiptap-event.service';
import {TiptapExtensionService} from '../../services/tiptap-extension.service';
import {BaseControl, ExtendedBaseControl} from './base-control';
import {fromEditorEvent} from '../../helpers';

@Component({
  selector: 'tip-character-count-display',
  styles: [`
    :host-context {
      color: var(--tip-light-text-color)
    }
  `],
  template: `
    <span *ngIf="displayCharacter" #character></span><br/>
    <span *ngIf="displayWordCount" #worldCount></span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: BaseControl, useExisting: forwardRef(() => DisplayCharacterCountComponent)}],
})
export class DisplayCharacterCountComponent extends ExtendedBaseControl {
  @Input() public displayLimit = true;
  @Input() public displayCharacter = true;
  @Input() public displayWordCount = true;
  @Input() public worldString = 'worlds';
  @Input() public characterString = 'characters';

  @ViewChild('character') private characterElement: ElementRef<HTMLElement> | undefined;
  @ViewChild('worldCount') private wordCountElement: ElementRef<HTMLElement> | undefined;
  private characterCountExtension: Extension<CharacterCountOptions, CharacterCountStorage> | undefined;

  constructor(
    protected eventService: TiptapEventService,
    private tiptapExtensionService: TiptapExtensionService
  ) {
    super();
  }


  public onEditorReady(editor: Editor): void {
    this.characterCountExtension = this.tiptapExtensionService.getExtension('characterCount') as typeof CharacterCount;
    fromEditorEvent(editor, 'transaction').pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.updateCharacterCountHtml();
    });
    this.updateCharacterCountHtml();
  }

  private updateCharacterCountHtml(): void {
    if (!this.editor) return;
    const characters = this.editor.storage.characterCount.characters();
    const words = this.editor.storage.characterCount.words();
    if (this.characterElement) {
      let characterString = `${characters}`;
      if (this.displayLimit && this.characterCountExtension && this.characterCountExtension.options.limit) {
        characterString += `/${this.characterCountExtension.options.limit}`;
      }
      characterString += ` ${this.characterString}`;
      this.characterElement.nativeElement.innerText = characterString;
    }
    if (this.wordCountElement) {
      this.wordCountElement.nativeElement.innerText = `${words} ${this.worldString}`;
    }
  }
}
