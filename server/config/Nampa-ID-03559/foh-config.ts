import { Config } from "../../../src/app/config/config.model";
import { FOHlayouts } from "./foh-layouts";
import { FOHprogression, FOHratingCriteria } from "./foh-progression";

export var FOHConfig: Config = {
  client: {
    destinationId: "frontOfHouse",
    destinationName: "Front of House",
    progression: FOHprogression,
    layoutGeneration : FOHlayouts,
    defaultLayoutTimes: [ 11, 15, 17, 19 ],
    suggestedLayoutTimes: [ 9, 21, 22 ],
  },
  server: {
    schedulesToTranscript: [ 1068231018, 1068231012, 1068231014 ], // FOH, Leadership, Training
    shifts: {
      neverShort: {
        jobIds: [ 1068252330 ], //FOH General
      }
    }
  },
  training: {
    ratingCriteria: FOHratingCriteria,
  }
}
