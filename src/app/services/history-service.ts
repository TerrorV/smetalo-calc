import { Injectable } from '@angular/core';
import { Entry } from '../entities/entry';
import { NumericEntry } from '../entities/numeric-entry';
import { OperationEntry } from '../entities/operation-entry';

@Injectable()
export class HistoryService {
    entries: Entry[] = [];
    operation: string = "";
    current: string = '0';
    lastIsNumber: boolean = true;

    constructor() {

    }

    /**
     * ProcessInput
     */
    public ProcessInput(key: string) {
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

        console.log(this.entries);
    }

    ProcessNumber(input: string) {
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
        if (!this.lastIsNumber) {
            this.entries.push(new OperationEntry(this.operation));
        }

        this.lastIsNumber = true;
    }

    ProcessOperation(key: string) {
        this.operation = key;
        if (this.lastIsNumber) {
            var currentNum: number = parseFloat(this.current);
            this.entries.push(new NumericEntry(currentNum));
            this.current = '0';
        }

        this.lastIsNumber = false;
    }
}