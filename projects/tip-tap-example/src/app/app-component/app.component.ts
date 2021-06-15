import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'tip-tap-example';
  public editorContent: string | null = null;

  public log(): any {
    console.log('hello');
  }

  public ngOnInit(): void {
    const content = (localStorage.getItem('editor'));
    if (content) {
      this.editorContent = JSON.parse(content);
    }
  }

  public save($event: object): void {
    localStorage.setItem('editor', JSON.stringify($event));
  }
}
