import { Component, OnDestroy, OnInit } from '@angular/core';
import { WorkerService } from '../../worker/worker.service';
import { Subscription } from 'rxjs/Subscription';
import { WorkerMessage } from '../../../../worker/lib/shared/worker-message.model';
import { WORKER_TOPIC } from '../../../../worker/lib/shared/topic.constants';
import { WorkerInput } from '../shared/worker-input.interface';

@Component({
  selector: 'app-worker-response',
  templateUrl: './worker-response.component.html',
  styleUrls: ['./worker-response.component.scss']
})
export class WorkerResponseComponent implements OnInit, OnDestroy, WorkerInput {

  title = 'Demo: Simple Worker Response';
  workerTopic = WORKER_TOPIC.returnAck;
  currentWorkerMessage: WorkerMessage;

  workerServiceSubscription: Subscription;

  constructor(private workerService: WorkerService) { }

  ngOnInit() {
    this.listenForWorkerResponse();
  }

  ngOnDestroy(): void {
    if (this.workerServiceSubscription) {
      this.workerServiceSubscription.unsubscribe();
    }
  }

  get workerResponse(): string {
    if (this.currentWorkerMessage) {
      return this.currentWorkerMessage.data.toString();
    }
  }

  sendWorkerRequest() {
    const workerMessage = new WorkerMessage(WORKER_TOPIC.returnAck, 'Hello World!!');
    this.workerService.doWork(workerMessage);
  }

  clearResponse() {
    if (this.workerResponse) {
      this.currentWorkerMessage = null;
    }
  }

  private listenForWorkerResponse() {
    this.workerServiceSubscription = this.workerService.workerUpdate$
      .subscribe(data => this.workerResponseParser(data));
  }

  private workerResponseParser(message: WorkerMessage) {
    if (message.topic === this.workerTopic) {
      this.currentWorkerMessage = message;
    }
  }


}
