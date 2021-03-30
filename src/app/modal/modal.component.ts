import { Component, OnInit, Input, Output, HostBinding, EventEmitter  } from '@angular/core';

@Component({
  selector: 'oc-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @HostBinding('class.active') active = false;

  @Input() title?: string;
  @Output('show') onShow = new EventEmitter<void>();
  @Output('hide') onHide = new EventEmitter<void>();

  closeOnOverlayClick = true;

  constructor() { }

  ngOnInit() { }

  show(): void {
    this.active = true;
    this.onShow.emit();
  }
  hide(): void {
    this.active = false;
    this.onHide.emit();
  }

  overlayClick(): void {
    if(this.closeOnOverlayClick)
      this.hide();
  }
}
