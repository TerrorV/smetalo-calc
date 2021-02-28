import { Injectable } from "@angular/core";
import { Entry } from "../entities/entry";
import { HistoryService } from "../services/history.service";
import { IBehavior } from "./interface.behavior";

@Injectable()
export class OperationBehavior implements IBehavior {
    constructor(private historyService: HistoryService) {

    }

    GetFormattedTransaction(operation: string, current: string, key: string): string {
        console.log('operation behavior');
        var trans: Entry[] = this.historyService.GetLastTransaction();
        var displayText: string = '';
        for (const entry of trans) {
            displayText += entry.value;
        }

        if (trans.length > 0) {
            if (trans[trans.length - 1].value == '(') {
                displayText += current;
            }
            else if (trans[trans.length - 1].value == ')') {
               // displayText += operation;
            }else if(operation == '' && !this.historyService.LastTransIsComplete()){
                displayText += current;
            }


            displayText +=  operation;
        }else{
            displayText += current + operation;
        }


        return displayText;
    }

    CanBeAdded(key: string): boolean {
        throw new Error("Method not implemented.");
    }
}