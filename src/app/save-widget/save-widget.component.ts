import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'oc-save-widget',
  templateUrl: './save-widget.component.html',
  styleUrls: ['./save-widget.component.scss']
})
export class SaveWidgetComponent implements OnInit {

  operating: boolean = true;
  connected: boolean = true;
  status = {
    saved: true,
    saving: false,
    offline: false,
  };

  constructor() { }

  ngOnInit() { }

  toggle() {
    if(this.operating)
      this.off();
    else
      this.on();
  }
  off() {
    this.operating = false;
    this.status.offline = true;
  }
  on() {
    this.operating = true;
    this.status.offline = !this.connected;
  }
}
