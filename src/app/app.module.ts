import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { WorkingShiftTableComponent } from './working-shift-table/working-shift-table.component';
import { WorkingShiftModalComponent } from './working-shift-modal/working-shift-modal.component';
import { LocalDatePipe } from './local-date.pipe';

@NgModule({
  declarations: [
    AppComponent,
    WorkingShiftTableComponent,
    WorkingShiftModalComponent,
    LocalDatePipe
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
