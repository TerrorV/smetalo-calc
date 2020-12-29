import { Component, HostListener } from '@angular/core';
import { Entry } from './entities/entry';
import { InputType } from './entities/input-type';
import { NumericEntry } from './entities/numeric-entry';
import { OperationEntry } from './entities/operation-entry';
import { ComputeService } from './services/compute-service';
import { HistoryService } from './services/history-service';

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
  constructor(public historySvc: HistoryService, public computeService : ComputeService) {


  }

  /**
   * Equals
   */
  public Equals() {
    console.log(this.historySvc.GetLast(NumericEntry));
    var trans = this.historySvc.GetLastTransaction();
    if(trans[trans.length - 1].constructor.name =='OperationEntry' && !this.historySvc.LastTransIsComplete()){
      this.historySvc.AddElement(new NumericEntry(parseFloat(this.historySvc.current)));
      trans = this.historySvc.GetLastTransaction();
    }
    
    // // var isCompleted = this.Contains(trans, '=');
    var isCompleted = this.historySvc.LastTransIsComplete();

    if (isCompleted) {
      var newTrans: Entry[] = [];
      var result: number = this.Calculate(trans);
      newTrans.push(new NumericEntry(result));
      newTrans.push(trans[trans.length - 5]);
      newTrans.push(trans[trans.length - 4]);
      for (const iterator of newTrans) {
        this.historySvc.AddElement(iterator);
      }
      console.log(newTrans);
    }

    this.historySvc.AddElement(new OperationEntry('='));
    this.historySvc.AddElement(new NumericEntry(this.CalculateCurrent()));
    this.historySvc.AddElement(new OperationEntry(''));

  }

  private Contains<T extends { value: any }>(array: T[], value: string): boolean {
    var hasEquals = false;
    for (const iterator of array) {
      if (iterator.value == value) {
        hasEquals = true;
        break;
      }
    }

    if (hasEquals && array[array.length - 1].value !== '=') {
      return true;
    }

    return false;
  }

  public CalculateCurrent(): number {
    var trans = this.historySvc.GetLastTransaction();
    return this.Calculate(trans);
  }

  public Calculate(trans: Entry[]): number {
    return this.computeService.Compute(trans.reverse());
    // // var result: number = 0;
    // // for (let index = 0; index < trans.length; index++) {
    // //   const element = trans[index];
    // //   switch (element.constructor.name) {
    // //     case 'NumericEntry':
    // //       result = (element as NumericEntry).value;
    // //       break;
    // //     case 'OperationEntry':
    // //       if ((element as OperationEntry).value == '=') {
    // //         index = trans.length;
    // //         continue;
    // //       }

    // //       result = this.ExecuteCalculation(result, (trans[index + 1] as NumericEntry).value, element as OperationEntry);
    // //       index++;
    // //       break;
    // //     default:
    // //       break;
    // //   }
    // // }

    // // return result;
  }

  public ExecuteCalculation(accumulator: number, current: number, operation: OperationEntry): number {
    switch (operation.value) {
      case '+':
        return (accumulator + current);
      case '-':
        return (accumulator - current);
      case '*':
        return (accumulator * current);
      case '/':
        if (current == 0) {
          throw new Error("Division by zero");
        }

        return (accumulator / current);
      case '':
        return current;
      default:
        throw new Error("Not implemented");
    }
  }

  public Percent() {
    var currentNum: number = parseFloat(this.historySvc.current) * 0.01;
    this.historySvc.current = (this.historySvc.GetLast(NumericEntry).value * currentNum).toString();
  }

  public Clear() {
    this.historySvc.current = "0";
  }

  public ClearAll() {
    console.log(this.historySvc.GetLast(NumericEntry));
    console.log(this.historySvc.GetLast(OperationEntry));
    this.historySvc.RemoveLastTransaction();
    this.historySvc.ProcessInput('Escape');
  }


  public OneOverX() {
    console.log("1/x");
    var currentNum: number = parseFloat(this.historySvc.current);
    if (currentNum === 0) {
      return;
    }

    this.historySvc.current = '' + (1 / currentNum);
  }

  public Square() {
    console.log("^2");
    var currentNum: number = parseFloat(this.historySvc.current);
    this.historySvc.current = '' + (currentNum * currentNum);
  }

  public Root() {
    console.log("sqrt");
    var currentNum: number = parseFloat(this.historySvc.current);

    this.historySvc.current = '' + (Math.sqrt(currentNum));
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
    this.ProcessKeyPress(key);
  }

  public ProcessKeyPress(key: string) {
    this.historySvc.ProcessInput(key);
    switch (key) {
      case '%':
        this.Percent();
        break;
      case '=':
      case 'Enter':
        this.Equals();
        break;
      case 'Escape':
        this.ClearAll();
        break;
      default:
        break;
    }

    this.ProcessKeyByType(key);
  }
  ProcessKeyByType(key: string) {
    switch (key) {
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
      case '.':
        break;
      case '/':
      case '*':
      case '-':
      case '+':
        break;
      case '=':
      case '%':
        break;
      case 'sqrt':
      case 'sqr':
      case '1/x':
        break;
      default:
        break;
    }
  }
}
