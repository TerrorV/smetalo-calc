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
   * Enter
   */
  public Enter(input: string) {
    // if (input == '.' && this.current.indexOf('.') < 0) {
    //   if (this.current == '')
    //     this.current = '0';
    //   this.current += '.';
    // }
    // else if (input == '0' && this.current == '0') {
    //   return;
    // }
    // else if (input !== '.') {
    //   if (this.current == '0') {
    //     this.current = '';
    //   }

    //   this.current += input;
    //   console.log(input);
    // }

    // this.lastOperation = InputType.Number;
  }


  // TransferOperationToAccumulator() {
  //   this.entries.push(new OperationEntry(this.operation));
  // }

  /**
   * Equals
   */
  public Equals() {
    
    this.historySvc.AddElement(new NumericEntry(this.Calculate()));
    
    this.operation = '';
    if (this.operation == '=') {
   
    }
 }

  public Calculate(): number {
    var trans = this.historySvc.GetLastTransaction();
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

    // // this.operation = '=';
    // console.log("Eq");

  }

  // private TransferNumberToAccumulator() {
  //   if (this.lastOperation == InputType.Operation) {
  //     return;
  //   }

  //   this.currentNum = parseFloat(this.current);
  //   this.accumulator = this.currentNum;
  //   this.entries.push(new NumericEntry(this.accumulator));
  //   //this.Calculate();
  //   this.current = '0';

  //   console.log(this.entries);
  // }

  public Add() {
    // this.TransferNumberToAccumulator();
    // console.log("Add");
    // this.operation = "+"
    // this.lastOperation = InputType.Operation;

  }

  public Subtract() {
    // this.TransferNumberToAccumulator();
    this.operation = "-"
    console.log("Sub");
    this.lastOperation = InputType.Operation;

  }

  public Multiply() {
    //  this.TransferNumberToAccumulator();
    this.operation = "*"

    console.log("Mult");
    this.lastOperation = InputType.Operation;

  }

  public Divide() {
    //this.TransferNumberToAccumulator();
    this.operation = "/"

    console.log("Div");
    this.lastOperation = InputType.Operation;
  }

  public Percent() {
    // this.TransferToAccumulator();
    // this.operation="%"
    this.currentNum = parseFloat(this.current) * 0.01;

    this.current = '' + this.accumulator * this.currentNum;

    console.log("%");
    this.lastOperation = InputType.Operation;
  }

  public Clear() {
    this.current = "0";
    //this.operation = "%"

    console.log("clr");
    this.lastOperation = InputType.Number;
  }

  public ClearAll() {
    this.historySvc.RemoveLastTransaction();
    this.historySvc.ProcessInput('Escape');
    this.current = '0';
    this.accumulator = 0;
    this.operation = '';
    console.log("clra");
    this.lastOperation = InputType.Number;
  }

  public InvertSign() {
    // this.historySvc.ProcessInput('inv');
    console.log("Inv");
    if (this.current[0] == "-") {
      this.current = this.current.substring(1);
    }
    else {
      this.current = '-' + this.current;
    }
    this.lastOperation = InputType.Number;
  }

  public DeleteLast() {
    this.current = this.current.substring(0, this.current.length - 1);
    console.log("del last");
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
        this.Enter(key);
        break;
      case '/':
        this.Divide();
        break;
      case '*':
        this.Multiply();
        break;
      case '-':
        this.Subtract();
        break;
      case '+':
        this.Add();
        break;
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
      case 'Backspace':
        this.DeleteLast();
        break;
      case 'inv':
        this.InvertSign();
      default:
        break;
    }
  }

  // // onInputKeyDown(e) {
  // //     this.OnKeyPressed(e);
  // //     e.handled = true;
  // // }
}
