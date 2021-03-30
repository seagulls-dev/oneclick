import { DocumentSnapshot, DocumentReference, Timestamp as Timestamp_T, CollectionReference, QuerySnapshot } from "@firebase/firestore-types";

import { env, FieldValue, Timestamp } from '../firebaseAdmin';

import { utc } from 'moment';

import { Employee, PositionHistory, PositionGroupCache } from '../../src/app/services/employee.model';
import { Shift } from '../../src/app/organize-shifts/shift.model';
import { Layout } from '../../src/app/organize-shifts/layout.model';

import * as HotSchedules from '../HotSchedules/HotSchedules';
import * as ops from '../operations';
import { BasicShiftData } from '../operations';
import * as time from '../time';
import { ScheduleId, EmployeeId, ShiftRecord } from '../HotSchedules/HotSchedules.d';
import { manageMembership, Options as GroupMeOptions } from '../GroupMe/manage-membership';
import { Options as GroupMeAddOptions } from '../GroupMe/ops';

import { setConfig } from '../set-config';
import { login } from '../login';

const MAXIMUM_TOTAL_DAYS = 30;

export async function processBusiness(businessDoc: DocumentSnapshot, opts?: Options): Promise<void> {
  if(!opts) opts = {};
  if(opts.silent)
    opts.quiet = true;

  const businessRef = businessDoc.ref;
  const businessData = businessDoc.data();
  const businessName = businessData.info && (businessData.info.name || businessData.info.storeNumber) || businessRef.id;

  const autoUpdate = businessData.autoUpdate;
  const autoUpdateTimestamp = autoUpdate.toDate ? autoUpdate.toDate() : autoUpdate;
  if(!autoUpdateTimestamp || (autoUpdateTimestamp !== true && autoUpdateTimestamp < new Date)){
    if(!opts.quiet)
      console.log(`AutoUpdate has been turned off or expired for business ${businessName}`);
    return;
  }

  var startDate = new Date;
  var stats: {[statName: string]: number} = {
    hsEmployees: 0,
    matchedShifts: 0,
    unmatchedShifts: 0,
    shiftsWithUnfoundOwners: 0,
    createdShifts: 0,
    deletedShifts: 0,
    createdDays: 0,
    deletedDays: 0,
    createdEmployees: 0,
    archivedEmployees: 0,
    restoredEmployees: 0,
    requestsRemoved: 0,
    groupsAltered: 0,
    usersLinked: 0,
    checkedShifts: 0,
    loadedDays: 0,
    processedDays: 0,
    houseShifts: 0,
    doubleShiftsRemoved: 0,
    doubleShiftsAdded: 0,
    analyzedDays: 0,
    unanalyzedFutureDays: 0,
    employeePositionHistoryCleared: 0,
    warnings: 0,
  };

  if(!opts.quiet)
    console.log(`Processing business ${businessName}`);

  var getBusinessConfig: (arg0: string, arg1?: any) => any,
      employees: {[employeeId: string]: Employee & { isScheduled?: boolean }} = {},
      HSactiveEmployeeIds: EmployeeId[] = [],
      destinations: {[destinationId: string]: TempDestination} = {},
      jobs: TempJob[] = [];

  async function downloadBusinessConfig(): Promise<void> {
    const serverConfigSnapshot = await businessRef.collection('config').doc('server').get();
    getBusinessConfig = setConfig(serverConfigSnapshot.data());
  }
  async function loginToHotSchedules(): Promise<void> {
    const HSusername = getBusinessConfig('HotSchedules.adminUsername', "");
    const HSpassword = getBusinessConfig('HotSchedules.adminPassword', "");
    if(!HSusername)   throw Error('Cannot login to HotSchedules without a username');
    if(!HSpassword)   throw Error('Cannot login to HotSchedules without a password');

    try {
      await login(HSusername, HSpassword);
      if(!opts.quiet)
        console.log("Logged in");
    }catch(e){
      throw new Error("HotSchedules Login failed");
    }
  }
  async function processHotSchedulesEmployees(): Promise<void> {
    // checks all the employees and makes sure that the records are up-to-date and correctly archived in Firestore
    const HSemployees = await HotSchedules.getEmployees();
    const employeesCollection = businessRef.collection('employees');

    stats.hsEmployees = HSemployees.length;

    if(!opts.quiet)
      console.log(`Processing ${HSemployees.length} employees`);

    let updates: Promise<void>[] = [];
    for(let HSemployee of HSemployees){
      // if(!opts.quiet)
      //   console.log(`Processing employee ${HSemployee.firstname} ${HSemployee.lastname}`);
      HSactiveEmployeeIds.push(HSemployee.id);
      updates.push(employeesCollection.where('HSId', "==", HSemployee.id)
        .get()
        .then((employeeQuerySnapshot: QuerySnapshot): void|Promise<any> => {
          if(employeeQuerySnapshot.size > 1)
            throw Error(`${employeeQuerySnapshot.size} employees exist with the same HotSchedules id: ${HSemployee.id}`);

          let shouldBeArchived = !HSemployee.schedules.length || !HSemployee.visible;
          const name = HSemployee.firstname + " " + HSemployee.lastname; // for debugging purposes only

          if(employeeQuerySnapshot.empty && !shouldBeArchived){
            return ops.createEmployee(businessRef, HSemployee, getBusinessConfig)
              .then(() => {
                if(!opts.silent)
                  console.log(`Created ${name}`);
                stats.createdEmployees++;
              });
          }else if(!employeeQuerySnapshot.empty){
            const employeeDoc = employeeQuerySnapshot.docs[0];
            const employeeRef = employeeDoc.ref;

            // admin accounts can be archived, that just doesn't mean anything for them. Other areas of the app will still let them in
            // Longterm Employees and Service Accouts will never be archived automatically by this script
            if(employeeDoc.get('roles.longtermEmployee') || employeeDoc.get('roles.serviceAccount'))
              shouldBeArchived = false; // Manually preserve them

            const isArchived = employeeDoc.get('archived');
            let innerUpdates = [];

            if(isArchived && !shouldBeArchived){
              innerUpdates.push(
                ops.unarchiveEmployee(employeeRef)
                  .then(() => {
                    if(!opts.silent)
                      console.log(`Restored ${name}`);
                    stats.restoredEmployees++;
                  }));
            }else if(!isArchived && shouldBeArchived){
              innerUpdates.push(
                ops.archiveEmployee(employeeRef)
                  .then(() => {
                    if(!opts.silent)
                      console.log(`Archived ${name}`);
                    stats.archivedEmployees++;
                  }));
            }

            innerUpdates.push(ops.updateEmployee(employeeDoc, HSemployee));

            return Promise.all(innerUpdates);
          }else{
            // skip the employee because they don't exist, and we don't want them to exist
          }
      }));
    }

    await Promise.all(updates);
  }
  async function secondPhaseProcessing(): Promise<void> {
    // download and process more data
    let processes = [];

    // load employees from firestore
    processes.push(businessRef.collection('employees').where('archived', '==', false).get()
      .then(employeesQuerySnapshot => {
        let updates = [];

        const positions: TempPosition[] = [
          { property: 'requestedPosition', validForDays: getBusinessConfig('positionRequestValidForDays', 7) },
          { property: 'recommendedPosition', validForDays: getBusinessConfig('positionRecommendationValidForDays', 7) }
        ].map(p => (p as TempPosition).threshold = new Date(p.validForDays * time.oneDay + +Date.now())) as unknown as TempPosition[];
        const minNewbieThreshold = new Date(Date.now() - getBusinessConfig('newbiesForDays', 21) * time.oneDay);
        const minPositionHistoryThreshold = new Date(Date.now() - getBusinessConfig('shifts.keepPositionHistoryDays', 7) * time.oneDay);

        employeesQuerySnapshot.forEach(employeeDoc => {
          const employee/*: Employee */ = employeeDoc.data();
          // I don't want to go to the length of typing this because there are many chagnes
          // I should create a mapped type that works

          // Employees will be archived if they are neither a longtermEmployee nor a serviceAccount,
          // and if they are not active HotSchedules employees.
          let shouldArchive = !(employee.roles && (employee.roles.longtermEmployee || employee.roles.serviceAccount)) &&
                              HSactiveEmployeeIds.indexOf(employee.HSId) === -1;

          if(shouldArchive){
            // admin accounts can be archived; other areas will let them bypass the archived flag
            updates.push(
              ops.archiveEmployee(employeeDoc.ref)
                .then(() => {
                  if(!opts.silent)
                    console.log(`Archived inactive employee: ${employee.name}`);
                  stats.archivedEmployees++;
                }));
          }else{
            employee.isScheduled = false;
            employee.ref = employeeDoc.ref;
            employee.id = employee.ref.id;

            // TODO: use the same constructor that the client uses so that most of the logic is held constant

            let employeeUpdates = {};

            // remove position requests that have become outdated
            for(let position of positions){
              let request = employee[position.property];
              if(!request)
                continue;

              if(+request.requested.toDate() < +position.threshold){
                employeeUpdates[position.property] = FieldValue.delete();
                employee[position.property] = null;
                stats.requestsRemoved++;
              }
            }

            // Remove old positionHistories
            let clearedHistory = false;
            for(let layoutTime in (employee.positionHistory || {}))
              if(+layoutTime <= +minPositionHistoryThreshold){
                employeeUpdates[`positionHistory.${layoutTime}`] = FieldValue.delete();
                employee.positionHistory[layoutTime] = null;
                clearedHistory = true;
              }
            if(clearedHistory)
              stats.employeePositionHistoryCleared++;


            // Check for some groups:
            if(!employee.groups)
              employee.groups = {};

            // newbie -- If the person has been hired or restored from the archives recently
            const shouldBeNewbie: boolean =
              !!((employee.hired.toDate() > minNewbieThreshold) ||
                (employee.restored && (employee.restored.toDate() > minNewbieThreshold)));

            if(shouldBeNewbie === !employee.groups.newbie){
              employeeUpdates['groups.newbie'] = shouldBeNewbie;
              stats.groupsAltered++;
            }


            // try to link to users, only if they are not already linked
            if(!employee.userId)
              updates.push(
                ops.linkEmployeeToUser(employee.ref, getBusinessConfig)
                .then(linked => linked ? ++stats.usersLinked : 0 ));

            if(Object.keys(employeeUpdates).length)
              updates.push(
                employee.ref.update(employeeUpdates)
                .then(() => {
                  if(!opts.quiet)
                    console.log(`Applied ${Object.keys(employeeUpdates).length} updates to ${employee.name}`);
                }));

            employees[employeeDoc.id] = employee as Employee;
          }
        });

        return Promise.all(updates);
      }));

    // load the destinations and their server config
    processes.push(businessRef.collection('destinations').get()
      .then(destinationsQuerySnapshot => {
        let updates = [];

        destinationsQuerySnapshot.forEach(destinationDoc => {
          const destinationRef = destinationDoc.ref;

          updates.push(destinationRef.collection('config').doc('server').get()
            .then(destinationServerConfigSnapshot => {
              destinations[destinationRef.id] = {
                getConfig: setConfig(getBusinessConfig, destinationServerConfigSnapshot.data()),
                daysCollectionRef: destinationRef.collection('days'),
                days: {},
              };
            }));
        });

        return Promise.all(updates);
      }));

    // load the HotSchedules jobs
    processes.push(HotSchedules.getJobs()
      .then(data => {
        for(let job of data)
          jobs.push({
            id: job.id,
            name: job.jobName,
            scheduleId: job.defaultScheduleId,
          });
      }));

    await Promise.all(processes);
  }
  async function processShifts(): Promise<void> {
    var daysWithoutShifts = 0,
        totalIterations = 0,
        date = (function(){
          // start a few days in the past
          const now = new Date();
          const startBackDays = Math.max(getBusinessConfig('HotSchedules.beginSyncingBackDays', 2), 1);
          const initialDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - startBackDays));

          if(!opts.quiet)
            console.log(`Initial Date: ${initialDate.toUTCString()}`);
          return initialDate;
        })();

    var notFoundHotScheduleIds: {[HotSchedulesId: number]: number} = {};

    // note: this line places a hardcoded cap on the maximum number of days the algorithm will update
    while(daysWithoutShifts < getBusinessConfig('HotSchedules.searchDaysWithoutShifts', 3)
          && totalIterations++ < MAXIMUM_TOTAL_DAYS){
      var loadData = [];

      // Load firebase data into the local data system for the current day from all destinations
      loadData.push(HotSchedules.getShifts(+date, +date + time.oneDay));
      let compareTimestamp = Timestamp.fromDate(date);

      for(let destinationId in destinations){
        let destination = destinations[destinationId];
        loadData.push(destination.daysCollectionRef.where('date', '==', compareTimestamp).get().then(dayQuerySnapshot => {
          if(dayQuerySnapshot.size > 1)
            throw Error(`We somehow have ${dayQuerySnapshot.size} days with the same date, ${date.toDateString()}, in the same destination, ${destinationId}`);

          if(dayQuerySnapshot.empty)
            return destination; // Do nothing (because there's no data) but return the destination so it conforms to the expected data structure
          else{
            const dayDoc = dayQuerySnapshot.docs[0];
            const dayRef = dayDoc.ref;
            let day: TempDay = destination.days[dayRef.id] = Object.assign({
              shifts: {},
              note: "",
              analyzed: false,
              shiftsCollectionRef: dayRef.collection('shifts'),
            },
            dayDoc.data(),
            { date: dayDoc.get('date').toDate() }); // save the date last so it overwrites the Timestamp value with a Date

            // load all the shifts for this destination on this day
            return day.shiftsCollectionRef.get().then(shiftsQuerySnapshot => {
              shiftsQuerySnapshot.forEach(shiftDoc => {
                let shift = { unfound: true };

                // convert Firestore Timestamp's into js Date's
                let data = shiftDoc.data();
                for(let prop in data){
                  if(data[prop] && data[prop].toDate)
                    shift[prop] = data[prop].toDate();
                  else
                    shift[prop] = data[prop];
                }

                day.shifts[shiftDoc.id] = shift as TempShift;
              });
              return destination;
            });
          }
        }));
      }

      var [shifts, ...loadedDestinations] = await Promise.all(loadData);
      stats.loadedDays++;
      if(shifts.length === 0){
        daysWithoutShifts++;
      }else{
        if(daysWithoutShifts && !opts.quiet)
          console.log(`Went ${daysWithoutShifts} day without finding a shift`);
        daysWithoutShifts = 0;

        if(!opts.quiet)
          console.log(`Processing ${shifts.length} shifts on ${ date.toDateString() }`);
        stats.processedDays++;
      }

      let shiftUpdates = [];
      let shift: ShiftRecord;
      forEachShift: for(shift of shifts){
        if(shift.house){
          // TODO: businesses may want to see house shifts on the schedule
          // right now that wouldn't make any sense because nobody is assigned to them,
          // so the shift leaders can't be expecting anyone to come in
          stats.houseShifts++;
          stats.unmatchedShifts++;
          continue;
        }
        let basicData: BasicShiftData = {
          jobId: shift.jobId,
        } as BasicShiftData; // the rest will be filled in right now
        basicData.ownerId = (function(HSownerId, employees){
          for(let employeeId in employees)
            if(employees[employeeId].HSId == HSownerId){
              employees[employeeId].isScheduled = true;
              return employeeId;
            }

          // this can happen when an employee is fired, but still has some shifts on the schedule (maybe in the past)
          // skip the shift with a warning statistic
          stats.shiftsWithUnfoundOwners++;
          stats.unmatchedShifts++;
          if(!notFoundHotScheduleIds[HSownerId])
            notFoundHotScheduleIds[HSownerId] = 1;
          else
            notFoundHotScheduleIds[HSownerId]++;
          return ""; //not found -> skip
          // throw Error(`Could not find HotSchedules Id ${HSownerId} in list of ${Object.keys(employees).length} employees`);
        })(shift.ownerId, employees);
        if(!basicData.ownerId)
          continue;

        [basicData.job, basicData.scheduleId] = (function(jobId, jobs: TempJob[]){
          for(let job of jobs)
            if(job.id === jobId)
              return [job.name, job.scheduleId] as [string, ScheduleId];
          throw Error(`Could not find jobId ${jobId} in list of ${jobs.length} jobs`);
        })(shift.jobId, jobs);
        [basicData.timeIn, basicData.timeOut] = (function(startTimeString, durationMinutes){
          let startMoment = utc(startTimeString, 'YYYY-MM-DD HH:mm');
          let endMoment = startMoment.clone().add(durationMinutes, 'minutes');
          return [startMoment.toDate(), endMoment.toDate()];
        })(shift.startDate + " " + shift.startTime, shift.duration);

        var actionTaken = false;

        forEachDestination: for(let destination of loadedDestinations){
          if(destination.getConfig('schedulesToTranscript', []).indexOf(basicData.scheduleId) === -1)
            continue;

          var day: TempDay|false = false;
          for(let dayId in destination.days){
            if(+destination.days[dayId].date === +date){
              day = destination.days[dayId];
              break;
            }
          }
          if(!day){
            day = {
              date: new Date(+date), // to make sure it's not passed by reference
              note: "",
              analyzed: false
            } as unknown as TempDay; // I will finish constructing it right now

            let newDayRef = destination.daysCollectionRef.doc();
            await newDayRef.set(day);
            stats.createdDays++;

            Object.assign(day, {
              shiftsCollectionRef: newDayRef.collection('shifts'),
              shifts: {},
            });

            destination.days[newDayRef.id] = day;
          }

          for(let shiftId in day.shifts){
            let shift = day.shifts[shiftId];
            stats.checkedShifts++;
            if( shift.ownerId === basicData.ownerId &&
                +shift.timeIn === +basicData.timeIn &&
                +shift.timeOut === +basicData.timeOut
            ){
              shift.unfound = false;
              actionTaken = true;
              stats.matchedShifts++;
              break forEachDestination;
              // a shift cannot be in multiple destinations because a person cannot be in two places at once
            }
          }

          // save the addition locally for proper post-day processing
          const constructedShift = ops.createShift(basicData, destination.getConfig);
          const newShiftRef = day.shiftsCollectionRef.doc();
          day.shifts[newShiftRef.id] = constructedShift as TempShift;
          shiftUpdates.push(
            newShiftRef.set(constructedShift)
            .then(() => stats.createdShifts++ ));
          actionTaken = true;
          continue forEachDestination;
        }

        // it wasn't found or created within a destination
        if(!actionTaken)
          stats.unmatchedShifts++;
      }

      //TODO: optimize all of these awaits to run more things in parallel and save compute time

      // check for unfound and double shifts
      let employeeShifts = {}; // [employeeId: string]: { destinationIndex: number, dayId: string, doubleShift: boolean, shiftId: string }[]
      for(let destinationIndex in loadedDestinations){
        const destination = loadedDestinations[destinationIndex];
        for(let dayId in destination.days){
          let day = destination.days[dayId];
          if(+day.date !== +date){
            // Throw a noisy error right now to alert me to any algorithm flaws.
            throw Error(`[compile.js]: the thing that should never happen, happened: we have a different day in cache than we were expecting`);
            /*
            // this should honestly never happen, but extra cleanup can't hurt
            // I only want to consider the day that we downloaded...
            delete destination.days[dayId];
            continue;
            */
          }

          for(let shiftId in day.shifts){
            let shift = day.shifts[shiftId];
            if(shift.unfound){
              shiftUpdates.push(
                day.shiftsCollectionRef.doc(shiftId).delete()
                .then(() => delete day.shifts[shiftId])
                .then(() => stats.deletedShifts++ ));
            }else if(!shift.shortShift){
              if(!employeeShifts[shift.ownerId])
                employeeShifts[shift.ownerId] = [];

              employeeShifts[shift.ownerId].push({
                destinationIndex,
                dayId,
                doubleShift: shift.doubleShift,
                shiftId
              });
            }else if(shift.doubleShift){
              console.log(`Algorithm Error: shift for ${employees[shift.ownerId] && employees[shift.ownerId].name || shift.ownerId} is both short and double :|`);
              stats.warnings++;
            }else{
              // The shift was matched to one in HS, is regular length, and is not a double shift.
              // No action needed
            }
          }
        }
      }

      await Promise.all(shiftUpdates);

      // perform the double shift updates in a second batch so that the refs all exist
      let doubleShiftUpdates = [];
      for(let employeeId in employeeShifts){
        const shifts = employeeShifts[employeeId];
        for(let shift of shifts){
          const shiftRef = loadedDestinations[shift.destinationIndex].days[shift.dayId].shiftsCollectionRef.doc(shift.shiftId);
          if(shifts.length <= 1 && shift.doubleShift){
            doubleShiftUpdates.push(
              shiftRef.update({ doubleShift: false })
              .then(() => stats.doubleShiftsRemoved++)
              .catch(error => {
                console.log(`Could not remove double shift for ${employees[employeeId] && employees[employeeId].name || employeeId}: ` + error);
                stats.warnings++;
              }));
          }else if(shifts.length > 1 && !shift.doubleShift){
            doubleShiftUpdates.push(
              shiftRef.update({ doubleShift: true })
              .then(() => stats.doubleShiftsAdded++)
              .catch(error => {
                console.log(`Could not add double shift for ${employees[employeeId] && employees[employeeId].name || employeeId}: ` + error);
                stats.warnings++;
              }));
          }else{
            // This shift's double-shift label is correct
            // No action needed
          }
        }
      }

      await Promise.all(doubleShiftUpdates);

      // clean up any days that shouldn't exist because they have no shifts
      // and local delete to conserve memory
      let dayUpdates = [];
      for(let destination of loadedDestinations)
        for(let dayId in destination.days){
          const day = destination.days[dayId];

          // if the day exists but has no shifts, it should be deleted.
          // Ideally, the day would never be created if it has no shifts;
          // however, an error could cause this or all the shifts could be removed intentionally
          if(Object.keys(day.shifts).length === 0)
            dayUpdates.push(ops.deleteDay(destination.daysCollectionRef.doc(dayId))
              .then(() => delete destination.days[dayId])
              .then(() => stats.deletedDays++))
          else
            delete destination.days[dayId];
        }

      await Promise.all(dayUpdates);

      date = new Date(+date + time.oneDay);
    }

    for(let HotSchedulesId in notFoundHotScheduleIds){
      console.log(`Found ${notFoundHotScheduleIds[HotSchedulesId]} shifts for employee with HSID ${HotSchedulesId}, but could not find that employee among ${Object.keys(employees).length} active employees in FireStore.`);
    }
  }
  async function analyzeLayouts(): Promise<void> {
    // Only analyze days of layouts at a time, only in the past, and only once
    // WARNING: This could discourage leaders from doing their setups in advance
    // because they won't have as much data and prompts available when they do it
    if(!opts.quiet)
      console.log("Analyzing layouts")

    // Only look for days that are before today
    const now = new Date();
    const maxDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1, 23));

    var employeesWithHistory: { [employeeId: string]: PositionHistory } = {};

    var processingStack = [];

    // Run the destinations in parallel because once it gets going, it will only be doing one day each time
    // I don't want to do the days one at a time because they're in different destinations
    for(let destinationId in destinations){
      const destination = destinations[destinationId];
      const unanalyzedDaysRef = destination.daysCollectionRef
          .where("analyzed", "==", false)
          // .where("date", "<", maxDate)
          // .orderBy("date", "desc")
          .limit(10) // Never do more than 10 at a time
          ;

      // NOTE: A composite index is required to run these two where clauses together

      // I don't want to have to create indexes for every day collection
      // because that would complicate the onboarding process. If I could automate this
      // that might be acceptable
      // I also don't want to create a collectionGroup because that runs them all together
      // and I don't know an easy way to differentiate the businesses without storing
      // the businessId in every day document

      // Thus, I will simply pull the unanalyzed days and filter here the ones that
      // are in the future. This won't cause a major issues because there will only be
      // a week's worth or two of days in the future

      processingStack.push(
        unanalyzedDaysRef.get().then(unanalyzedDaysInThePastSnapshot => {
          var networkFunctions = [];

          for(let dayDoc of unanalyzedDaysInThePastSnapshot.docs){
            const date = dayDoc.get('date');

            if(dayDoc.get('date').toMillis() > +maxDate){
              stats.unanalyzedFutureDays++;
              continue; // It's in the future
            }

            const layoutsRef = dayDoc.ref.collection('layouts').orderBy('time');
            networkFunctions.push(layoutsRef.get().then(layoutsSnapshot => {

              let positionsScheduled: { [employeeId: string]: string[] } = {};

              let lastTime: number; // UTC hours of the last layout processed
              for(let layoutDoc of layoutsSnapshot.docs){
                const layout: Layout = layoutDoc.data() as Layout;
                const layoutKey = (layout.time as unknown as Timestamp_T).toMillis();

                // We only want one position log per shift
                // There are two shifts: Day and Night
                // Layouts before 5pm are day shifts, and any layout at or after 5 is a night shift
                // Since the layouts are ordered by time, we want to reset the positions
                // the first time it crosses the boundary.

                // TODO: track the shifts by shiftId to deal with multiple shifts better
                const currentTime = (layout.time as unknown as Timestamp_T).toDate().getUTCHours();
                if(lastTime && lastTime < 17  && 17 <= currentTime)
                  positionsScheduled = {};

                lastTime = currentTime;

                for(let sectionId in layout.sections)
                  for(let positionId in layout.sections[sectionId].positions){
                    const position = layout.sections[sectionId].positions[positionId];

                    // We will use three values to get valuable and easy position groups
                    // The `positionGroup` if it's defined,
                    // then the requireTraining value --> either the first value in an array, or a string value
                    // then an id property as a last resort
                    // then a default value to prevent errors if the layout isn't constructed properly
                    const positionGroup: PositionGroupCache = {
                      title: position.title,
                      groupId: position.positionGroup ||
                        (position.requireTraining ? (
                          Array.isArray(position.requireTraining) ? position.requireTraining : [position.requireTraining]
                        )[0] : undefined) ||
                        position.id ||
                        "+missingPositionId",
                    }

                    for(let ownerId of (position.shifts || [])){
                      if(!employeesWithHistory[ownerId])
                        employeesWithHistory[ownerId] = {};
                      if(!positionsScheduled[ownerId])
                        positionsScheduled[ownerId] = [];

                      // Only include each position group once per shift, the first time it occurs
                      if(!positionsScheduled[ownerId].includes(positionGroup.groupId)){
                        positionsScheduled[ownerId].push(positionGroup.groupId);
                        employeesWithHistory[ownerId][layoutKey] = positionGroup
                      }
                    }
                  }
              }
            }));

            networkFunctions.push(
              dayDoc.ref.update({analyzed: true})
              .then(() => stats.analyzedDays++));
          }

          return Promise.all(networkFunctions);
        }));
    }

    await Promise.all(processingStack);

    if(Object.keys(employeesWithHistory).length){
      for(let employeeId in employeesWithHistory){
        const employee = employees[employeeId];
        if(!employee){
          console.log(`[analyzeLayouts]: Could not find employeeId ${employeeId} in list of ${employees.length} employees`)
          continue;
        }

        // Just write in these new values without overwriting old ones
        let newHistoryLogs = {};
        for(let layoutTime in employeesWithHistory[employeeId])
          newHistoryLogs[`positionHistory.${layoutTime}`] = employeesWithHistory[employeeId][layoutTime];

        processingStack.push(
          (<any>employee).ref.update(newHistoryLogs)
          .then(() => stats.employeePositionHistoryUpdated++ ));
      }
    }

    await Promise.all(processingStack);
  }
  async function reportUpdateToBusiness(): Promise<void> {
    // update the 'updated' timestamp on the business
    await businessRef.update({
      lastUpdated: FieldValue.serverTimestamp(),
      hsEmployees: stats.hsEmployees,
    });
  }

  function logResults(): void {
    console.log((stats => {
      let durationSeconds = (+(new Date) - +startDate) / time.oneSecond;
      let processingSeconds = Math.floor(durationSeconds * 10) / 10;
      let message = `Finished processing data for business ${businessName} in ${processingSeconds}s:`;

      for(let stat in stats)
        if(stats[stat])
          message += `\n${stat}: ${stats[stat]}`;

      return message;
    })(stats));
  }

  await Promise.resolve(0)

  .then(downloadBusinessConfig)
  .then(loginToHotSchedules)
  .then(processHotSchedulesEmployees)
  .then(secondPhaseProcessing)
  .then(() => opts.noShifts ? console.log('Skipping shift processing') : processShifts())
  .then(() => opts.noAnalysis ? console.log('Skipping layout analysis') : analyzeLayouts())
  .then(() => businessData.processGroupMe && !opts.noGroupMe && manageMembership(employees, getBusinessConfig, opts))
    // ^^ GroupMe doesn't use all these options, but it may use some
  .then(reportUpdateToBusiness)

  .catch((error) => console.log(`Error compiling and processing HotSchedules data for ${businessName}: `, error))
  // .finally is not supported by Node 8 which FireFunctions uses
  .then(() => !opts.silent && logResults());
}
export async function processBusinesses(options?: Options): Promise<void> {
  const businesses = await env.collection('businesses').get();
  console.log(`Processing ${businesses.size} businesses`);

  for(let businessDoc of businesses.docs) {
    // Nearly identical to a DocumentSnapshot, acceptable
    await processBusiness(businessDoc as unknown as DocumentSnapshot, options);
  }
}

interface TempDestination {
  getConfig: (string) => any;
  daysCollectionRef: CollectionReference,
  days: {
    [dayId: string]: TempDay;
  }
}
interface TempDay {
  date: number;
  note: string;

  analyzed: boolean;

  shiftsCollectionRef: CollectionReference,
  shifts: { [shiftId: string]: TempShift }
}
type TempShift = Shift & {
  ownerId: EmployeeId;
  unfound: boolean;
}
interface TempJob {
  id: number;
  name: string; // "Leadership", "Front of House General"
  scheduleId: ScheduleId;
}
interface TempPosition {
  property: string;
  validForDays: number;
  threshold: Date
}

export interface Options extends GroupMeOptions, GroupMeAddOptions {
  noGroupMe?: boolean; // skip GroupMe processing
  noShifts?: boolean; // skip shift processing
  noAnalysis?: boolean; // skip layout analyzing
  quiet?: boolean; // mute many 'regular-work' outputs
  silent?: boolean; // if true, overrides quiet to true as well
}
