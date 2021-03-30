import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';

@Component({
  selector: 'oc-stars-widget',
  templateUrl: './stars-widget.component.html',
  styleUrls: ['./stars-widget.component.scss']
})
export class StarsWidgetComponent {
  @Input() value: number;
  @Input() type: WidgetType;
  @Output() valueChange = new EventEmitter<number>();

  @HostBinding('class.interactive') interactive = false;

  constructor( ) { }

  ngOnChanges() {
    this.interactive = this.type === 'readwrite';
  }

  starClick(value: number): void {
    if(this.type === 'readwrite')
      this.valueChange.emit(value);
  }
  isSelected(number: number): boolean {
    return Math.floor(this.value) === number;
  }
}

export type WidgetType = "readonly" | "readwrite";
