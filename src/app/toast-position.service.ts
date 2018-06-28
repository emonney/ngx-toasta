import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


/**
 * Service helps communicate between the ToastComponent and AppComponent.
 */
@Injectable({
  providedIn: 'root'
})
export class ToastPositionService {
  private positionSource = new Subject<string>();
  position$ = this.positionSource.asObservable();

  setPosition(position) {
    this.positionSource.next(position);
  }
}

