import { Entry } from "./entry";

export class OperationEntry implements Entry {
    value: string;

    constructor(value: string) {
        this.value = value;
    }

    /**
     * IsBiggerThan
entry:OperationEntry     */
    public IsBiggerThan(entry: OperationEntry): boolean {
        var first: number = this.ValueToNumber(this.value);
        var second: number = this.ValueToNumber(entry.value);
        return first > second;
    }

    public IsEqaul(entry: OperationEntry): boolean {
        var first: number = this.ValueToNumber(this.value);
        var second: number = this.ValueToNumber(entry.value);
        return first == second;
    }

    public IsSmallerThan(entry: OperationEntry): boolean {
        var first: number = this.ValueToNumber(this.value);
        var second: number = this.ValueToNumber(entry.value);
        return first < second;
    }

    private ValueToNumber(value: string): number {
        switch (value) {
            case "+":
            case "-":
                return 0;
            case "*":
            case "/":
                return 1;
            case "^":
                return 2;
            case "(":
                return 99;
            case ")":
                return -1;
            default:
                return -1;
        }
    }
}