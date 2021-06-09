import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxTipTapEditorModule } from 'ngx-tip-tap-editor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app-component/app.component';

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
export class AppModule { }
