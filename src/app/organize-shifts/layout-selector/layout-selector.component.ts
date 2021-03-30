import { Component, Input, OnChanges } from '@angular/core';

import { ScreenService } from 'src/app/services/screen.service';
import { LayoutSelector } from './layout-selector.model';
import { LayoutCollection } from '../layout.model';
import { TimeService, Time } from '../time.service';

@Component({
  selector: 'oc-layout-selector',
  templateUrl: './layout-selector.component.html',
  styleUrls: ['./layout-selector.component.scss']
})
export class LayoutSelectorComponent implements OnChanges {
  @Input() layouts: LayoutCollection;
  @Input() activeTime: Time;

  sortedSelectors: LayoutSelector[]; // all selectors for use by the ng-option element
  selectedLayoutSelector: LayoutSelector;
  displaySelectors: LayoutSelector[]; // sorted, and maxed out at five for the wider web screen

  constructor(
    private timeService: TimeService,
    public screenService: ScreenService
  ) { }

  ngOnChanges() {
    this.filterLayouts();
  }

  filterLayouts(): void {
    // filters the selectors so that no more than 5 exist at a time
    // additionally, only the five selectors close to the active one are returned

    var activeIndex, startIndex, endIndex,
        time = TimeService.extractTime(this.activeTime),
        selectors: LayoutSelector[] = [], maxSelectors = 5;

    // convert to array
    for(let i in this.layouts){
      let layout = this.layouts[i]
      selectors.push({
        id: layout.id,
        time: layout.time
      });
    }

    if(!selectors.length){
      this.sortedSelectors = [];
      this.displaySelectors = [];
      return; // no layouts to filter...
    }

    selectors.sort((a: LayoutSelector, b: LayoutSelector): number => +a.time - +b.time);
    for(let i = selectors.length-1; i >= 0; i--){
      let extractedTime = TimeService.extractTime(selectors[i].time);
      if(+extractedTime <= +time || i === 0){
        activeIndex = i;
        this.selectedLayoutSelector = selectors[i];
        break;
      }
    }

    this.sortedSelectors = selectors;

    if(activeIndex === 0){
      startIndex = 0;
      endIndex = Math.min(selectors.length, maxSelectors);
    }else if(activeIndex > selectors.length - maxSelectors){
      endIndex = selectors.length;
      startIndex = endIndex - maxSelectors;
    }else{
      startIndex = activeIndex - 1;
      endIndex = startIndex + maxSelectors;
    }

    this.displaySelectors = selectors.filter((_item, index) => startIndex <= index && index < endIndex);
  }

  selectLayout(selector: LayoutSelector): void {
    this.timeService.interact();
    this.timeService.setTime(selector.time);
  }

  trackBySelector(_index: number, selector: LayoutSelector): string {
    return selector.id;
  }
}
