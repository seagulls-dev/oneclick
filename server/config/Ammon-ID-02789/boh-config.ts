import { Config } from "../../../src/app/config/config.model";
import { BOHprogression, BOHratingCriteria } from "./boh-progression";
import { BOHlayouts } from "./boh-layouts";

export var BOHConfig: Config = {
  client: {
    destinationId: "backOfHouse",
    destinationName: "Back of House",
    defaultLayoutTimes: [ 7.5, 11, 14, 5.75, 19 ],
    suggestedLayoutTimes: [ 9, 11, 14, 17, 19, 22 ],
    progression: BOHprogression,
    layoutGeneration: BOHlayouts,

    useListsWithName: "Chet List",
    useBreakTimer: true
  },
  server: {
    schedulesToTranscript: [ 1048009780 ], // HS Back of House ScheduleID
  },
  training: {
    ratingCriteria: BOHratingCriteria
  }
}