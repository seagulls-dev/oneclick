import { Directive, OnChanges, Input, Output, EventEmitter, ElementRef, NgZone, SimpleChanges } from '@angular/core';

import { DragService } from './drag.service';

@Directive({
  selector: '[ocDraggable]'
})
export class DraggableDirective implements OnChanges {
  @Input() dragData: any;
  @Input() ocDraggable?: boolean | undefined; // a value of 'false' here will disable dragging
  @Output() ocDragStart = new EventEmitter<void>();
  @Output() ocDragEnd = new EventEmitter<void>();

  constructor(
    private dragService: DragService,
    private zone: NgZone,
    private _elementRef: ElementRef
  ) {
    const el = this._elementRef.nativeElement;
    const that = this;

    this.zone.runOutsideAngular(() => {
      el.addEventListener("dragstart", function(event){
        if(that.ocDraggable === false){
          event.preventDefault();
          return false;
        }

        that.ocDragStart.emit();

        event.dataTransfer.effectAllowed = "move";
        let data = that.dragData;

        that.dragService.setData(that.dragData);

        // add a css class
        this.classList.add("dragging");
      });
      el.addEventListener("dragend", function(event){
        that.dragService.deleteData();
        that.ocDragEnd.emit();

        // in context, this refers to the element
        this.classList.remove("dragging");
      });
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    const el = this._elementRef.nativeElement;

    if(this.ocDraggable === false)
      // disable drag-n-drop
      el.draggable = false;
    else
      // enable HTML5 drag-n-drop
      el.draggable = true;
  }
}
