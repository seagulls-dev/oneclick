import { PositionDefinition } from "../../../src/app/config/client-config.model";
import { RatingCriteriaPool } from "../../../src/app/config/training-config.model";

export const BOHprogression: PositionDefinition[] = [ {
    id: "@secondary",
    criterion: [ "Zc409simkIPFQfrTJoa4", "GOluOXXrPTr4t2tr8ghH", "twat6uiTTo420rrVllFU", "Po8rbw0ltL9uswK4nd7L", "ddwuzIgK7KfzutCUJY8B" ],
    title: "Nuggets"
  }, {
    id: "@fries",
    criterion: [ "Zc409simkIPFQfrTJoa4", "GOluOXXrPTr4t2tr8ghH", "twat6uiTTo420rrVllFU", "Po8rbw0ltL9uswK4nd7L", "ddwuzIgK7KfzutCUJY8B" ],
    title: "Fries"
  }, {
    id: "@machines",
    criterion: [ "Zc409simkIPFQfrTJoa4", "GOluOXXrPTr4t2tr8ghH", "twat6uiTTo420rrVllFU", "V8GBg6uCAdCwXdJRgcsI", "ddwuzIgK7KfzutCUJY8B" ],
    title: "Machines"
  }, {
    id: "@breading",
    criterion: [ "Zc409simkIPFQfrTJoa4", "GOluOXXrPTr4t2tr8ghH", "twat6uiTTo420rrVllFU", "MEVIs7dxrnw5I8e9hJ4L", "fLX3ZPSraqBX33OeyCiq" ],
    title: "Breading"
  }, {
    criterion: [ "3G8AFpPacSlcuIElUKPm" ],
    id: "@prep",
    title: "Prep"
  }
]

import { SharedBOHratingCriteria } from "../SHARED/boh-rating-criteria";
export const BOHratingCriteria: RatingCriteriaPool = SharedBOHratingCriteria;
