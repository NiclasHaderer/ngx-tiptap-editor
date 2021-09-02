import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxTipTapEditorModule } from 'ngx-tiptap-editor';
import { AppComponent } from './app-component/app.component';

import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'serverApp'}),
    AppRoutingModule,
    NgxTipTapEditorModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
