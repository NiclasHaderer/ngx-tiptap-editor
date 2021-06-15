import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { extensionLoaderFactory, NgxTipTapEditorModule, TIP_TAP_EXTENSIONS } from 'ngx-tip-tap-editor';
import { AppComponent } from './app-component/app.component';

import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxTipTapEditorModule,
  ],
  providers: [
    {
      provide: TIP_TAP_EXTENSIONS,
      useValue: extensionLoaderFactory(() => import('./extension-lazy'))
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
