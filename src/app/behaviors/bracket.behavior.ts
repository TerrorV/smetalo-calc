import { Injectable } from "@angular/core";
import { strict } from "assert";
import { stringify } from "querystring";
import { Entry } from "../entities/entry";
import { HistoryService } from "../services/history.service";
import { IBehavior } from "./interface.behavior";

@Injectable()
export class BracketBehavior implements IBehavior {
    constructor(private historyService: HistoryService) {

    }

    GetFormattedTransaction(operation: string, current: string, key: string): string {
        console.log("bracketsss");
        var trans: Entry[] = this.historyService.GetLastTransaction();
        var displayText: string = '';
        for (const entry of trans) {
            displayText += entry.value;
        }

        if (trans.length > 0) {
            // if (trans[trans.length - 1].value == '(') {
            if (operation == '(') {
                displayText += operation;
                displayText += current;
            }
            else if(operation==')'){
                displayText += operation;
            }
            else if (trans[trans.length - 1].value == ')') {
                displayText += operation;
            }else if(operation == ''){
                displayText += current;
            }

        } else if (key == '(') {
            displayText += key;
        }

        return displayText;
        //throw new Error("Method not implemented.");
    }

    CanBeAdded(key: string): boolean {
        throw new Error("Method not implemented.");
    }
}