import { Component } from '@angular/core';

import { ToastPositionService } from './toast-position.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  private toastaPosition: string;

  constructor(private toastCommunicationService: ToastPositionService) {
    this.toastCommunicationService.position$.subscribe(pos => this.toastaPosition = pos);
  }
}
