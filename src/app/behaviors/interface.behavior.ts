export interface IBehavior {
    GetFormattedTransaction(operation:string, current:string):string;

    CanBeAdded(key:string):boolean;
}