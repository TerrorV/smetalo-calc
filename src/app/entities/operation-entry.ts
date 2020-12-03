import { Entry } from "./entry";

export class OperationEntry implements Entry {
    value:string;

    constructor(value:string) {
        this.value = value;
    }
}