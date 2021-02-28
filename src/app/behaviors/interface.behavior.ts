export interface IBehavior {
    GetFormattedTransaction(operation:string, current:string, key:string):string;

    CanBeAdded(key:string):boolean;
}