import { Component, OnInit, Input, EventEmitter, Output, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FilterOption, FilterModes, FilterGroupKeys } from '../filter-option.model';
import { AuthService } from 'src/app/auth/auth.service';
import { Destination } from 'src/app/services/destination.model';
import { DeepCopy } from 'src/app/helpers/deep-copy';
import { ScreenService } from 'src/app/services/screen.service';

@Component({
  selector: 'oc-filter-option',
  templateUrl: './filter-option.component.html',
  styleUrls: ['./filter-option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterOptionComponent implements OnInit, OnDestroy {
  @Input() reset$: Observable<void>;
  @Output() filterChange = new EventEmitter<FilterOption>();

  public showAdvancedOptions = false;

  public destination: Destination;
  public filterOption: FilterOption;
  public groupType: GroupType;

  private savedStatus?: {
    filter: FilterOption;
    group: GroupType;
  }
  private stop$ = new EventEmitter<void>();

  constructor(
    public authService: AuthService,
    public screenService: ScreenService
  ) { }

  ngOnInit() {
    this.goDefault();

    this.authService.destination$
    .pipe(takeUntil(this.stop$))
    .subscribe(destination => {
      this.destination = destination;

      // If the destination changes while we're viewing the destination, refresh
      if(this.groupType === "destination")
        this.filterForDestination();
    });

    this.reset$
    .pipe(takeUntil(this.stop$))
    .subscribe(_ => this.goDefault());
  }
  ngOnDestroy() {
    this.stop$.next();
  }

  goDefault() {
    // This is a convience/readability function for resetting to default
    this.filterForDestination();
  }

  filterForDestination(): void {
    this.resetToDefaults();

    if(this.destination)
      this.filterOption.destination = this.destination.id;

    // If viewing on a phone, start in the basic mode with less information
    const showDataMode = this.screenService.appMenu ? 'basic' : 'training';
    this.showData(showDataMode, true);

    this.groupType = "destination";
    this.sendChanges();
  }
  filterForMooLa(): void {
    this.resetToDefaults();

    this.filterOption.mooLa = FilterModes.mustInclude;
    this.showData('mooLa', true);

    this.groupType = "mooLa";
    this.sendChanges();
  }
  filterForEveryone(): void {
    this.resetToDefaults({preserveShowData: true});

    // Do not call `this.showData('both', true)` because I want this to
    // extend the list without changing the display mode

    this.groupType = "everyone";
    this.filterOption.truncateResults = false; // This will cause it to slow down horrendously!
    this.sendChanges();
  }

  changeFilterGroup(group: FilterGroupKeys, mode: FilterModes): void {
    if(this.filterOption.groups[group] === mode)
      return; // No change happened

    this.filterOption.groups[group] = mode;
    this.sendChanges();
  }
  changeSearch(newValue: string): void {
    // Note: we are effectively only skipping the case when the input has one character in it
    let applyChanges = false;

    // When they delete everything, go back the way they had it configured
    if(!newValue.length && this.groupType === "search"){
      this.resetToDefaults({recover: true});
      applyChanges = true;
    }

    // Don't do any searching by name until the length is at least two
    if (newValue.length >= 2){
      // When we start searching, save all the defaults for recovery later
      if(!this.filterOption.search.text)
        this.resetToDefaults({save: true, preserveShowData: true});

      this.groupType = "search";
      applyChanges = true;
    }

    if(applyChanges){
      this.filterOption.search.text = newValue.trim();
      this.sendChanges();
    }
  }

  showData(type: ShowDataType, dontSendChanges?: boolean): void {
    if(type === 'training')
      this.filterOption.showData = {
        mooLa: false,
        training: true,
        defaultSort: { id: 'lastUpdated', desc: true }
      }
    else if(type === 'mooLa')
      this.filterOption.showData = {
        mooLa: true,
        training: false,
        defaultSort: { id: 'mooLa', desc: true }
      }
    else if(type === 'both')
      this.filterOption.showData = {
        mooLa: true,
        training: true,
        defaultSort: { id: 'lastUpdated', desc: true }
      }
    else if(type === 'basic')
      this.filterOption.showData = {
        mooLa: false,
        training: false,
        defaultSort: { id: 'name' }
      }
    else
      throw Error(`Unrecognized ShowDataType: ${type}`);

    // Allow this to be turned off for when I call this from the algorithms
    if(!dontSendChanges)
      this.sendChanges();
  }
  isShowing(type: ShowDataType): boolean {
    const training = this.filterOption.showData.training === true;
    const mooLa = this.filterOption.showData.mooLa === true;

    switch(type){
      case "training":    return  training && !mooLa;
      case "mooLa":       return !training &&  mooLa;
      case "both":        return  training &&  mooLa;
      case "basic":       return !training && !mooLa;
      default:
        throw Error(`Unrecognized ShowDataType: '${type}'`);
    }
  }

  private resetToDefaults(options?: {save?: boolean; recover?: boolean, preserveShowData?: boolean}): void {
    /**
     * Options:
     * save: save the current status for recovery later
     * recover: attempt to recover the saved status if it exists
     *
     * preserveShowData: reset everything except for the showData part of the field
     * */

    if(!options) options = {};

    if(options.save){
      this.savedStatus = {
        filter: DeepCopy.copy(this.filterOption),
        group: this.groupType, // primitive types are already passed by value
      };
    }

    let oldShowData;
    if(options.preserveShowData)
      oldShowData = DeepCopy.copy(this.filterOption.showData);

    if(!options.save && options.recover && this.savedStatus){
      this.filterOption = this.savedStatus.filter;
      this.groupType = this.savedStatus.group;
      this.savedStatus = undefined;
    }else{
      this.filterOption = {
        groups: {
          leader: FilterModes.noImportance,
          newbie: FilterModes.noImportance,
        },
        // roles: {}, // We aren't using this right now
        search: {
          text: "",
        },
        showData: {
          mooLa: true,
          training: true,
        },
        truncateResults: true,

        mooLa: FilterModes.noImportance,
      };
    }

    if(options.preserveShowData)
      this.filterOption.showData = oldShowData

    if(!options.save)
      this.savedStatus = undefined;
  }
  private sendChanges(): void {
    this.authService.guestActivity("training-dashboard:change filter");

    // Wait a tick so that our UI can update before all the filter/sort
    // functions block the thread and temporarily freeze the computer
    setTimeout(() => {
      this.filterChange.next(this.filterOption);

      // Unset the default sort after we send it so it isn't set with every change
      this.filterOption.showData.defaultSort = undefined;
    }, 10);
  }
}

type GroupType = "destination"|"mooLa"|"everyone"|"search";
type ShowDataType = "training"|"mooLa"|"both"|"basic";
