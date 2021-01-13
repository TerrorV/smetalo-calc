import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HistoryService } from './services/history.service';
import { ComputeService } from './services/compute.service';
import { BasicComponent } from './views/basic.component';
import { AdvancedComponent } from './views/advanced.component';
import { InputService } from './services/input.service';

@NgModule({
  declarations: [
    AppComponent,
    BasicComponent,
    AdvancedComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule
  ],
  providers: [HistoryService, ComputeService, InputService],
  bootstrap: [AppComponent]
})
export class AppModule { }
