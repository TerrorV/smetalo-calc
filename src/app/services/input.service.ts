import { HostListener, Injectable } from "@angular/core";
import { BehaviorProvider } from "../behaviors/behavior.provider";
import { IBehavior } from "../behaviors/interface.behavior";
import { NumericBehavior } from "../behaviors/numeric.behavior";
import { Entry } from "../entities/entry";
import { NumericEntry } from "../entities/numeric-entry";
import { OperationEntry } from "../entities/operation-entry";
import { ComputeService } from "./compute.service";
import { HistoryService } from "./history.service";
import { LinearComputeService } from "./linear-compute.service";

@Injectable()
export class InputService {
    public basicIsVisible: boolean = true;
    operation: string = "";
    public current: string = '0';
    lastIsNumber: boolean = true;
    scopeDepth: number = 0;
    public behavior: IBehavior;

    constructor(public historySvc: HistoryService, public computeService: ComputeService, private linearC: LinearComputeService, private behaviorProvider: BehaviorProvider) {
        this.behavior = behaviorProvider.GetBehavior('0');
    }

    public AddElement(entry: Entry) {
        if (this.historySvc.entries.length > 0 && entry.constructor.name == 'NumericEntry' && this.historySvc.entries[this.historySvc.entries.length - 1].constructor.name == 'NumericEntry') {
            this.historySvc.AddElement(new OperationEntry(''));
        }

        this.historySvc.AddElement(entry);

        if (entry.constructor.name == 'OperationEntry') {
            this.operation = '';
            this.lastIsNumber = false;
            // this.entries.push(new NumericEntry(parseFloat(this.current)));
        }
        else {
            //this.current = '0';
            //this.entries.push(new OperationEntry(this.operation));


            this.current = (entry as NumericEntry).value.toString();
        }

    }

    public ShowBasic(): void {
        this.basicIsVisible = true;
    }

    public ShowAdvanced(): void {
        this.basicIsVisible = false;
    }

    public Percent() {
        var currentNum: number = parseFloat(this.current) * 0.01;
        this.current = (this.historySvc.GetLast(NumericEntry).value * currentNum).toString();
    }

    public Clear() {
        this.current = "0";
        this.operation = "";
    }

    public ClearAll() {
        console.log(this.historySvc.GetLast(NumericEntry));
        console.log(this.historySvc.GetLast(OperationEntry));
        this.historySvc.RemoveLastTransaction();
        this.ProcessInput('Escape');
    }

    public Equals() {
        console.log(this.historySvc.GetLast(NumericEntry));
        console.log(this.operation);
        var trans = this.historySvc.GetLastTransaction();
        if (trans[trans.length - 1].constructor.name == 'OperationEntry' && !this.historySvc.LastTransIsComplete() && trans[trans.length - 1].value !=")") {
            this.AddElement(new NumericEntry(parseFloat(this.current)));
            trans = this.historySvc.GetLastTransaction();
        }

        this.CloseAllBrackets();

        // // var isCompleted = this.Contains(trans, '=');
        var isCompleted = this.historySvc.LastTransIsComplete();

        if (isCompleted) {
            var newTrans: Entry[] = [];
            var result: number = trans[trans.length - 2].value as number;   //this.Calculate(trans);
            newTrans.push(new NumericEntry(result));
            newTrans.push(trans[trans.length - 5]);
            newTrans.push(trans[trans.length - 4]);
            for (const iterator of newTrans) {
                this.AddElement(iterator);
            }
            console.log(newTrans);
        }

        this.AddElement(new OperationEntry('='));
        this.AddElement(new NumericEntry(this.CalculateCurrent()));
        this.AddElement(new OperationEntry(''));

        this.current = this.historySvc.GetLast(NumericEntry).value.toString();
    }

    CloseAllBrackets() {
        if (this.operation === ')') {
            this.scopeDepth++;
        }

        for (let index = 0; index < this.scopeDepth; this.scopeDepth--) {
            this.AddElement(new OperationEntry(')'));
        }
    }

    public CalculateCurrent(): number {
        var trans = this.historySvc.GetLastTransaction();
        return this.Calculate(trans);
    }

    public Calculate(trans: Entry[]): number {
        return this.linearC.Compute(trans.reverse());
        // return this.computeService.Compute(trans.reverse());
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

    public Factoriel() {
        console.log("n!");
        var currentNum: number = parseFloat(this.current);
        var result: number = 1;
        for (let index = 1; index < currentNum + 1; index++) {
            result *= index;
        }

        this.current = '' + result;
    }


    public OpenBracket() {
        console.log("(");
        var currentNum: number = parseFloat(this.current);
        this.current = '' + (currentNum * currentNum);
    }

    public CloseBracket() {
        console.log(")");
        var currentNum: number = parseFloat(this.current);
        this.current = '' + (currentNum * currentNum);
    }

    public Root() {
        console.log("sqrt");
        var currentNum: number = parseFloat(this.current);

        this.current = '' + (Math.sqrt(currentNum));
    }

    public RaiseToPower() {
        console.log("x^y");
        this.ProcessOperation("^");
        //this.historySvc.AddElement(new OperationEntry("^"));
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
        this.ProcessInput(key);
        // switch (key) {
        //     case '%':
        //         this.Percent();
        //         break;
        //     case '=':
        //     case 'Enter':
        //         this.Equals();
        //         break;
        //     case 'Escape':
        //         this.Clear();
        //         break;
        //     default:
        //         break;
        // }

    }



    private ProcessNumber(input: string) {
        // if(this.historySvc.GetLast(Entry).value == ')'){
        //     return;
        // }
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
            //  this.historySvc.AddElement(new NumericEntry(currentNum));
            this.AddElement(new NumericEntry(currentNum));
            // this.entries.push(new NumericEntry(currentNum));
            //this.current = '0';
        } else if (this.operation == ')') {
            this.AddElement(new OperationEntry(this.operation));
        } else if (this.operation == '(') {
            this.AddElement(new OperationEntry(this.operation));

            var currentNum: number = parseFloat(this.current);
            this.AddElement(new NumericEntry(currentNum));

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



    /**
     * ProcessInput
     */
    public ProcessInput(key: string) {
        console.log(this.lastIsNumber);
        this.behavior = this.behaviorProvider.GetBehavior(key);
        switch (key) {
            case '%':
                this.Percent();
                break;
            case '=':
            case 'Enter':
                this.Equals();
                break;
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
            // case 'Enter':
            //     key = '=';
            case '/':
            case '*':
            case '-':
            case '+':
            case '^':
                // case '=':
                this.ProcessOperation(key);
                break;

            case '(':
            case ')':
                this.ProcessBrackets(key)

                break;
            default:
                break;
        }

        console.log(key);
        // console.log(this.entries);
    }

    private ProcessBrackets(key: string) {
        switch (key) {
            case '(':
                if (this.lastIsNumber && this.historySvc.entries.length > 0) {
                    return;
                }

                this.scopeDepth++;
                break;
            case ')':
                if (this.scopeDepth == 0) {
                    return;
                }

                this.scopeDepth--;
                break;
            default:
                break;
        }

        if (!this.lastIsNumber) {
            var lastOperation = this.operation;
            this.AddElement(new OperationEntry(this.operation));

            if (lastOperation == "(" && key == ")") {
                this.AddElement(new NumericEntry(parseFloat(this.current)));
            }
            //this.entries.push(new OperationEntry(this.operation));
            this.Clear();
        } else if (this.historySvc.entries.length > 0) {
            this.AddElement(new NumericEntry(parseFloat(this.current)));
        }

        this.operation = key;
        // this.AddElement(new OperationEntry(key));
        this.lastIsNumber = false;
    }
}