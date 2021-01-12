import { Component } from "@angular/core";
import { InputService } from "../services/input.service";


@Component({
    selector: 'advanced-view',
    templateUrl: './advanced.component.html',
    styleUrls: ['./advanced.component.scss']
  })


export class AdvancedComponent {
    constructor(public inputService:InputService) {
    }
  }