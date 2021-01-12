import { Component, HostListener } from '@angular/core';
import { Entry } from './entities/entry';
import { InputType } from './entities/input-type';
import { NumericEntry } from './entities/numeric-entry';
import { OperationEntry } from './entities/operation-entry';
import { ComputeService } from './services/compute.service';
import { HistoryService } from './services/history.service';
import { InputService } from './services/input.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'smetalo-calc';
  //current: string = '0';
  //currentNum: number = 0;
  //accumulator: number = 0;
  //operation: string = "";
  //entries: Entry[] = [];

  lastOperation: InputType = InputType.Number;

  /**
   *
   */
  constructor(public inputService:InputService, public historySvc: HistoryService, public computeService : ComputeService) {


  }

  /**
   * OnKeyPress
  key:string   */
  @HostListener('document:keydown', ['$event'])
  public OnKeyPressed(event: any) {
    if (event.handled) {
      return;
    }
    const key = event.key;
    this.inputService.ProcessKeyPress(key);
  }
}
