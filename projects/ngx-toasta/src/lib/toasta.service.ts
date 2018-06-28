import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { isString, isNumber, isFunction } from './toasta.utils';



/**
 * Options to configure a new Toast
 */
@Injectable()
export class ToastOptions {
  title: string;
  msg?: string;
  showClose?: boolean;
  theme?: string;
  timeout?: number;
  onAdd?: Function;
  onRemove?: Function;
}

/**
 * Structrure of a created Toast
 */
@Injectable()
export class ToastData {
  id: number;
  title: string;
  msg: string;
  showClose: boolean;
  type: string;
  theme: string;
  timeout: number;
  onAdd: Function;
  onRemove: Function;
  onClick: Function;
}

/**
 * Default configuration for all toasts and toasta container
 */
@Injectable()
export class ToastaConfig {

  // Maximum number of toasties to show at once
  limit: number = 5;

  // Whether to show the 'X' icon to close the toast
  showClose: boolean = true;

  // The window position where the toast pops up
  position: 'bottom-right' | 'bottom-left' | 'bottom-center' | 'bottom-fullwidth' | 'top-right' | 'top-left' | 'top-center' | 'top-fullwidth' | 'center-center' = 'bottom-right';

  // How long (in miliseconds) the toasta shows before it's removed. Set to null/0 to turn off.
  timeout: number = 5000;

  // What theme to use
  theme: 'default' | 'material' | 'bootstrap' = 'default';
}

export enum ToastaEventType {
  ADD,
  CLEAR,
  CLEAR_ALL
}

export class ToastaEvent {
  constructor(public type: ToastaEventType, public value?: any) { }
}

export function toastaServiceFactory(config: ToastaConfig): ToastaService {
  return new ToastaService(config);
}

/**
 * Toasta service helps create different kinds of Toasts
 */
@Injectable()
export class ToastaService {
  // Allowed THEMES
  static THEMES: Array<string> = ['default', 'material', 'bootstrap'];
  // Init the counter
  uniqueCounter: number = 0;
  // ToastData event emitter
  // private toastsEmitter: EventEmitter<ToastData> = new EventEmitter<ToastData>();
  // Clear event emitter
  // private clearEmitter: EventEmitter<number> = new EventEmitter<number>();

  private eventSource: Subject<ToastaEvent> = new Subject<ToastaEvent>();
  public events: Observable<ToastaEvent> = this.eventSource.asObservable();

  constructor(private config: ToastaConfig) { }

  /**
   * Get list of toats
   */
  // getToasts(): Observable<ToastData> {
  //   return this.toastsEmitter.asObservable();
  // }

  // getClear(): Observable<number> {
  //   return this.clearEmitter.asObservable();
  // }

  /**
   * Create Toast of a default type
   */
  default(options: ToastOptions | string | number): void {
    this.add(options, 'default');
  }

  /**
   * Create Toast of info type
   * @param options Individual toasta config overrides
   */
  info(options: ToastOptions | string | number): void {
    this.add(options, 'info');
  }

  /**
   * Create Toast of success type
   * @param options Individual toasta config overrides
   */
  success(options: ToastOptions | string | number): void {
    this.add(options, 'success');
  }

  /**
   * Create Toast of wait type
   * @param options Individual toasta config overrides
   */
  wait(options: ToastOptions | string | number): void {
    this.add(options, 'wait');
  }

  /**
   * Create Toast of error type
   * @param options Individual toasta config overrides
   */
  error(options: ToastOptions | string | number): void {
    this.add(options, 'error');
  }

  /**
   * Create Toast of warning type
   * @param options Individual toasta config overrides
   */
  warning(options: ToastOptions | string | number): void {
    this.add(options, 'warning');
  }


  // Add a new toast item
  private add(options: ToastOptions | string | number, type: string) {
    let toastaOptions: ToastOptions;

    if (isString(options) && options !== '' || isNumber(options)) {
      toastaOptions = <ToastOptions>{
        title: options.toString()
      };
    } else {
      toastaOptions = <ToastOptions>options;
    }

    if (!toastaOptions || !toastaOptions.title && !toastaOptions.msg) {
      throw new Error('ngx-toasta: No toast title or message specified!');
    }

    type = type || 'default';

    // Set a unique counter for an id
    this.uniqueCounter++;

    // Set the local vs global config items
    let showClose = this._checkConfigItem(this.config, toastaOptions, 'showClose');

    // If we have a theme set, make sure it's a valid one
    let theme: string;
    if (toastaOptions.theme) {
      theme = ToastaService.THEMES.indexOf(toastaOptions.theme) > -1 ? toastaOptions.theme : this.config.theme;
    } else {
      theme = this.config.theme;
    }

    let toast: ToastData = <ToastData>{
      id: this.uniqueCounter,
      title: toastaOptions.title,
      msg: toastaOptions.msg,
      showClose: showClose,
      type: 'toasta-type-' + type,
      theme: 'toasta-theme-' + theme,
      onAdd: toastaOptions.onAdd && isFunction(toastaOptions.onAdd) ? toastaOptions.onAdd : null,
      onRemove: toastaOptions.onRemove && isFunction(toastaOptions.onRemove) ? toastaOptions.onRemove : null
    };

    // If there's a timeout individually or globally, set the toast to timeout
    // Allows a caller to pass null/0 and override the default. Can also set the default to null/0 to turn off.
    toast.timeout = toastaOptions.hasOwnProperty('timeout') ? toastaOptions.timeout : this.config.timeout;

    // Push up a new toast item
    // this.toastsSubscriber.next(toast);
    // this.toastsEmitter.next(toast);
    this.emitEvent(new ToastaEvent(ToastaEventType.ADD, toast));
    // If we have a onAdd function, call it here
    if (toastaOptions.onAdd && isFunction(toastaOptions.onAdd)) {
      toastaOptions.onAdd.call(this, toast);
    }
  }

  // Clear all toasts
  clearAll() {
    // this.clearEmitter.next(null);
    this.emitEvent(new ToastaEvent(ToastaEventType.CLEAR_ALL));
  }

  // Clear the specific one
  clear(id: number) {
    // this.clearEmitter.next(id);
    this.emitEvent(new ToastaEvent(ToastaEventType.CLEAR, id));
  }

  // Checks whether the local option is set, if not,
  // checks the global config
  private _checkConfigItem(config: any, options: any, property: string) {
    if (options[property] === false) {
      return false;
    } else if (!options[property]) {
      return config[property];
    } else {
      return true;
    }
  }

  private emitEvent(event: ToastaEvent) {
    if (this.eventSource) {
      // Push up a new event
      this.eventSource.next(event);
    }
  }
}
