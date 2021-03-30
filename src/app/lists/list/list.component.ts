import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, HostBinding } from '@angular/core';

import { AuthService } from 'src/app/auth/auth.service';
import { ListStatus } from '../lists.component';
import { List, ListEvaluationResult, ListItem, ListItemEvaluated } from '../list.model';
import { round } from 'src/app/helpers/snippet';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'oc-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  @HostBinding('class.titleOnly')
  @Input() titleOnly?: boolean;

  @Input() status: ListStatus;

  @Input() list?: List;

  @HostBinding('class.evaluatedList')
  @Input() evaluatedList?: ListEvaluationResult;

  @Output() submit = new EventEmitter<ListEvaluationResult>();
  @Output() delete = new EventEmitter<List>();

  newItemTitle: string;
  newItemDescription: string;

  constructor(
    public authService: AuthService,
    private cd: ChangeDetectorRef
  ) { }

  getListTitle(): string {
    return "" ||
      (this.list && this.list.title) ||
      (this.evaluatedList && this.evaluatedList.title) ||
      "";
  }
  getItems(list: List): ListItem[] {
    let items: ListItem[];
    if(list && list.items)
      items = Object.values(list.items);
    else
      items = this.evaluatedList && this.evaluatedList.items || [];

    return this.sortItems(items);
  }
  sortItems(items: ListItem[]): ListItem[] {
    return items.sort((a, b) => {
      return 0 ||
        +a.done - +b.done ||
        a.sort - b.sort ||
        1;
    })
  }

  async addItem(event, to: List): Promise<void> {
    if(!this.authService.can('editLists'))
      return;

    await to.addItem(this.newItemTitle, this.newItemDescription)
    this.newItemTitle = "";
    this.newItemDescription = "";

    this.cd.markForCheck();
  }
  async toggleItemDone(event: any, list: List, item: ListItem): Promise<void> {
    event.stopPropagation();

    if(this.status !== ListStatus.viewing ||
      !this.authService.can('markListsDone'))
      return;

    await list.toggleItemDone(item);

    console.log(`Toggled item ${item.id}. Done?`, item.done);
    this.cd.markForCheck();
  }
  async removeItem(event, list: List, item: ListItem): Promise<void> {
    event.stopPropagation();
    if(!this.authService.can('editLists'))
      return;

    await list.removeItem(item);
    this.cd.markForCheck();
  }

  submitClick(): void {
    const list = this.list;
    if(!list || !list.items )
      return;

    const items = this.getItems(list);
    if(!items.length)
      return;

    let totalScore = 0, numScores = 0;
    const cleanedItems = [];
    for(let item of items){
      if(!item.rating)
        return;

      totalScore += item.rating;
      numScores++;

      let value = {};
      for(let prop in item)
        if(prop !== 'sort' && prop !== 'done')
          value[prop] = item[prop];
      cleanedItems.push(value as ListItemEvaluated);
    }

    if(!numScores)
      throw Error('Cannot calculate the average score by dividing by zero!');

    const evaluatedList: ListEvaluationResult = {
      title: list.title,
      items: cleanedItems,
      score: round(totalScore / numScores, 1)
    }

    this.submit.emit(evaluatedList);
  }

  trackByListItem(_index, item: ListItem): string {
    return item.id;
  }
}
