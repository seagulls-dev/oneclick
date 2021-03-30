import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DragService {
  private _dragData: any;

  setData(data: any): void {
    this._dragData = data;
  }
  getData(): any {
    return this._dragData;
  }
  deleteData(): void {
    this._dragData = undefined;
  }
}
