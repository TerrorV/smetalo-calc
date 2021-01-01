import { Injectable } from "@angular/core";
import { Entry } from "../entities/entry";
import { OperationEntry } from "../entities/operation-entry";
import { TreenNode } from "../entities/tree-node";

@Injectable()
export class ComputeService {

    /**
     * Compute
transaction: Entry[]     */
    public Compute(transaction: Entry[]): number {
        transaction.reverse().splice(transaction.length - 1, 1);
        console.log(transaction);

        var tree: TreenNode = this.BuildTree(transaction);
        console.log(tree);
        try {
            console.log( this.GetComputeArray(tree));
            return this.GetValue(tree);

        } catch (error) {
            return Number.POSITIVE_INFINITY;
        }
    }

    private GetValue(node: TreenNode): number {
        var result: number = node.value.value;
        if (node.value.constructor.name == 'OperationEntry') {
            return this.GetValue(node.right);
        }

        if (node.left != null) {
            var leftBranch =  this.GetComputeArray(node.left);
            result = this.ExecuteSimpleCompute(leftBranch, result);
            //result = this.ExecuteCalculation(result, this.GetValue(node.left), node.left.value);
            //left = this.GetValue(node.left);
        }

        if (node.right != null) {
            // right = this.GetValue(node.right);
            result = this.ExecuteCalculation(result, this.GetValue(node.right), node.right.value);
        }

        return result;
    }

    private ExecuteSimpleCompute(leftBranch: Entry[], initial: number) {
        var result: number = initial;
        for (let index = 0; index < leftBranch.length - 1; index += 2) {
            const entry = leftBranch[index];
            var operation: Entry = leftBranch[index + 1];
            result = this.ExecuteCalculation(result, entry.value, operation);

        }
        return result;
    }

    private GetComputeArray(node: TreenNode): Entry[] {
        var result: Entry[] = [];
        if (node.value.constructor.name == 'OperationEntry') {
            for (const entry of this.GetComputeArray(node.right)) {
                result.push(entry);
            }

        result.push(node.value);

            return result;
        }

        if (node.left != null) {
            for (const entry of this.GetComputeArray(node.left)) {
                result.push(entry);
            }

            //left = this.GetValue(node.left);
        }

        if (node.right != null) {
            for (const entry of this.GetComputeArray(node.right)) {
                result.push(entry);
            }
        }

        result.push(node.value);
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