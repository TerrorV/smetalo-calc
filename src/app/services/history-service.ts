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
        if (this.entries.length > 0 && entry.constructor.name == 'NumericEntry' && this.entries[this.entries.length - 1].constructor.name == 'NumericEntry') {
            this.entries.push(new OperationEntry(''));
        }

        this.entries.push(entry);

        if (entry.constructor.name == 'OperationEntry') {
            this.operation = '';
            // this.entries.push(new NumericEntry(parseFloat(this.current)));
        }
        else {
            //this.current = '0';
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
        if (!this.lastIsNumber) {
            this.AddElement(new OperationEntry(this.operation));
            //this.entries.push(new OperationEntry(this.operation));
            this.Clear();
        }

        this.lastIsNumber = true;
        if (input == '.' && this.current.indexOf('.') < 0) {
            if (this.current == '')
                this.current = '0';
            this.current += '.';
            return;
        }
        else if (input == '.') {
            return;
        }
        else if (input == '0' && this.current == '0') {
            return;
        }
        else if (input !== '.' && this.current == '0') {
            this.current = '';
        }

        this.current += input;
    }

    private ProcessOperation(key: string) {
        console.log("Last Op:" + this.operation);
        if (this.lastIsNumber || this.operation == '') {
            var currentNum: number = parseFloat(this.current);
            this.AddElement(new NumericEntry(currentNum));
            // this.entries.push(new NumericEntry(currentNum));
            //this.current = '0';
        }

        this.operation = key;

        if (key == '=') {
            this.AddElement(new OperationEntry(key));
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
        if (this.current.length == 0) {
            this.current = '0';
        }

        console.log("del last");
        //  this.lastOperation = InputType.Number;
    }

    private Clear() {
        this.current = '0';
        //this.operation = '';
    }

    public GetLastTransaction(): Entry[] {
        // var transaction: Entry[] = [];
        // for (let index = this.entries.length - 1; index > -1; index--) {
        //     const element = this.entries[index] as OperationEntry;

        //     if (element.value == '') {
        //         break;
        //     }

        //     transaction.push(element);
        // }

        // return transaction.reverse();



        var currentTrans: Entry[] = [];
        for (let index = this.entries.length - 1; index > -1; index--) {
            const element = this.entries[index] as OperationEntry;


            // if (element.value == '' || index >= -1) {
            if (element.value === '') {
                break;
            }

            currentTrans.push(element);
        }

        return currentTrans.reverse();
    }

    /**
     * GetListOfTransactions
     */
    public GetListOfTransactions(): Entry[][] {
        var transactions: Entry[][] = [];
        var currentTrans: Entry[] = [];
        for (let index = this.entries.length - 1; index > -1; index--) {
            const element = this.entries[index] as OperationEntry;


            // if (element.value == '' || index >= -1) {
            if (element.value === '') {
                transactions.push(currentTrans.reverse());
                currentTrans = [];
            }

            currentTrans.push(element);
        }

        transactions.push(currentTrans.reverse());
        console.log(transactions);
        return transactions;
    }

    public RemoveLastTransaction() {
        var len: number = this.GetLastTransaction().length;
        console.log(len);
        this.entries = this.entries.slice(0,this.entries.length - len);

    }

    /**
     * GetLastOperation
    :OperationEntry    */
    public GetLastOperation():OperationEntry {
        for (let index = this.entries.length; index==0; index--) {
            const element = this.entries[index];
            if(element.constructor.name=='OperationEntry'){
                return element as OperationEntry;
            }
        }

        return new OperationEntry('');
    }

    /**
     * GetLastEntry
     */
    public GetLastEntry(): Entry {
        return this.entries[this.entries.length -1];
    }
}