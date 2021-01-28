import { Injectable } from "@angular/core";
import { Entry } from "../entities/entry";
import { NumericEntry } from "../entities/numeric-entry";
import { OperationEntry } from "../entities/operation-entry";
import { TreenNode } from "../entities/tree-node";
import { LinearComputeService } from "./linear-compute.service";

@Injectable()
export class ComputeService {

    /**
     *
     */
    constructor(private linearC:LinearComputeService) {
    
        
    }
    /**
     * Compute
transaction: Entry[]     */
    public Compute(transaction: Entry[]): number {
        transaction.reverse().splice(transaction.length - 1, 1);
        console.log(transaction);

        var tree: TreenNode = this.BuildTree(transaction);
        console.log(tree);
        try {
        //   console.log(  this.linearC.Compute(transaction));
            //console.log(this.GetComputeArray(tree));
            return this.GetValue(tree);

        } catch (error) {
            console.log(error);
            return Number.POSITIVE_INFINITY;
        }
    }

    private ExecuteSimpleCompute(leftBranch: Entry[]) {
        var result: number = leftBranch[0].value;
        for (let index = 1; index < leftBranch.length - 1; index += 2) {
            const entry = leftBranch[index + 1];
            var operation: OperationEntry = leftBranch[index] as OperationEntry;
            result = this.ExecuteCalculation(result, entry.value, operation);

        }

        return result;
    }

    private GetValue(node: TreenNode): number {
        var currentNode: TreenNode = node;
        var executeArray: Entry[] = [];
        while (currentNode.right != null) {
            if (currentNode.value.constructor.name == 'OperationEntry') {
                executeArray.push(currentNode.value);
            }
            else {
                executeArray.push(new NumericEntry(this.GetNodeValue(currentNode)));
            }
            currentNode = currentNode.right;
        }

        if (executeArray.length == 0) {
            return this.GetNodeValue(currentNode);
        }

        executeArray.push(new NumericEntry(this.GetNodeValue(currentNode)));
        return this.ExecuteSimpleCompute(executeArray);
    }

    private GetNodeValue(node: TreenNode): number {
        var currentNode: TreenNode = node;
        var executeArray: Entry[] = [];
        while ((currentNode.left != null && currentNode.value.constructor.name == 'NumericEntry') || (currentNode.right != null && currentNode.value.constructor.name == 'OperationEntry')) {
            executeArray.push(currentNode.value);
            if (currentNode.left != null) {

                currentNode = currentNode.left;
            }
            else {
                currentNode = currentNode.right;
            }
        }

        if (executeArray.length == 0) {
            return currentNode.value.value;
        }

        executeArray.push(currentNode.value);
        return this.ExecuteSimpleCompute(executeArray);
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

    private BuildTree(transaction: Entry[]): TreenNode {
        var root: TreenNode = new TreenNode();
        root.value = transaction[0];
        for (const entry of transaction) {
            if (root.value == entry) {
                continue;
            }

            root.Add(entry);
        }

        return root;
    }
}