import { Entry } from "../entities/entry";
import { NumericEntry } from "../entities/numeric-entry";
import { OperationEntry } from "../entities/operation-entry";

export class LinearComputeService {
    /**
 * Compute
transaction: Entry[]     */
    public Compute(transaction: Entry[]): number {
        transaction.reverse().splice(transaction.length - 1, 1);
        return this.InternalCompute(transaction);
    }

    public InternalCompute1(transaction: Entry[]): number {
        //  transaction.reverse().splice(transaction.length - 1, 1);
        console.log(transaction);

        var result: number = transaction[0].value;
        // var operation:OperationEntry;
        for (let index = 1; index < transaction.length - 1; index += 2) {
            const operation: OperationEntry = transaction[index] as OperationEntry;
            var operand: NumericEntry = transaction[index + 1];
            if (index + 2 < transaction.length && operation.IsSmallerThan(transaction[index + 2] as OperationEntry)) {
                // var endIndex: number = this.GetNextChangeIndex(transaction, index + 1, transaction[index + 2] as OperationEntry)
                var endIndex: number = this.GetNextChangeIndex(transaction, index + 1, operation)
                operand = new NumericEntry(this.InternalCompute(transaction.slice(index + 1, endIndex + 1)));
                index = endIndex - 1;
            }
            // else if (index + 2 < transaction.length && (!operation.IsSmallerThan(transaction[index + 2] as OperationEntry) && !operation.IsBiggerThan(transaction[index + 2] as OperationEntry))) {
            // } else {
            //     result = this.ExecuteCalculation(result, operand.value, operation);
            //     return result;
            // }

            result = this.ExecuteCalculation(result, operand.value, operation);
            // result = this.ExecuteCalculation(result, operand.value, operation);
        }

        return result;
    }

    public InternalCompute(transaction: Entry[]): number {
        //  transaction.reverse().splice(transaction.length - 1, 1);
        console.log(transaction);

        var result: number = 0; //transaction[0].value;
        var prevOperation: OperationEntry = new OperationEntry('');

        // var operation:OperationEntry;
        for (let index = 0; index < transaction.length - 1; index++) {
            const temp: Entry = transaction[index];

            switch (temp.constructor.name) {
                case 'OperationEntry':
                    var operand: Entry = transaction[index + 1];
                    const operation: OperationEntry = temp as OperationEntry;
                    if (operation.value == '(') {
                        var endIndex: number = this.GetNextChangeIndex(transaction, index + 1, prevOperation);
                        // var endIndex: number = this.GetNextChangeIndex(transaction, index + 1, new OperationEntry(')'));
                        operand = new NumericEntry(this.InternalCompute(transaction.slice(index + 1, endIndex + 1)));
                        index = endIndex + 1;

                        if (prevOperation.value == '') {
                            result = operand.value;
                            continue;
                        }

                    } else if (index + 2 < transaction.length && operation.IsSmallerThan(transaction[index + 2] as OperationEntry)) {
                        // var endIndex: number = this.GetNextChangeIndex(transaction, index + 1, transaction[index + 2] as OperationEntry)
                        var endIndex: number = this.GetNextChangeIndex(transaction, index + 1, operation)
                        operand = new NumericEntry(this.InternalCompute(transaction.slice(index + 1, endIndex + 1)));
                        // index = endIndex - 1;
                        index = endIndex;
                    } else {
                        if (operand.constructor.name == 'OperationEntry') {
                            // var endIndex: number = this.GetNextChangeIndex(transaction, index + 1, operand as OperationEntry)
                            var endIndex: number = this.GetNextChangeIndex(transaction, index + 1, operation)
                            operand = new NumericEntry(this.InternalCompute(transaction.slice(index + 1, endIndex + 1)));
                            index = endIndex - 1;
                        }

                        index++;
                    }

                    result = this.ExecuteCalculation(result, operand.value, operation);
                    prevOperation = operation;

                    break;
                case 'NumericEntry':
                    if (prevOperation.value == '') {
                        result = temp.value;
                    }
                    break;
                default:
                    break;
            }

            // else if (index + 2 < transaction.length && (!operation.IsSmallerThan(transaction[index + 2] as OperationEntry) && !operation.IsBiggerThan(transaction[index + 2] as OperationEntry))) {
            // } else {
            //     result = this.ExecuteCalculation(result, operand.value, operation);
            //     return result;
            // }

            // result = this.ExecuteCalculation(result, operand.value, operation);
        }

        return result;
    }
    
    private GetNextChangeIndex(transaction: Entry[], startIndex: number, currentOperation: OperationEntry): number {
        for (let index = startIndex; index < transaction.length; index++) {
            const element = transaction[index];
            // if (element.constructor.name === 'OperationEntry' && (currentOperation.IsBiggerThan(element as OperationEntry) || currentOperation.IsSmallerThan(element as OperationEntry))) {
            if (element.constructor.name == 'NumericEntry' && 
            (index==transaction.length-1 ||        
            !(transaction[index + 1] as OperationEntry).IsBiggerThan(currentOperation))) {
                return index;
            }else if (element.value == '(') {
                var endIndex: number = this.GetNextChangeIndex(transaction, index + 1, new OperationEntry(')'));
                index=endIndex +1;
            } else if (element.constructor.name === 'OperationEntry' && (!currentOperation.IsSmallerThan(element as OperationEntry))) {
                return index - 1;
            }
        }

        return transaction.length;
    }
/*
    private GetNextChangeIndex(transaction: Entry[], startIndex: number, currentOperation: OperationEntry): number {
        for (let index = startIndex; index < transaction.length; index++) {
            const element = transaction[index];
            // if (element.constructor.name === 'OperationEntry' && (currentOperation.IsBiggerThan(element as OperationEntry) || currentOperation.IsSmallerThan(element as OperationEntry))) {
            if (currentOperation.value == '(') {
                var endIndex: number = this.GetNextChangeIndex(transaction, index + 1, new OperationEntry(')'));
            } else if (element.constructor.name === 'OperationEntry' && (!currentOperation.IsSmallerThan(element as OperationEntry))) {
                return index - 1;
            }
            else if (element.constructor.name == 'NumericEntry' && !(transaction[index + 1] as OperationEntry).IsBiggerThan(currentOperation)) {
                return index;
            }
        }

        return transaction.length;
    }
*/
    private ExecuteSimpleCompute(transaction: Entry[]): number {
        var result: number = transaction[0].value;
        for (let index = 1; index < transaction.length - 1; index += 2) {
            const entry = transaction[index + 1];
            var operation: Entry = transaction[index];
            result = this.ExecuteCalculation(result, entry.value, operation as OperationEntry);

        }

        return result;
    }


    public ExecuteCalculation(accumulator: number, current: number, operation: OperationEntry): number {
        switch (operation.value) {
            case '+':
                return (accumulator + current);
            case '-':
                return (accumulator - current);
            case '*':
                return (accumulator * current);
            case '^':
                return Math.pow(accumulator, current);
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
    }


}