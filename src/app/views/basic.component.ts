import { Component, Injectable } from "@angular/core";
import { Entry } from "../entities/entry";
import { NumericEntry } from "../entities/numeric-entry";
import { OperationEntry } from "../entities/operation-entry";
import { ComputeService } from "../services/compute.service";
import { HistoryService } from "../services/history.service";
import { InputService } from "../services/input.service";


@Component({
    selector: 'basic-view',
    templateUrl: './basic.component.html',
    styleUrls: ['./basic.component.scss']
  })


export class BasicComponent {
  /**
   *
   */
  constructor(public inputService:InputService) {
  }

}