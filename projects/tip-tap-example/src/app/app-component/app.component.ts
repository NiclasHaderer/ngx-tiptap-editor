import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'tip-tap-example';
  html = '';
  visible = true;

  public log(): any {
    console.log('hello');
  }
}
