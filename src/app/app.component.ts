import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'smetalo-calc';
  current: string = '';
  accumulator: number = 0;
  operation: string = "";

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

    this.operation = '=';
    console.log("Eq");

  }

  public Add() {
    this.TransferToAccumulator();
    console.log("Add");
    this.operation = "+"

  }

  private TransferToAccumulator() {
    this.accumulator = parseFloat(this.current);
    this.current = '';
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
    this.current = "";
    this.operation = "%"

    console.log("%");
  }

  public ClearAll() {
    this.current = '';
    this.accumulator = 0;
    this.operation = '';
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
  }

  public OneOverX() {
    var currentNum: number = parseFloat(this.current);
    if (currentNum === 0) {
      return;
    }

    this.current = '' + (1 / currentNum);
  }

  public Square() {
    var currentNum: number = parseFloat(this.current);
    this.current = '' + (currentNum * currentNum);
  }

  public Root() {
    var currentNum: number = parseFloat(this.current);

    this.current = '' + (Math.sqrt(currentNum));
  }
}
