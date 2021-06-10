import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxTipTapEditorModule } from 'ngx-tip-tap-editor';
import { AppComponent } from './app-component/app.component';

import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxTipTapEditorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
