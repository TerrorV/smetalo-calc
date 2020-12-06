import { Component, HostListener } from '@angular/core';
import { Entry } from './entities/entry';
import { InputType } from './entities/input-type';
import { NumericEntry } from './entities/numeric-entry';
import { OperationEntry } from './entities/operation-entry';

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
  entries: Entry[] = [];

  lastOperation: InputType = InputType.Number;
  /**
   * Enter
   */
  public Enter(input: string) {
    if (input == '.' && this.current.indexOf('.') < 0) {
      if (this.current == '')
        this.current = '0';
      this.current += '.';
    }
    else if (input == '0' && this.current == '0') {
      return;
    }
    else if (input !== '.') {
      if (this.current == '0') {
        this.current = '';
      }

      this.current += input;
      console.log(input);
    }

    this.lastOperation = InputType.Number;
  }


  TransferOperationToAccumulator() {
    this.entries.push(new OperationEntry(this.operation));
  }

  public EnterString(input: string) {
    console.log(input);

  }

  /**
   * Equals
   */
  public Equals() {
    if (this.operation == '=') {

      this.operation = (this.entries[this.entries.length - 3] as OperationEntry).value;
      this.accumulator = (this.entries[this.entries.length - 2] as NumericEntry).value;
    }

    // this.currentNum = parseFloat(this.current);
    // var tempAcc: number = this.accumulator;
    // //this.Calculate();
    this.TransferNumberToAccumulator();
    this.operation = '=';
    this.TransferOperationToAccumulator();
    //this.accumulator = tempCurr;
    this.lastOperation = InputType.Operation;
  }

  public Calculate() {
    this.currentNum = parseFloat(this.current);
    if (this.operation == '/' && this.currentNum == 0) {
      return;
    }

    switch (this.operation) {
      case '+':
        this.current = '' + (this.accumulator + this.currentNum);
        break;
      case '-':
        this.current = '' + (this.accumulator - this.currentNum);
        break;
      case '*':
        this.current = '' + (this.accumulator * this.currentNum);
        break;
      case '/':
        this.current = '' + (this.accumulator / this.currentNum);
        break;

      default:
        break;
    }

    // this.operation = '=';
    console.log("Eq");

  }

  private TransferNumberToAccumulator() {
    if (this.lastOperation == InputType.Operation) {
      return;
    }

    this.currentNum = parseFloat(this.current);
    this.entries.push(new NumericEntry(this.accumulator));
    this.Calculate();
    this.current = '0';

    console.log(this.entries);
  }

  public Add() {
    this.TransferNumberToAccumulator();
    console.log("Add");
    this.operation = "+"
    this.lastOperation = InputType.Operation;

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
    this.current = '0';
    this.accumulator = 0;
    this.operation = '';
    console.log("clra");
    this.lastOperation = InputType.Number;
  }

  public InvertSign() {
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
    this.currentNum = parseFloat(this.current);
    if (this.currentNum === 0) {
      return;
    }

    this.current = '' + (1 / this.currentNum);
    this.lastOperation = InputType.Operation;
  }

  public Square() {
    console.log("^2");
    this.currentNum = parseFloat(this.current);
    this.current = '' + (this.currentNum * this.currentNum);
    this.lastOperation = InputType.Operation;
  }

  public Root() {
    console.log("sqrt");
    this.currentNum = parseFloat(this.current);

    this.current = '' + (Math.sqrt(this.currentNum));
    this.lastOperation = InputType.Operation;
  }

  /**
   * OnKeyPress
  key:string   */
  @HostListener('document:keydown', ['$event.key'])
  public OnKeyPressed(key: string) {
    console.log("key press");
    // // console.log(event);
    // // var key: string = event.key;
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
      default:
        break;
    }

    if (this.entries[this.entries.length - 1].constructor.name == "NumericEntry") {
      this.entries.push(new OperationEntry(this.operation));
    }
  }
}
