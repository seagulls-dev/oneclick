import { PositionDefinition } from "../../../src/app/config/client-config.model";
import { RatingCriteriaPool } from "../../../src/app/config/training-config.model";

import { SharedFOHratingCriteria } from "../SHARED/foh-rating-criteria";

export const FOHprogression: PositionDefinition[] = [  {
  criterion: [ "-LZ0KafGibvcuIOSpoOh", "-LZ0KafGibvcuIOSpoOi", "-LYYJTcI60k5I_s1egVC", "-LZ0KafHfeuk6NEgDgvB" ],
  id: "@runner",
  title: "Runner"
}, {
  criterion: [ "-LZ0KafIDYhVUiqADgho", "-LZ0KafIDYhVUiqADghp", "-LZ0SKYVvqPckLATUpCy", "-LYYJTcI60k5I_s1egVC", "-LZ0SKYXcix6Ch7pUM4r" ],
  id: "@drinks",
  title: "Drinks"
}, {
  criterion: [ "-LYYJTcHQbJaLTFCy2rb", "-LYYJTcI60k5I_s1egV9", "-LYYJTcI60k5I_s1egVC", "-LYYJTcJTzpwN3g-tPBz", "-LYYL2AX_xKQiVf4AYDh" ],
  id: "@iPOS",
  title: "iPOS"
}, {
  criterion: [ "-LYYJTcHQbJaLTFCy2rb", "-LYYJTcI60k5I_s1egV9", "-LYYJTcI60k5I_s1egVC", "-LYYJTcJTzpwN3g-tPBz", "-LYYL2AX_xKQiVf4AYDh" ],
  id: "@window",
  title: "Window"
}, {
  criterion: [ "3G8AFpPacSlcuIElUKPm" ],
  id: "@accuracyAce",
  title: "Accuracy Ace"
}, {
  criterion: [ "-LYYJTcHQbJaLTFCy2rb", "-LYYJTcI60k5I_s1egV9", "-LYYJTcI60k5I_s1egVC", "-LYYJTcJTzpwN3g-tPBz", "-LYYL2AX_xKQiVf4AYDh" ],
  id: "@mobileCash",
  title: "Mobile Cash"
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
