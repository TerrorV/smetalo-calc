import { Component, HostListener } from '@angular/core';
import { Entry } from './entities/entry';
import { InputType } from './entities/input-type';
import { NumericEntry } from './entities/numeric-entry';
import { OperationEntry } from './entities/operation-entry';
import { HistoryService } from './services/history-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'smetalo-calc';
  current: string = '0';
  currentNum: number = 0;
  accumulator: number = 0;
  operation: string = "";
  //entries: Entry[] = [];

  lastOperation: InputType = InputType.Number;

  /**
   *
   */
  constructor(public historySvc: HistoryService) {


  }

  /**
   * Equals
   */
  public Equals() {
    console.log(this.historySvc.GetLast(NumericEntry));
    var trans = this.historySvc.GetLastTransaction();
    var isCompleted = this.Contains(trans, '=');

    if (isCompleted) {
      var newTrans: Entry[] = [];
      var result: number = this.Calculate(trans);
      newTrans.push(new NumericEntry(result));
      newTrans.push(trans[trans.length - 4]);
      newTrans.push(trans[trans.length - 3]);
      console.log(newTrans);
    }

    this.historySvc.AddElement(new NumericEntry(this.CalculateCurrent()));

    this.operation = '';
    if (this.operation == '=') {

    }
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

    // var trans = this.historySvc.GetLastTransaction();
    var result: number = 0;
    for (let index = 0; index < trans.length; index++) {
      const element = trans[index];
      switch (element.constructor.name) {
        case 'NumericEntry':
          result = (element as NumericEntry).value;
          break;
        case 'OperationEntry':
          if ((element as OperationEntry).value == '=') {
            continue;
          }

          result = this.ExecuteCalculation(result, (trans[index + 1] as NumericEntry).value, element as OperationEntry);
          index++;
          break;
        default:
          break;
      }
    }

    return result;
  }

  public ExecuteCalculation(accumulator: number, current: number, operation: OperationEntry): number {

    // this.currentNum = parseFloat(this.current);
    // if (this.operation == '/' && this.currentNum == 0) {
    //   return;
    // }

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
    this.currentNum = parseFloat(this.historySvc.current) * 0.01;
    this.historySvc.current = (this.historySvc.GetLast(NumericEntry).value * this.currentNum).toString();
  }

  public Clear() {
    this.current = "0";
    //this.operation = "%"

    console.log("clr");
    this.lastOperation = InputType.Number;
  }

  public ClearAll() {
    console.log(this.historySvc.GetLast(NumericEntry));
    console.log(this.historySvc.GetLast(OperationEntry));
    this.historySvc.RemoveLastTransaction();
    this.historySvc.ProcessInput('Escape');
    this.current = '0';
    this.accumulator = 0;
    this.operation = '';
    console.log("clra");
    this.lastOperation = InputType.Number;
  }


  public OneOverX() {
    console.log("1/x");
    this.currentNum = parseFloat(this.historySvc.current);
    if (this.currentNum === 0) {
      return;
    }

    this.historySvc.current = '' + (1 / this.currentNum);
  }

  public Square() {
    console.log("^2");
    this.currentNum = parseFloat(this.historySvc.current);
    this.historySvc.current = '' + (this.currentNum * this.currentNum);
  }

  public Root() {
    console.log("sqrt");
    this.currentNum = parseFloat(this.historySvc.current);

    this.historySvc.current = '' + (Math.sqrt(this.currentNum));
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
    // // console.log(event);
    // // var key: string = event.key;
    this.historySvc.ProcessInput(key);
    switch (key) {
      case '%':
        this.Percent();
        break;
      case '=':
      case 'Enter':
        //this.Calculate();
        this.Equals();
        break;
      case 'Escape':
        this.ClearAll();
        break;
      default:
        break;
    }
  }
}
