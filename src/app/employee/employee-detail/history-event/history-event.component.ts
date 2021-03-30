import { Component, Input, HostBinding, OnChanges, ChangeDetectionStrategy } from '@angular/core';

import { HistoryEvent } from 'src/app/services/employee-ratings.model';
import { PhotoService } from 'src/app/services/photo.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'oc-history-event',
  templateUrl: './history-event.component.html',
  styleUrls: ['./history-event.component.scss']
})
export class HistoryEventComponent implements OnChanges {
  @Input() event: HistoryEvent<any>;

  // Store the kind as a class on the host for styling purposes
  @HostBinding('class') kind: string;

  constructor(
    public photoService: PhotoService
  ) { }

  ngOnChanges(_simpleChanges) {
    // store the kind of event as a class on the parent
    this.kind = this.event.kind;
  }

  getHtml(markdown: string): string {
    if(!markdown)
      return "";

    // Reconvert the line breaks to carriage returns and then parse it
    return markdown.replace(/\\n/g, "\n");
  }
  trackByKey(_index: number, key: string): string {
    return key;
  }
}
