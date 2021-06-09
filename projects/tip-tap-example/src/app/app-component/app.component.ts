import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'tip-tap-example';
  html = '';
  vList = ['1', '2', '3'];
  value = '1';

  public changeValue(): void {
    if (this.vList.length > 0) {
      this.value = this.vList.pop()!;
    }
  }
}
