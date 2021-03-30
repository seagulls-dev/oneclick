import { Directive, Output, EventEmitter, ElementRef, NgZone, Attribute } from '@angular/core';

import { DragService } from './drag.service';

@Directive({
  selector: '[ocDroppable]'
})
export class DroppableDirective {
  // prefix the events so they don't collide with the regular browser events
  @Output() ocDrop = new EventEmitter<any>();

  private allowPropogation: boolean; // Default: false
  // This is set by checking the ocDropAllowPropogation attribute on the element
  // If true, drop events will propogate through this element
  // to any parent event listeners.
  // The default behaviour is to stop propogation at the deepest nested element with a listener

  constructor(
    private dragService: DragService,
    private zone: NgZone,
    private _elementRef: ElementRef,
    @Attribute('ocDropAllowPropogation') private allowPropogationAttr: string,
  ) {
    let el = this._elementRef.nativeElement,
        that = this;

    // If simply included, it will be an empty string
    // It will be false if the attribute is not included, or if it is set to 'false'
    // Note: Attributes are constant. They are only evalutated on element creation
    this.allowPropogation = this.allowPropogationAttr !== null && this.allowPropogationAttr !== "false";

    this.zone.runOutsideAngular(() => {
      el.addEventListener("dragenter", function(event){
        event.dataTransfer.dropEffect = 'move';
        this.classList.add("draggingOver");
      }, false);
      el.addEventListener("dragleave", function(event){
        this.classList.remove("draggingOver");
      }, false);

      // by default, accept drops
      el.addEventListener("dragover", function(event){
        event.preventDefault();
        this.classList.add("draggingOver");
      }, false);
      el.addEventListener("drop", function(event){
        if(!that.allowPropogation)
          event.stopPropagation();

        this.classList.remove("draggingOver");

        let data = that.dragService.getData();

        that.ocDrop.emit(data);
      }, false);
    });
  }
}
