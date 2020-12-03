import { Component } from '@angular/core';
import { Entry } from './entities/entry';
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
  accumulator: number = 0;
  operation: string = "";
  entries:Entry[] = [];

  /**
   * Enter
   */
  public Enter(input: string) {
    // if (this.operation !== '') {
    //   this.current = '';
    // }

    // if(this.operation == "="){
    //   this.operation = '';
    // }

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

  }

  public EnterString(input: string) {
    console.log(input);

  }

  /**
   * Equals
   */
  public Equals() {

    var tempCurr:number = parseFloat(this.current);
    var tempAcc: number = this.accumulator;
    this.Calculate();

    this.accumulator = tempCurr;
  }

  public Calculate() {
    var currentNum: number = parseFloat(this.current);
    if (this.operation == '/' && currentNum == 0) {
      return;
    }

    switch (this.operation) {
      case '+':
        this.current = '' + (this.accumulator + currentNum);
        break;
      case '-':
        this.current = '' + (this.accumulator - currentNum);
        break;
      case '*':
        this.current = '' + (this.accumulator * currentNum);
        break;
      case '/':
        this.current = '' + (this.accumulator / currentNum);
        break;

      default:
        break;
    }

    // this.operation = '=';
    console.log("Eq");

  }

  public Add() {
    this.TransferToAccumulator();
    console.log("Add");
    this.operation = "+"

  }

  private TransferToAccumulator() {
    this.Calculate();

    this.accumulator = parseFloat(this.current);
    this.current = '0';
    this.entries.push(new NumericEntry(this.accumulator));
    console.log(this.entries);
  }

  public Subtract() {
    this.TransferToAccumulator();
    this.operation = "-"
    console.log("Sub");

  }

  public Multiply() {
    this.TransferToAccumulator();
    this.operation = "*"

    console.log("Mult");

  }

  public Divide() {
    this.TransferToAccumulator();
    this.operation = "/"

    console.log("Div");
  }

  public Percent() {
    // this.TransferToAccumulator();
    // this.operation="%"
    var currentNum: number = parseFloat(this.current) * 0.01;

    this.current = '' + this.accumulator * currentNum;

    console.log("%");
  }

  public Clear() {
    this.current = "0";
    //this.operation = "%"

    console.log("clr");
  }

  public ClearAll() {
    this.current = '0';
    this.accumulator = 0;
    this.operation = '';
    console.log("clra");
  }

  public InvertSign() {
    console.log("Inv");
    if (this.current[0] == "-") {
      this.current = this.current.substring(1);
    }
    else {
      this.current = '-' + this.current;
    }
  }

  public DeleteLast() {
    this.current = this.current.substring(0, this.current.length - 1);
    console.log("del last");
  }

  public OneOverX() {
    console.log("1/x");
    var currentNum: number = parseFloat(this.current);
    if (currentNum === 0) {
      return;
    }

    this.current = '' + (1 / currentNum);
  }

  public Square() {
    console.log("^2");
    var currentNum: number = parseFloat(this.current);
    this.current = '' + (currentNum * currentNum);
  }

  public Root() {
    console.log("sqrt");
    var currentNum: number = parseFloat(this.current);

    this.current = '' + (Math.sqrt(currentNum));
  }

  /**
   * OnKeyPress
key:string   */
  public OnKeyPressed(event: any) {
    console.log("key press");
    console.log(event);
    var key: string = event.key;
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

    if( this.entries[this.entries.length-1].constructor.name == "NumericEntry"){
      this.entries.push(new OperationEntry(this.operation));
    }
    console.log(this.entries);

  }

  public OnKeyDownInput(event: any) {
    console.log("key dn");
    console.log(event);
    this.OnKeyPressed(event);
    event.stopPropagation();
    event.preventDefault();
    // var key: string = event.key;
    // switch (key) {
    //   case '/':
    //     this.Divide();
    //     event.cancelBubble = true;
    //     event.stopPropagation();
    //     event.preventDefault();
    //     break;
    //   case '*':
    //     this.Multiply();
    //     event.cancelBubble = true;
    //     event.stopPropagation();
    //     event.preventDefault();
    //     break;
    //   case '-':
    //     this.Subtract();
    //     event.cancelBubble = true;
    //     event.stopPropagation();
    //     event.preventDefault();
    //     break;
    //   case '+':
    //     this.Add();
    //     event.cancelBubble = true;
    //     event.stopPropagation();
    //     event.preventDefault();
    //     break;
    //   case '=':
    //   case 'Enter':
    //     this.Calculate();
    //     break;
    //   case 'Escape':
    //     this.ClearAll();
    //     break;
    //   case 'Backspace':
    //     this.DeleteLast();
    //     break;
    //   default:
    //     break;
    // }

  }
}
