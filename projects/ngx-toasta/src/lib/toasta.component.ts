import { Component, Input, OnInit } from '@angular/core';

import { isFunction } from './toasta.utils';
import { ToastaService, ToastData, ToastaConfig, ToastaEvent, ToastaEventType } from './toasta.service';

/**
 * Toasta is container for Toast components
 */
@Component({
  selector: 'ngx-toasta',
  template: `
    <div id="toasta" [ngClass]="[position]">
        <ngx-toast *ngFor="let toast of toasts" [toast]="toast" (closeToast)="closeToast(toast)"></ngx-toast>
    </div>`
})
export class ToastaComponent implements OnInit {
  /**
   * Set of constants defines position of Toasta on the page.
   */
  static POSITIONS: Array<string> = ['bottom-right', 'bottom-left', 'bottom-center', 'bottom-fullwidth', 'top-right', 'top-left', 'top-center', 'top-fullwidth', 'center-center'];

  private _position = '';
  // The window position where the toast pops up. Possible values:
  // - bottom-right (default value from ToastConfig)
  // - bottom-left
  // - bottom-center
  // - bottom-fullwidth
  // - top-right
  // - top-left
  // - top-center
  // - top-fullwidth
  // - center-center
  @Input()
  set position(value: string) {
    if (value) {
      let notFound = true;
      for (let i = 0; i < ToastaComponent.POSITIONS.length; i++) {
        if (ToastaComponent.POSITIONS[i] === value) {
          notFound = false;
          break;
        }
      }
      if (notFound) {
        // Position was wrong - clear it here to use the one from config.
        value = this.config.position;
      }
    } else {
      value = this.config.position;
    }
    this._position = 'toasta-position-' + value;
  }

  get position(): string {
    return this._position;
  }

  // The storage for toasts.
  toasts: Array<ToastData> = [];

  constructor(private config: ToastaConfig, private toastaService: ToastaService) {
    // Initialise position
    this.position = '';
  }

  /**
   * `ngOnInit` is called right after the directive's data-bound properties have been checked for the
   * first time, and before any of its children have been checked. It is invoked only once when the
   * directive is instantiated.
   */
  ngOnInit(): void {
    // We listen events from our service
    this.toastaService.events.subscribe((event: ToastaEvent) => {
      if (event.type === ToastaEventType.ADD) {
        // Add the new one
        const toast = event.value as ToastData;
        this.add(toast);
      } else if (event.type === ToastaEventType.CLEAR) {
        // Clear the one by number
        const id = event.value as number;
        this.clear(id);
      } else if (event.type === ToastaEventType.CLEAR_ALL) {
        // Lets clear all toasts
        this.clearAll();
      }
    });
  }

  /**
   * Event listener of 'closeToast' event comes from ToastaComponent.
   * This method removes ToastComponent assosiated with this Toast.
   */
  closeToast(toast: ToastData) {
    this.clear(toast.id);
  }

  /**
   * Add new Toast
   */
  add(toast: ToastData) {
    // If we've gone over our limit, remove the earliest
    // one from the array
    if (this.config.limit && this.toasts.length >= this.config.limit) {
      this.toasts.shift();
    }
    // Add toasta to array
    this.toasts.push(toast);
    //
    // If there's a timeout individually or globally,
    // set the toast to timeout
    if (+toast.timeout) {
      this._setTimeout(toast);
    }
  }

  /**
   * Clear individual toast by id
   * @param id is unique identifier of Toast
   */
  clear(id: number) {
    if (id) {
      this.toasts.forEach((value, key) => {
        if (value.id === id) {
          if (value.onRemove && isFunction(value.onRemove)) {
            value.onRemove.call(this, value);
          }
          this.toasts.splice(key, 1);
        }
      });
    } else {
      throw new Error('Please provide id of Toast to close');
    }
  }

  /**
   * Clear all toasts
   */
  clearAll() {
    this.toasts.forEach((value, key) => {
      if (value.onRemove && isFunction(value.onRemove)) {
        value.onRemove.call(this, value);
      }
    });
    this.toasts = [];
  }

  /**
   * Custom setTimeout function for specific setTimeouts on individual toasts.
   */
  private _setTimeout(toast: ToastData) {
    window.setTimeout(() => {
      this.clear(toast.id);
    }, toast.timeout);
  }
}
