import { AfterViewInit, Component, Input, Output, EventEmitter } from '@angular/core';

import { ToastData } from './toasta.service';

/**
 * A Toast component shows message with title and close button.
 */
@Component({
  selector: 'ngx-toast',
  template: `
        <div class="toast" [ngClass]="[toast.type, toast.theme]">
            <div *ngIf="toast.showClose" class="close-button" (click)="close($event)"></div>
            <div *ngIf="toast.title || toast.msg" class="toast-text">
                <span *ngIf="toast.title" class="toast-title" [innerHTML]="toast.title | safeHtml"></span>
                <br *ngIf="toast.title && toast.msg" />
                <span *ngIf="toast.msg" class="toast-msg" [innerHtml]="toast.msg | safeHtml"></span>
            </div>
            <div class="durationbackground" *ngIf="toast.showDuration && toast.timeout > 0">
                <div class="durationbar" [style.width.%]="progressPercent">
                </div>
            </div>
        </div>`
})
export class ToastComponent implements AfterViewInit {

  progressInterval: number;
  progressPercent = 0;
  startTime: number = performance.now();
  @Input() toast: ToastData;
  @Output('closeToast') closeToastEvent = new EventEmitter();

  ngAfterViewInit() {
    if (this.toast.showDuration && this.toast.timeout > 0) {
      this.progressInterval = window.setInterval(() => {
        this.progressPercent = (100 - ((performance.now() - this.startTime) / this.toast.timeout * 100)); // Descending progress

        if (this.progressPercent <= 0) {
          clearInterval(this.progressInterval);
        }
      }, 16.7); // 60 fps
    }
  }

  /**
   * Event handler invokes when user clicks on close button.
   * This method emit new event into ToastaContainer to close it.
   */
  close($event: any) {
    $event.preventDefault();
    this.closeToastEvent.next(this.toast);

    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
  }
}
