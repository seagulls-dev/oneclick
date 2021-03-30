import { Config } from "../../../src/app/config/config.model";
import { ClientPermissions } from "./client-permissions";

export var BusinessConfig: Config = {
  client: {
    destinations: [
      { id: 'frontOfHouse', name: 'Front Of House', icon: 'cash-register' },
      { id: 'backOfHouse', name: 'Back Of House', icon: 'utensils' }
    ],
    fullDateDisplayFormat: "dddd, MMMM DD, YYYY",
    shortDateDisplayFormat: "ddd, MMM DD",
    shortTimeDisplayFormat: "h:mm",
    timeDisplayFormat: "h:mm a",
    viewLayoutHistoryDays: 5,

    ratingOutdatedAfterMonths: 6,
    shiftIncludeLookAheadHours: 1.25,
    shiftIncludeLookBehindHours: .33,

    newbiesForDays: 14, // Note: duplicated in the server config area
    minMinutesBeforeAutoControl: 30,
    minMinutesBeforeAutoControlWhenAway: 30,
    preventUntrainedScheduling: false,
    preventUndertrainedScheduling: false, // I want this to be true though

    positionGoodMinimum: 3.8,
    positionSuperGoodMinimum: 4.6,
    positionQualifiedMinimum: 3,
    positionUnderqualifiedMinimum: 1.5,

    twoStepBreakSequence: false,
    useBreakTimer: true,
    breakLengthMinutes: 20,
    minShiftLengthForLongBreakHours: 8,
    longBreakLengthMinutes: 30,

    disableNicknames: false,
    useListsWithName: "List",

    guestInactivityBeforeLogoutMinutes: 10, // I can't set it too short because it doesn't reset itself while writing ratings...
    permissions: ClientPermissions,
    leadershipProgression: [
      { role: 'teamMember',       title: 'Team Member', default: true },
      { role: 'serviceAccount',   title: 'Service Account', private: true },
      { role: 'trainer',          title: 'Trainer' },
      { role: 'teamLeader',       title: 'Team Leader' },
      { role: 'shiftLeader',      title: 'Shift Leader' },
      { role: 'manager',          title: 'Manager' },
      { role: 'longtermEmployee', title: 'Longterm Employee' },
        // Longterm employees will not be removed from OneClick even if they are removed from HotSchedules.
        // This feature should only be used sparingly and for high-level managers who might not work in the store frequently
        // Example: marketing director
      { role: 'director',         title: 'Director' }
    ]
  },
  server: {
    shifts: {
      minimumHoursForBreak: 5,
      minimumShiftHours: 1.75,
      storeClosesAt: "10:00 PM",
      shiftLeaderJobId: 1068252328,
      prepJobId: 1068252348,
      trainingScheduleId: 1068231014,
      neverShort: {
        jobIds: [],
        scheduleIds: [],
      }
    },
    HotSchedules: {
      adminUsername: 'Tylersj2',
      adminPassword: 'Monkeybutt2',
    },
    GroupMe: {
      apiToken: "UphwxAnnfVlsrjghAGS5wHd9EUwcVktT9kzVBkGf", // Da Cowz account
      mainGroupId: "60681911"
    },

    newbiesForDays: 14, // Note: duplicated in the client config area
    storeEmployeeId: "Q1DAfm1RjeBXVtPyZBZ5", // "Da Cowz" employee account
    storeEmployeeEmail: "##STORE_EMAIL##", // Optional store email for logging in as Da Cowz
    positionRequestValidForDays: 7,
    positionRecommendationValidForDays: 7
  },
  training: {
    ratingCriteria: {
      "3G8AFpPacSlcuIElUKPm" : {
        benchmarks: [
          { minScore: 5, meaning: "Is a Chick-fil-A master" },
          { minScore: 4, meaning: "Is very good" },
          { minScore: 3, meaning: "Is good" },
          { minScore: 2, meaning: "Is bad" },
          { minScore: 1, meaning: "Is horrible" }
        ],
        tagline: "General Rating",
        title: "General"
      }
    }
  },
  moola: {
    weeklyBudgets: {
      teamMember: 0,
      trainer: 50,
      teamLeader: 55,
      shiftLeader: 65,
      manager: 75,
      director: 100
    },
    bills: [
      { value: 1, filename: "moola1.jpg" },
      { value: 2, filename: "moola2.jpg", reserved: true },
      { value: 5, filename: "moola5.jpg" },
      { value: 10, filename: "moola10.jpg" },
      { value: 20, filename: "moola20.jpg" },
      { value: 50, filename: "moola50.jpg", reserved: true },
    ]
  }
}
