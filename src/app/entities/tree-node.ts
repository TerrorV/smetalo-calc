import { Entry } from "./entry";

export class TreenNode {
    Add(entry: Entry) {
        var isRight: boolean = this.Compare(entry, this);
        if (!isRight && this.left == null) {
            var node: TreenNode = new TreenNode();
            node.value = entry;
            this.left = node;
        }
        else if (isRight && this.right == null) {
            var node: TreenNode = new TreenNode();
            node.value = entry;
            this.right = node;
        }
        else if (isRight) {
            this.right.Add(entry)
        }
        else {
            this.left.Add(entry);
        }
    }

    private Compare(entry: Entry, node: TreenNode): boolean {
        if (entry.constructor.name == node.value.constructor.name) {
            if (node.right != null) {
                return true;
            }
            else if (node.left != null) {
                return false;
            }
        }

        if (entry.constructor.name == 'OperationEntry') {
            switch (entry.value) {
                case '/':
                case '*':
                case '^':
                    if (node.right == null) {
                        return false; //LEFT

                    }
                    else {
                        return true; //RIGHT
                    }
                    break;
                case '-':
                case '+':
                case '=':
                    return true; //RIGHT    

                    break;
                default:
                    break;
            }
        }
        else {
            if (node.right != null) {
                return true;
            }
            else if (node.left != null) {
                return false;
            }

            return true; // Assign numbers to the RIGHT
        }
    }

    private _left: TreenNode;
    public get left(): TreenNode {
        return this._left;
    }
    public set left(v: TreenNode) {
        this._left = v;
    }


    private _right: TreenNode;
    public get right(): TreenNode {
        return this._right;
    }
    public set right(v: TreenNode) {
        this._right = v;
    }


    private _value: Entry;
    public get value(): Entry {
        return this._value;
    }
    public set value(v: Entry) {
        this._value = v;
    }



}