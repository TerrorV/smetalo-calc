import { inherits } from "util"
import { Entry } from './entry';

export class NumericEntry implements Entry {
    value:number;

    constructor(value:number) {
        this.value = value;
    }

}