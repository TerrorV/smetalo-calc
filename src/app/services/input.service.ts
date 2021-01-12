import { HostListener, Injectable } from "@angular/core";
import { Entry } from "../entities/entry";
import { NumericEntry } from "../entities/numeric-entry";
import { OperationEntry } from "../entities/operation-entry";
import { ComputeService } from "./compute.service";
import { HistoryService } from "./history.service";

@Injectable()
export class InputService {
    public basicIsVisible: boolean = true;

    constructor(public historySvc: HistoryService, public computeService: ComputeService) {

    }

    public ShowBasic(): void {
        this.basicIsVisible = true;
    }

    public ShowAdvanced(): void {
        this.basicIsVisible = false;
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

    public Equals() {
        console.log(this.historySvc.GetLast(NumericEntry));
        var trans = this.historySvc.GetLastTransaction();
        if (trans[trans.length - 1].constructor.name == 'OperationEntry' && !this.historySvc.LastTransIsComplete()) {
            this.historySvc.AddElement(new NumericEntry(parseFloat(this.historySvc.current)));
            trans = this.historySvc.GetLastTransaction();
        }

        // // var isCompleted = this.Contains(trans, '=');
        var isCompleted = this.historySvc.LastTransIsComplete();

        if (isCompleted) {
            var newTrans: Entry[] = [];
            var result: number = trans[trans.length - 2].value as number;   //this.Calculate(trans);
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

    public CalculateCurrent(): number {
        var trans = this.historySvc.GetLastTransaction();
        return this.Calculate(trans);
    }

    public Calculate(trans: Entry[]): number {
        return this.computeService.Compute(trans.reverse());
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

    public Factoriel() {
        console.log("n!");
        var currentNum: number = parseFloat(this.historySvc.current);
        var result: number = 1;
        for (let index = 1; index < currentNum + 1; index++) {
            result *= index;
        }

        this.historySvc.current = '' + result;
    }


    public OpenBracket() {
        console.log("(");
        var currentNum: number = parseFloat(this.historySvc.current);
        this.historySvc.current = '' + (currentNum * currentNum);
    }

    public CloseBracket() {
        console.log(")");
        var currentNum: number = parseFloat(this.historySvc.current);
        this.historySvc.current = '' + (currentNum * currentNum);
    }

    public Root() {
        console.log("sqrt");
        var currentNum: number = parseFloat(this.historySvc.current);

        this.historySvc.current = '' + (Math.sqrt(currentNum));
    }

    public RaiseToPower() {
        console.log("x^y");

        this.historySvc.AddElement(new OperationEntry("^"));
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
                this.Clear();
                break;
            default:
                break;
        }

    }
}