import { Component, Input, OnChanges } from '@angular/core';

/** NOTE
 * This is a very simple component that takes an input number.
 * If the number is Infinity, it shows a FontAwesome symbol, otherwise
 * It formats formats the number with a prefix and displays it.
 *
 * You can style the Infinite case by using the /deep/ css keyword
 * and targeting the <i>
 * */


@Component({
  selector: 'oc-infinite-value',
  template: `
<i *ngIf="isInfinity; else showFiniteValue" class="fas fa-infinity"></i>
<ng-template #showFiniteValue>
  {{ (prefix || "") + value }}
</ng-template>`,
})
export class InfiniteValueComponent implements OnChanges {
  @Input() value: number; // could be Infinity
  @Input() prefix?: string; // could be "$"

  public isInfinity: boolean;

  ngOnChanges() {
    this.isInfinity = this.value === Infinity;
  }
}
