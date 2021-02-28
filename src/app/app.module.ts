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
import { LinearComputeService } from './services/linear-compute.service';
import { BehaviorProvider } from './behaviors/behavior.provider';
import { BracketBehavior } from './behaviors/bracket.behavior';
import { NumericBehavior } from './behaviors/numeric.behavior';
import { OperationBehavior } from './behaviors/operation.behavior';

@NgModule({
  declarations: [
    AppComponent,
    BasicComponent,
    AdvancedComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule
  ],
  providers: [HistoryService, ComputeService, InputService,LinearComputeService, BehaviorProvider, BracketBehavior,NumericBehavior,OperationBehavior],
  bootstrap: [AppComponent]
})
export class AppModule { }
