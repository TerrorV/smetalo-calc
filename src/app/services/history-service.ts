import { Injectable } from '@angular/core';
import { Entry } from '../entities/entry';
import { NumericEntry } from '../entities/numeric-entry';
import { OperationEntry } from '../entities/operation-entry';

@Injectable()
export class HistoryService {
    public entries: Entry[] = [];
    operation: string = "";
    public current: string = '0';
    lastIsNumber: boolean = true;

    constructor() {

    }

    public AddElement(entry: Entry) {
        this.entries.push(entry);

        if (entry.constructor.name == 'OperationEntry') {
            this.operation='';
            // this.entries.push(new NumericEntry(parseFloat(this.current)));
        }
        else {
            this.current='0';
            //this.entries.push(new OperationEntry(this.operation));
            
            this.current = (entry as NumericEntry).value.toString();
        }

    }
    /**
     * ProcessInput
     */
    public ProcessInput(key: string) {
        console.log(this.lastIsNumber);
        switch (key) {
            case 'Escape':
                this.Clear();
                break;
            case 'Backspace':
                this.DeleteLast();
                break;
            case 'inv':
                this.InvertSign();
                break;
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
                this.ProcessNumber(key);
                break;
            case 'Enter':
                key = '=';
            case '/':
            case '*':
            case '-':
            case '+':
            case '%':
            case '=':
                this.ProcessOperation(key);
                break;
            default:
                break;
        }

        console.log(key);
        console.log(this.entries);
    }

    private ProcessNumber(input: string) {
        
        // if (!this.lastIsNumber && this.operation !== '') {
            if (!this.lastIsNumber ) {
            this.AddElement(new OperationEntry(this.operation));
            //this.entries.push(new OperationEntry(this.operation));
            this.Clear();
        }
        
        if (input == '.' && this.current.indexOf('.') < 0) {
            if (this.current == '')
                this.current = '0';
            this.current += '.';
        }
        else if (input == '0' && this.current == '0') {
            return;
        }
        else if (input !== '.' && this.current == '0') {
            this.current = '';
        }


        this.current += input;


        this.lastIsNumber = true;
    }

    private ProcessOperation(key: string) {
        this.operation = key;
        if (this.lastIsNumber ) {
            var currentNum: number = parseFloat(this.current);
            this.AddElement(new NumericEntry(currentNum));
            // this.entries.push(new NumericEntry(currentNum));
            //this.current = '0';
        }

        if(key=='='){
            this.AddElement(new OperationEntry(this.operation));
        }
        
        this.lastIsNumber = false;
    }

    private InvertSign() {
        console.log("Inv");
        if (this.current[0] == "-") {
            this.current = this.current.substring(1);
        }
        else {
            this.current = '-' + this.current;
        }
        // this.lastOperation = InputType.Number;
    }

    private DeleteLast() {
        this.current = this.current.substring(0, this.current.length - 1);
        console.log("del last");
        //  this.lastOperation = InputType.Number;
    }

    private Clear() {
        this.current = '0';
        //this.operation = '';
    }

    /**
     * GetLastTransaction
     */
    public GetLastTransaction(): Entry[] {
        var transaction: Entry[] = [];
        for (let index = this.entries.length - 1; index > -1; index--) {
            const element = this.entries[index] as OperationEntry;


            if (element.value == '=') {
                if (index == this.entries.length - 1) {
                    continue;
                }
                else {
                    break;
                }
            }

            transaction.push(element);
        }

        return transaction.reverse();
    }

    public RemoveLastTransaction() {
        var len: number = this.GetLastTransaction().length;
        this.entries = this.entries.slice(this.entries.length - len);

    }

}