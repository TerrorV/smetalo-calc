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
        var tree: TreenNode = this.BuildTree(transaction);
        console.log(tree);

        return this.GetValue(tree);
    }

    private GetValue(node: TreenNode): number {
        var result: number = node.value.value;
        if (node.value.constructor.name == 'OperationEntry') {
            return this.GetValue(node.right);
        }

        if (node.left != null) {
            result = this.ExecuteCalculation(result, this.GetValue(node.left), node.left.value);
            //left = this.GetValue(node.left);
        }

        if (node.right != null) {
            // right = this.GetValue(node.right);
            result = this.ExecuteCalculation(result, this.GetValue(node.right), node.right.value);
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