import { PositionDefinition } from "../../../src/app/config/client-config.model";
import { RatingCriteriaPool } from "../../../src/app/config/training-config.model";

import { SharedFOHratingCriteria } from "../SHARED/foh-rating-criteria";

export const FOHprogression: PositionDefinition[] = [ {
  criterion: [ "-LZ0KafCubTw8ZlORlVa", "-LZ0KafDlvsCa_sNVYCd", "-LYYJTcI60k5I_s1egVC", "-LZ0KafDlvsCa_sNVYCe" ],
  id: "@diningRoom",
  title: "Dining Room"
}, {
  criterion: [ "-LZ0KafGibvcuIOSpoOh", "-LZ0KafGibvcuIOSpoOi", "-LYYJTcI60k5I_s1egVC", "-LZ0KafHfeuk6NEgDgvB" ],
  id: "@runner",
  title: "Runner"
}, {
  criterion: [ "-LZ0KafIDYhVUiqADgho", "-LZ0KafIDYhVUiqADghp", "-LZ0SKYVvqPckLATUpCy", "-LYYJTcI60k5I_s1egVC", "-LZ0SKYXcix6Ch7pUM4r" ],
  id: "@frontCounter",
  title: "Front Counter"
}, {
  criterion: [ "3G8AFpPacSlcuIElUKPm" ],
  id: "@iPOS",
  title: "iPOS"
}, {
  criterion: [ "-LYYJTcHQbJaLTFCy2rb", "-LYYJTcI60k5I_s1egV9", "-LYYJTcI60k5I_s1egVC", "-LYYJTcJTzpwN3g-tPBz", "-LYYL2AX_xKQiVf4AYDh" ],
  id: "@window",
  title: "Window"
}, {
  criterion: [ "3G8AFpPacSlcuIElUKPm" ],
  id: "@shakes",
  title: "Shakes"
}, {
  criterion: [ "-LYYJTcHQbJaLTFCy2rb", "-LYYJTcI60k5I_s1egV9", "-LYYJTcI60k5I_s1egVC", "-LYYJTcJTzpwN3g-tPBz", "-LYYL2AX_xKQiVf4AYDh" ],
  id: "@cashCart",
  title: "Cash Cart"
},{
  criterion: [ "3G8AFpPacSlcuIElUKPm" ],
  id: "@headset",
  title: "Headset"
}, {
  criterion: [ "3G8AFpPacSlcuIElUKPm" ],
  id: "@bagger",
  title: "Bagger"
} ]

export const FOHratingCriteria: RatingCriteriaPool = SharedFOHratingCriteria;
