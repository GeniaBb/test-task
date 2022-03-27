import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { WorkingShiftTableComponent } from './working-shift-table/working-shift-table.component';
import { WorkingShiftModalComponent } from './working-shift-modal/working-shift-modal.component';
import { LocalDatePipe } from './local-date.pipe';
import { CraneTypePipe } from './crane-type.pipe';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    WorkingShiftTableComponent,
    WorkingShiftModalComponent,
    LocalDatePipe,
    CraneTypePipe,
  ],
  imports: [BrowserModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
