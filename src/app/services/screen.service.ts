import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, shareReplay } from 'rxjs/operators';

import { getEmPixels } from '../helpers/getEmPixels';

@Injectable({
  providedIn: 'root'
})
export class ScreenService {
  // TODO: decide on better initial values. Probably none of them matter anyways
  private _resize$ = new Subject<ScreenSizeInfo>();
  public  resize$ = this._resize$.pipe(debounceTime(300), shareReplay());

  public appMenu: boolean;
  public onePanel: boolean;
  public smallScreen: boolean;

  constructor() {
    // TODO: this is a little hacky, but it'll work for now
    window.addEventListener('resize', event => this.processScreenSize(event));

    // this call goes early so we have some information while building the ui
    this.processScreenSize();
  }

  // TODO: it's going to be something else...
  // @HostListener('window:resize', ['$event'])
  processScreenSize(_event?) {
    const height = window.innerHeight;
    const width = window.innerWidth;

    const appRoot = document.getElementsByTagName('app-root')[0];
    const rem = getEmPixels(appRoot);

    let info: ScreenSizeInfo = {
      height,
      width,
      rem,

      // Note these numbers are important, they should be configurable
      // TODO: create an app settings json file service
      appMenu: width <= 1220,
      onePanel: width <= 655,
      smallScreen: width <= 550,
    };

    // Also provide these as public properties
    this.appMenu        = info.appMenu;
    this.onePanel       = info.onePanel;
    this.smallScreen    = info.smallScreen;

    this._resize$.next(info);
  }
}

export interface ScreenSizeInfo {
  height: number;
  width: number;
  rem: number;

  appMenu: boolean;
  onePanel: boolean;
  smallScreen: boolean;
}
