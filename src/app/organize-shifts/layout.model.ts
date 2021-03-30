import { DocumentReference, DocumentSnapshot, Timestamp } from '@firebase/firestore-types';
import firebase from '@firebase/app';

import { ConfigService } from '../config/config.service';
import { cleanFirestoreFieldName, camelize, toArray, finishConstruction, isDocumentSnapshot, DataObject } from '../helpers/snippet';
import { ShiftService } from './shift.service';
import { TimeService } from './time.service';

import { LayoutMeta, LayoutGenerationConfig, PositionId } from '../config/layout-generation-config.model';
import { PositionInformation } from '../services/employee.model';
import { PositionDefinition } from '../config/client-config.model';
import { RoleList } from '../config/client-permission-config.model';

import { ShiftsAtMoment } from './day.model';
import { Shift, EmployeeId } from './shift.model';
import { BonusPosition } from '../services/destination.model';
import { DeepCopy } from '../helpers/deep-copy';

export interface Section {
  sectionTitle: string;
  positions: Position[];
}
export interface Position {
  // If `invisible` is not true, then `title` and `id` are required
  invisible?: boolean; // set to true to insert blank space in layout, respects `height` and `width` attributes
  title?: string; // name to display in position block
  id?: string; // these start with + --> must be unique to the layout

  // Used by the auto-scheduling process will fill in the position with shifts with these job titles
  jobTitle?: string | string[]; // HotSchedules JobName to be used for auto scheduling
  // Developer's note: switching to HS job ID's would include modifying the server code and other code
  // The ID's also change by business so it would be difficult to maintain

  // Used to restrict how many shifts can be in the container at a time
  maxNumber?: number; // Max number of allowed shifts

  // Used to display warnings when the positions needs people
  minNumber?: number; // Min number of required shifts. This helps tailor the suggesting algorithms

  // Used to (optionally) restrict who can be put in by training data
  // Also used by algorithms for statistical and functional purposes -- should be populated!
  // If multiple values are used, the most important must be first.
  requireTraining?: PositionId | PositionId[];

  // Used to restrict who can be in the position based on permission roles
  requireRoles?: RoleList;

  // If unset, the id will be used for comuputations instead
  positionGroup?: string; // starts with + as well and end with 'Group'.. ex:/ +baggerGroup

  width?: number; // default: 1
  height?: number; // default: 1
  beginsRow?: boolean; // default: false, unless it's the first position in a section

  // Never used when authoring layouts
  shifts?: EmployeeId[];
  isSwapped?: boolean; // true when the position has been manually swapped
}
export interface PositionBreadcrumb {
  // TODO: maybe they should really only be number
  // These represent indexes in the arrays of objects
  sectionId: string|number;
  positionId: string|number;

  // These are optional and can be used to reference a position from a broader context
  // Other functions will be necessary to get down to the layout level
  layoutId?: string;
  dayId?: string;
  destinationId?: string;
  businessId?: string;
}

export class Layout {
  private ref: DocumentReference;
  readonly id: string;

  time: Date; // full representation since epoch
  templateId: string;
  structureId: string;

  // It will be a field value while we await the server timestamp
  // touched?: Date|firebase.firestore.FieldValue; // The time the first shift is added to the layout
  // completed?: Date|firebase.firestore.FieldValue; // The first time when every shift is added or marked goneHome
    // TODO: populate the `completed` field

  // TypeScript can't find the firebase namespace
  touched?: Date|any;
  completed?: Date|any;

  maxColumns: number;
  workers: WorkerMap;

  sections: Section[] = [];
  private getTemplateId(targetTime: number): string {
    // figure out which template we should use given the current time
    // mirror the process used to find the layout in Layouts.current()
    if(!targetTime) throw Error("time is missing");
    var times: {time: number, templateId: string}[] = [];
    for(let indicator of this.configService.getConfig<LayoutMeta[]>("client.layoutGeneration.meta"))
      for(let time of indicator.activeTimes){
        if(time === targetTime)
          return indicator.templateId;

        let i;
        for(i=0; i<times.length; i++)
          if(time < times[i].time)
            break;
        times.splice(i, 0, {
          time: time,
          templateId: indicator.templateId,
        });
      }

    for(let i = times.length-1; i >= 0; i--)
      if(times[i].time < targetTime)
        return times[i].templateId;

    return times[0].templateId;
  }

  private constructSections(unbuiltSections): Section[] {
    var sections: Section[] = [];

    for(let section of unbuiltSections){
      let builtSection: Section = {
        sectionTitle: section.sectionTitle,
        positions: [] as Position[],
      }

      for(let position of section.positions){
        if(!position.shifts)
          position.shifts = [];

        builtSection.positions.push(position);
      }

      sections.push(builtSection);
    }

    return sections;
  }

  constructor(layoutDoc: DocumentSnapshot, configService: ConfigService, shiftService: ShiftService)
  constructor(construction: LayoutConstructionObject, configService: ConfigService, shiftService: ShiftService)
  constructor(layoutDocOrConstruction: DocumentSnapshot | LayoutConstructionObject, private configService: ConfigService, private shiftService: ShiftService) {
    if(isDocumentSnapshot(layoutDocOrConstruction)){
      let layoutDoc = layoutDocOrConstruction;

      if(!layoutDoc.exists)
        throw Error(`We have a layout that doesn't exist: ${layoutDoc.ref.id}`);

      this.sections = this.constructSections(layoutDoc.get('sections'));

      finishConstruction(this, layoutDoc);
    }else{
      let constructionObject = layoutDocOrConstruction;
      var generation = this.configService.getConfig<LayoutGenerationConfig>("client.layoutGeneration");

      this.time = constructionObject.time;
      this.ref = constructionObject.ref;
      this.id = this.ref.id;

      var timeHours = TimeService.toHoursFormat(this.time);

      this.templateId = this.getTemplateId(timeHours);
      var template = generation.templates[this.templateId];

      if(!template.structureId)
        throw Error("Cannot construct layout without a structureId");
      this.structureId = template.structureId;

      const structure = generation.structures[this.structureId];
      if(!structure)
        throw Error(`Cannot build a layout without a defined structure. Searched for structure ID ${this.structureId}`);
      const construction = Object.assign({}, structure);

      this.maxColumns = construction.maxColumns;
      this.sections = this.constructSections(construction.sections);

      if(template.updates)
        this.forEachPosition((position: Position) => {
          if(template.updates[position.id])
            for(let updateId in template.updates[position.id])
              position[updateId] = template.updates[position.id][updateId];
        });
    }

    this.checkWorkers();
  }

  checkWorkers(): WorkerMap {
    var employeesSeen = {};
    this.forEachPosition(position => {
      if(position.shifts.length)
        for(let employeeId of position.shifts)
          employeesSeen[employeeId] = employeesSeen[employeeId]+1 || 1;
    });

    this.workers = employeesSeen;
    return this.workers;
  }

  clear(): void {
    this.forEachPosition(position => {
      position.shifts = [];
    });
  }
  serialize(): object {
    return {
      time: this.time,
      templateId: this.templateId,
      structureId: this.structureId,
      maxColumns: this.maxColumns,
      ...(this.touched && {touched: this.touched}),
      ...(this.completed && {completed: this.completed}),

      sections: this.sections.map(s => {
        return {
          sectionTitle: s.sectionTitle,
          positions: s.positions.map(p => {
            return {
              // https://stackoverflow.com/a/40560953/2844859
              ...(p.invisible && {invisible: p.invisible}),
              ...(p.isSwapped && {isSwapped: p.isSwapped}),

              ...(p.jobTitle && {jobTitle: p.jobTitle}),
              ...(p.maxNumber && {maxNumber: p.maxNumber}),
              ...(p.minNumber && {minNumber: p.minNumber}),
              ...(p.requireTraining && {requireTraining: p.requireTraining}),
              ...(p.requireRoles && {requireRoles: p.requireRoles}),
              ...(p.title && {title: p.title}),
              ...(p.id && {id: p.id}),
              ...(p.width && {width: p.width}),
              ...(p.height && {height: p.height}),
              ...(p.beginsRow && {beginsRow: p.beginsRow}),
              ...(p.positionGroup && {positionGroup: p.positionGroup}),

              ...(p.shifts.length && {shifts: p.shifts}),
            };
          }),
        }
      })
    }
  }
  save(): Promise<Layout> {
    return this.ref.set(this.serialize())
    .then(() => this)
    .catch(error => { throw Error(`[Layout.save]: ` + error) });
  }
  delete(): Promise<void> {
    return this.ref.delete()
      .then(() => {})
      .catch(console.error);
  }

  validateShift(position: Position, shift: Shift): ShiftValidationResult {
    function end(obj): ShiftValidationResult {
      var message,
          code = obj.code || obj,
          positionTitle = obj.positionTitle || "##Unknown position##";
      switch(code){
        case 0:    message = "Success!"; break;
        case 100:  message = "Too many workers"; break;
        case 101:  message = "Already scheduled here"; break;
        case 102:  message = "Doesn't meet training requirements for " + positionTitle; break;
        case 103:  message = "Shift isn't scheduled at " + obj.time.toUTCString(); break;
        case 104:  message = `Has some training, but is not yet ready for ${positionTitle}`; break;
        case 105:  message = `Owner does not pass roleList: ${obj.roles}`; break;
        case 400:  message = "`positionId` does not exist"; break;
        case 401:  message = "`name` does not exist"; break;
        case 404:  message = "Position not found"; break;
        default:
          throw Error("ValidateShift status code not recognized: " + code);
      }
      return {
        validShift: code === 0,
        invalidShift: 1 <= code && code < 400,
        error: 400 <= code,
        underQualified: code === 104,

        code: code,
        message: message,
      };
    }

    if(position.maxNumber && position.shifts.length >= position.maxNumber)
      return end(100);

    if(position.shifts.find(ishift => ishift === shift.ownerId))
      return end(101);

    if(!shift.training && shift.owner){
      if(position.requireTraining){
        // training shifts aren't subject to training requirements^^^
        var requirements = toArray(position.requireTraining),
            progression = this.configService.getConfig<PositionDefinition[]>("client.progression");

        eachRequirement: for(let requirement of requirements){
          // if they failed on that position, they fail; -1 is used to indicate no rating...
          let beyondInitialPosition = false;
          for(let position of progression){
            if(!beyondInitialPosition && position.id !== requirement)
              continue; // don't evaluate positions lower than the requirement

            beyondInitialPosition = true;

            let info: PositionInformation = shift.owner.getPositionInfo(position);
            if(info.qualified)
              continue eachRequirement; // they pass this requirement
            else if(info.underQualified)
              return end({
                code: 104,
                positionTitle: requirement,
                position: position,
              });
            else if(info.noRating)
              return end({
                code: 102,
                positionTitle: requirement,
                position: position,
              });
            else
              throw Error(`[Layout.validateShift] found strange readings from the info response` + info);
          }

          if(beyondInitialPosition)
            return end({
              code: 102,
              positionTitle: requirement,
            });
          else
            throw Error(`Position could not be found that matches requirement ${requirement}`);
        }
      }

      if(position.requireRoles){
        if(!shift.owner.passesRoleList(position.requireRoles))
          return end({
            code: 105,
            roles: position.requireRoles.join(", ")
          });
      }
    }

    // success!
    return end(0);
  }
  addShift(position: Position, shift: Shift, options: { suppressSave?: boolean, suppressMessage?: boolean } = {}): void {
    var validation = this.validateShift(position, shift),
        preventUntrained = this.configService.getConfig<boolean>('client.preventUntrainedScheduling', false),
        preventUndertrained = this.configService.getConfig<boolean>('client.preventUndertrainedScheduling', false);

    if( validation.validShift ||
      (!preventUndertrained && validation.code === 104) ||
      (!preventUntrained && validation.code === 102)){

      position.shifts.push(shift.ownerId);

      // this may not be necessary now that workers are automatically recalculating
      this.workers[shift.ownerId] = this.workers[shift.ownerId]+1 || 1;

      if(!this.touched)
        this.touched = firebase.firestore.FieldValue.serverTimestamp();

      if(!options.suppressSave)
        this.save();
    }else if(validation.invalidShift){
      if(!options.suppressMessage)
        console.log("Couldn't add shift because the shift is invalid", validation);
      // TODO: display a message to the Shift Leader
    }else if(validation.error)
      throw Error("ValidateShift error (" + validation.code + "): " + validation.message);
  }
  removeShift(position: Position, shift: Shift): void {
    // remove the shift
    position.shifts.splice(position.shifts.findIndex(ishift => ishift === shift.ownerId), 1);

    // mark it as unscheduled
    this.workers[shift.ownerId]--;

    // save
    this.save();
  }

  static getBaseId(title: string): PositionId {
    // Returns a positionId based on a custom position title in the form of:
    // +camelizedPositionTitleWithNumbers1
    const cleanTitle = cleanFirestoreFieldName(title).replace(/\+/g, "");
    return "+" + camelize(cleanTitle);
  }
  swapPosition(location: PositionBreadcrumb, newPosition: BonusPosition, options: { suppressSave?: boolean } = {}): boolean {
    // boolean indicates if the operation was completed
    if (!this.sections ||
        !this.sections[location.sectionId] ||
        !this.sections[location.sectionId].positions){
          console.warn(`Could not swap position into location`, location, `because it does not exist!`);
          return false;
        }

    let createdPosition: Position = DeepCopy.copy(newPosition);

    // Append a +n to the end of the id beginning with 1 to ensure uniqueness,
    // even if the same BonusPosition is used several times
    // The created positionId will be in the form of: +camelCasePositionName2+1
    let finalIncrementer = 1, uniqueId: string;
    while(!uniqueId){
      const tempId = newPosition.id + "+" + finalIncrementer++;
      const duplicateId: string|undefined = this.forEachPosition<string>(position => {
        if(position.id === tempId)
          return position.id;
      })

      if(!duplicateId)
        uniqueId = tempId; // save the id which breaks out as well :)
    }
    createdPosition.id = uniqueId;


    // Copy and reset values from the old position
    const oldPosition = this.getPositionWithBreadcrumbs(location);
    createdPosition.shifts = [];
    createdPosition.isSwapped = true;
    createdPosition.beginsRow = oldPosition.beginsRow;
    createdPosition.height    = oldPosition.height;
    createdPosition.width     = oldPosition.width;


    this.sections[location.sectionId].positions[location.positionId] = createdPosition;

    if(!options.suppressSave)
      this.save(); // Don't return the save object so it fulfills in the background

    return true;
  }

  copyLayoutFrom(sourceLayout: Layout, sourceShifts: ShiftsAtMoment): void {
    if(this.structureId !== sourceLayout.structureId){
      // only transfer data if the previouslayout was created with the same structure...
      // this guarantees that all of the positions at least exist
      return;
    }

    this.forEachPosition((position, breadcrumb): void => {
      if(!position.shifts)
        position.shifts = [];

      let sourcePosition = sourceLayout.getPositionWithBreadcrumbs(breadcrumb);

      // Copy over everything except the shifts so those can be processed separately
      if(sourcePosition.isSwapped){
        this.sections[breadcrumb.sectionId].positions[breadcrumb.positionId] = position = sourcePosition;
        position.shifts = [];
      }

      // Copy the shift owners over
      if(sourcePosition && sourcePosition.shifts && sourcePosition.shifts.length)
        for(let sourceEmployeeId of sourcePosition.shifts){
          let sourceShift = sourceShifts.withEmployee(sourceEmployeeId);

          // Although I could check other requirements (training, maximums, etc),
          // I don't want to because that would lead to strange behaviour
          // NOTE: this does lead to a potential bug where a shift could bypass these rules by doing some
          // funky time shifts and workarounds, but that shouldn't be a real issue with the target audience
          if(sourceShift.timeIn <= this.time &&
             this.time < sourceShift.timeOut &&
             position.shifts.indexOf(sourceShift.ownerId) === -1)
                position.shifts.push(sourceShift.ownerId);
          // this.addShift(position, sourceShift, {suppressSave: true, suppressMessage: true});
        }
    });
  }
  autoSchedule(data: ShiftsAtMoment): void {
    // generate a map of all the positions by title as scheduled by HotSchedules
    var positionsMap: { [job: string]: EmployeeId[] } = {};
    for(let shift of data.shifts){
      if(!positionsMap[shift.job])
        positionsMap[shift.job] = [];

      // When we're looking behind, we don't mean to auto schedule those
      // We do want to auto-shedule shifts ahead of time
      if(shift.timeOut > data.time)
        positionsMap[shift.job].push(shift.ownerId);
    }

    // Only allow each employee to be auto scheduled into one position
    // CONSIDER: removing the employee from the positionsMap instead of this
    var autoScheduledWorkers: EmployeeId[] = []

    this.forEachPosition(position => {
      if(!position.jobTitle)
        return;

      let potentialAutoShifts: string[] = [];
      let jobTitles = toArray(position.jobTitle);
      for(let jobTitle of jobTitles)
        if(positionsMap[jobTitle]){
          // Auto-scheduling shifts kicks out any shifts previously put there or copied in
          position.shifts = [];

          for(let employeeId of positionsMap[jobTitle])
            if (!autoScheduledWorkers.includes(employeeId) &&
                !position.shifts.includes(employeeId) &&
                !potentialAutoShifts.includes(employeeId))
              potentialAutoShifts.push(employeeId);
        }

      // The max shifts is based on the spacial area of the position.
      // Essentially, auto scheduling will fill up the area, but not expand it
      // while still respecting the maxNumber passed in. This could lead to unexpected
      // behaviour if the configuration is not set intuitively, but it should be respected.
      // When growing vertically, you actually get 50% more room because of the headers etc...

      // CONSIDER: providing another settable limit (which would be less than the maxNumber)
      // to help spread the pre-assigned shifts out.
      // This spreads the assigned shifts among positions that share job codes

      // TODO: provide better logic to control which shifts go to which positions
      // Example: when two baggers are assigned, which is FC and which is DT?
      // This might be based on seperate ratings for FC/DT...
      // Right now I don't know a good way to guess
      // What information would the shift leader use to make the decision?
      // \-> Give them the same one they had last time?
      // For now, it will be the luck of the draw:
      // \-> Whichever shift comes first will be assigned first and the second to the second.
      // I suspect that the sorting of the shifts will control this order,
      // and thus lead to the same people usually being assigned to the same position
      // I don't know what controls the order through right now.

      // Alternatively, HotSchedules just might not be good at scheduling, so this
      // kind of heavy lifting should be left up to the shift leaders in OneClick.

      // More investigation required.


      const maxShifts = Math.min(
              Math.floor((position.width || 1) * (position.height || 1) * 1.5),
              position.maxNumber || Infinity);
      while(potentialAutoShifts.length > 0 && position.shifts.length < maxShifts){
        const [employeeId] = potentialAutoShifts.splice(0, 1);
        position.shifts.push(employeeId);
        autoScheduledWorkers.push(employeeId);
      }
    });
  }

  forEachPosition<T>(func: (position: Position, breadcrumb: PositionBreadcrumb) => T): T | undefined {
    // If the callback function returns a value that isn't undefined,
    // the search will stop that returned valued will be returned again
    var value;
    for(let sectionId in this.sections)
      for(let positionId in this.sections[sectionId].positions){
        let position = this.sections[sectionId].positions[positionId];
        let breadcrumb = {
          sectionId,
          positionId,
        };

        value = func(position, breadcrumb);
        if(value !== undefined)
          return value;
      }
  }
  getPositionWithBreadcrumbs(breadcrumb: PositionBreadcrumb): Position {
    return this.sections[breadcrumb.sectionId].positions[breadcrumb.positionId];
  }
}
export type LayoutCollection = { [layoutId: string]: Layout };

export interface ShiftValidationResult {
  validShift: boolean;
  invalidShift: boolean;
  error: boolean;
  underQualified: boolean;

  code: number;
  message: string;
}
export interface LayoutConstructionObject extends DataObject {
  time: Date;
  ref: DocumentReference;
}
export interface WorkerMap { [employeeId: string]: number };
