import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Observable, Subscription, interval } from 'rxjs';
import { take } from 'rxjs/operators';

import { ToastaService, ToastaConfig, ToastOptions, ToastData, ToastaEvent, ToastaEventType } from '../../../projects/ngx-toasta/src/public_api';

import { ToastPositionService } from '../toast-position.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {

  themes = [{
    name: 'Default Theme',
    code: 'default'
  }, {
    name: 'Material Design',
    code: 'material'
  }, {
    name: 'Bootstrap',
    code: 'bootstrap'
  }];


  types = [{
    name: 'Default',
    code: 'default',
  }, {
    name: 'Info',
    code: 'info'
  }, {
    name: 'Success',
    code: 'success'
  }, {
    name: 'Wait',
    code: 'wait'
  }, {
    name: 'Error',
    code: 'error'
  }, {
    name: 'Warning',
    code: 'warning'
  }];


  positions = [{
    name: 'Top Left',
    code: 'top-left',
  }, {
    name: 'Top Center',
    code: 'top-center',
  }, {
    name: 'Top Right',
    code: 'top-right',
  }, {
    name: 'Top Full Width',
    code: 'top-fullwidth',
  }, {
    name: 'Bottom Left',
    code: 'bottom-left',
  }, {
    name: 'Bottom Center',
    code: 'bottom-center',
  }, {
    name: 'Bottom Right',
    code: 'bottom-right',
  }, {
    name: 'Bottom Full Width',
    code: 'bottom-fullwidth',
  }, {
    name: 'Center Center',
    code: 'center-center',
  }];

  options = {
    title: 'Toast It!',
    msg: 'Mmmm, tasties...',
    showClose: true,
    showDuration: false,
    timeout: 5000,
    theme: this.themes[0].code,
    type: this.types[0].code
  };

  getTitle(num: number): string {
    return 'Countdown: ' + num;
  }

  getMessage(num: number): string {
    return 'Seconds left: ' + num;
  }


  position: string = this.positions[5].code;
  private insertedToasts: number[] = [];
  private subscription: Subscription;

  constructor(private toastaService: ToastaService, private toastPositionService: ToastPositionService) {

  }


  ngOnInit() {
    this.toastaService.events.subscribe((event: ToastaEvent) => {
      if (event.type === ToastaEventType.ADD) {
        let toast: ToastData = event.value;
        this.insertedToasts.push(toast.id);
      } else if (event.type === ToastaEventType.CLEAR_ALL) {
        this.insertedToasts = [];
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  newToast() {
    let toastOptions: ToastOptions = {
      title: this.options.title,
      msg: this.options.msg,
      showClose: this.options.showClose,
      showDuration: this.options.showDuration,
      timeout: this.options.timeout,
      theme: this.options.theme,
      // position: this.options.position,
      onAdd: (toast: ToastData) => {
        console.log('Toast ' + toast.id + ' has been added!');
      },
      onRemove: function (toast: ToastData) {
        console.log('Toast ' + toast.id + ' has been removed!');
      }
    };

    switch (this.options.type) {
      case 'default': this.toastaService.default(toastOptions); break;
      case 'info': this.toastaService.info(toastOptions); break;
      case 'success': this.toastaService.success(toastOptions); break;
      case 'wait': this.toastaService.wait(toastOptions); break;
      case 'error': this.toastaService.error(toastOptions); break;
      case 'warning': this.toastaService.warning(toastOptions); break;
    }
  }

  newCountdownToast() {
    let interval_ = 1000;
    let seconds = this.options.timeout / 1000;
    let subscription: Subscription;

    let toastOptions: ToastOptions = {
      title: this.getTitle(seconds || 0),
      msg: this.getMessage(seconds || 0),
      showClose: this.options.showClose,
      showDuration: this.options.showDuration,
      timeout: this.options.timeout,
      theme: this.options.theme,
      onAdd: (toast: ToastData) => {
        console.log('Toast ' + toast.id + ' has been added!');
        // Run the timer with 1 second iterval
        let observable = interval(interval_).pipe(take(seconds));
        // Start listen seconds bit
        subscription = observable.subscribe((count: number) => {
          // Update title
          toast.title = this.getTitle(seconds - count - 1 || 0);
          // Update message
          toast.msg = this.getMessage(seconds - count - 1 || 0);
        });

      },
      onRemove: function (toast: ToastData) {
        console.log('Toast ' + toast.id + ' has been removed!');
        // Stop listenning
        subscription.unsubscribe();
      }
    };

    switch (this.options.type) {
      case 'default': this.toastaService.default(toastOptions); break;
      case 'info': this.toastaService.info(toastOptions); break;
      case 'success': this.toastaService.success(toastOptions); break;
      case 'wait': this.toastaService.wait(toastOptions); break;
      case 'error': this.toastaService.error(toastOptions); break;
      case 'warning': this.toastaService.warning(toastOptions); break;
    }
  }

  clearToasties() {
    this.toastaService.clearAll();
  }

  clearLastToast() {
    this.toastaService.clear(this.insertedToasts.pop());
  }

  changePosition($event) {
    this.position = $event;
    this.toastPositionService.setPosition(this.position);
  }

}
