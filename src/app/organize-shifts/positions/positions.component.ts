import { OnInit, OnDestroy, ElementRef, Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { takeUntil } from 'rxjs/operators';

import { ConfigService } from 'src/app/config/config.service';
import { AuthService } from '../../auth/auth.service';
import { ScreenService, ScreenSizeInfo } from 'src/app/services/screen.service';
import { getEmPixels } from 'src/app/helpers/getEmPixels';
import { ModalComponent } from 'src/app/modal/modal.component';

import { ShiftsAtMoment } from '../day.model';
import { TimeService } from '../time.service';
import { ShiftDragData, isShiftDragData } from '../shift-card/shift-drag-data.model';
import { Layout, Position } from '../layout.model';
import { Shift } from '../shift.model';
import { BonusPosition, DestinationId } from 'src/app/services/destination.model';

@Component({
  selector: 'oc-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.scss']
})
export class PositionsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() layout: Layout;
  @Input() shiftsAtMoment: ShiftsAtMoment;
  @Input() note: string;
  @Output() noteChange = new EventEmitter<string>();

  // TODO: find a better way to populate this value
  private COLUMN_WIDTH = 8.8; //8.7; // these are based on css rules
  private SHIFTS_WIDTH = 23; // ^^ based on css rules
  private maxColumns: number;

  private swapPositionLocation?: {
    layoutId: string,
    sectionId: number,
    positionId: number
  }

  private stop$ = new EventEmitter<void>();

  constructor(
    private sanitizer: DomSanitizer,
    private timeService: TimeService,
    public authService: AuthService,
    private configService: ConfigService,
    private screenService: ScreenService,
    private el: ElementRef
  ) { }

  ngOnInit() {
    this.screenService.resize$
    .pipe(takeUntil(this.stop$))
    .subscribe(data => this.calculateMaxColumns(data));
  }
  ngOnChanges(_simpleChanges) {
    // Reset this position when the layout changes
    // This may cause issues when a manager takes a while creating a BonusPosition
    // and the app changes the information under their nose
    if(this.swapPositionLocation && this.swapPositionLocation.layoutId !== this.layout.id)
      this.swapPositionLocation = undefined;
  }
  ngAfterViewInit() {
    // this call isn't necessary, but triggers the check of the maximum columns here in the component...
    this.screenService.processScreenSize();
  }
  ngOnDestroy() {
    this.stop$.emit();
  }

  private calculateMaxColumns(data: ScreenSizeInfo): void {
    const pixelSize = getEmPixels(this.el.nativeElement);

    // TODO: recheck this when I legitmately hide the shifts (not a drag-hide)
    let width: number;
    if(data.onePanel)
      width = data.width;
    else
      width = data.width - this.SHIFTS_WIDTH * data.rem;

    this.maxColumns = Math.max(Math.floor(width / this.COLUMN_WIDTH / pixelSize), 1);

    // if we're doing the double screens, let them overlap a little for when the shifts hide
    // assume that both values are based on the same pixel size
    if(!data.onePanel)
      this.maxColumns += Math.floor(this.SHIFTS_WIDTH / this.COLUMN_WIDTH);
  }

  trackByIndex(index: number, _item: any): number {
    return index;
  }

  getPositionContainerClasses(position: Position): { [className: string]: boolean } {
    var classes: { [className: string]: boolean } = {
      position: true,
      invisible: !!position.invisible,
    },
        numShifts = position.shifts.length;

    // Only provide these indicators to those who can actually edit shifts
    // Provided as an advanced feature
    if(this.authService.can('editShifts')){
      if(numShifts < position.maxNumber){
        classes.acceptingShifts = true;

        if(numShifts < position.minNumber)
          classes.shiftsRequired = true;
      }else
        classes.fullOfShifts = true;
    }

    // TODO: figure out how to share this information
    /*
    let shift: Shift;
    if(validateShiftWithPersonKey){
      // console.log("Checking validitity of position %s with person %s", position.id, $scope.validateShiftWithPersonKey);
      if(this.layout.validateShift(position, shift).validShift)
        classes.shiftDropAllowed = true;
      else
        classes.shiftDropDisallowed = true;
    }
    */

    return classes;
  }
  getPositionStyle(position: Position, index: number): SafeStyle {
    let styles = [];
    const width = Math.round(Math.min(this.maxColumns, position.width || 1));
    const height = Math.round(position.height || 1);

    if(position.beginsRow || index === 0)
      styles.push("grid-column-start: 1");

    if(width > 1)
      styles.push('grid-column-end: span ' + width);

    if(height > 1){
      styles.push('grid-row-end: span ' + height);
      styles.push('height: unset');
    }

    styles.push('--width: ' + width);

    const unsafeStyles = styles.join("; ");
    const safeStyles = this.sanitizer.bypassSecurityTrustStyle(unsafeStyles);
    return safeStyles;
  }
  getContainerStyle(layout: Layout|undefined): SafeStyle {
    const unsafeStyle = '--max-columns: ' + Math.min(this.maxColumns, layout && layout.maxColumns || 1);
    const safeStyle = this.sanitizer.bypassSecurityTrustStyle(unsafeStyle);
    return safeStyle;
  }

  saveNote(newNote: string): void {
    this.noteChange.emit(newNote);
  }

  private lastDrag: { shift: Shift, position: Position } | false = false;
  private removeShift(): void {
    if(this.lastDrag !== false){
      this.layout.removeShift(this.lastDrag.position, this.lastDrag.shift);
      this.lastDrag = false;
    }
  }
  handleDrop(data: ShiftDragData, position: Position): void {
    if(!isShiftDragData(data) || !this.authService.can('editShifts'))
      return;

    this.timeService.interact();
    this.removeShift();

    // make sure that the employee is included in the group for this destination
    // This should be very clear since they were literally assigned to a position here.
    // Do it weakly so as to not remove manual overrides
    // --> it means they were scheduled for this destination AND assigned to a position
    const destinationId = this.configService.getConfig<DestinationId>('client.destinationId', false);
    if(data.shift.owner && destinationId)
      data.shift.owner.controlDestination(destinationId, true);
        // .then(changed => changed && console.log(`Added destination tag ${destinationId} to ${employee.name}`));
        // TODO: handle error

    this.layout.addShift(position, data.shift);

    // Track regular-user activity.
    // Used as a simple indicator, otherwise we'd only do this if e.g. the shift was actually valid
    if (!this.authService.isSuperUser()) {
      this.authService.getBusiness().newShiftActivity();
    }
  };

  onShiftCardDragStart(shift: Shift, position: Position): void {
    // save this to remove the shift afterwards
    this.lastDrag = {
      shift: shift,
      position: position
    };

    // We would want to remove the shift at the beginning,
    // however, this prevents the DragDropTouch library from working correctly,
    // this.removeShift();
  }
  onShiftCardDragEnd(): void {
    this.removeShift();
    this.layout.checkWorkers();
  }

  canSwapPosition(position: Position): boolean {
    return false ||
      // doneAddingShifts && // TODO: turn these off when close the shifts panel, maybe
        (!position.shifts ||!position.shifts.length) &&
      this.authService.can('editShifts');
  }
  trySwapPosition(layout: Layout, _position: Position, sectionId: number, positionId: number, modalTemplateRef: ModalComponent): void {
    // Boolean indicates if the operation is allowed and should continue
    if(!this.authService.can('editShifts'))
      return;

    this.timeService.interact();
    this.authService.guestActivity('[positionComponent]: open swap position modal');

    this.swapPositionLocation = {
      layoutId: layout.id,
      sectionId,
      positionId
    };

    modalTemplateRef.show();
  }
  finishSwappingPosition(newPosition: BonusPosition): void {
    if(!this.authService.can('editShifts'))
      return;

    if(!this.swapPositionLocation)
      throw Error("Cannot finish swapping a position without a cached index");

    if(!this.layout || this.layout.id !== this.swapPositionLocation.layoutId)
      throw Error("[finishSwappingPosition] layout undefined or has changed since the cache was created");

    this.timeService.interact();
    this.authService.guestActivity('[positionComponent]: finish swapping a position');

    const success = this.layout.swapPosition(this.swapPositionLocation, newPosition);
    if(!success)
      console.warn("Error swapping out a position");
  }

  // TODO: watch when any shift drag occurs to highlight positions
}
