import { RatingCriteriaPool } from "../../../src/app/config/training-config.model";

export const SharedBOHratingCriteria: RatingCriteriaPool = {
  "Zc409simkIPFQfrTJoa4" : {
    benchmarks: [
      { minScore: 1, meaning: "Little to no communication" },
      { minScore: 2, meaning: "Dishonest Communication" },
      { minScore: 3, meaning: "Minimal Communication" },
      { minScore: 4, meaning: "Partial Communication" },
      { minScore: 5, meaning: "Effective Communication" },
    ],
    title: "Communication",
    tagline: "General Communication"
  },
  "GOluOXXrPTr4t2tr8ghH" : {
    benchmarks: [
      { minScore: 1, meaning: "50% Followed" },
      { minScore: 2, meaning: "60% Followed" },
      { minScore: 3, meaning: "70% Followed" },
      { minScore: 4, meaning: "80% Followed" },
      { minScore: 5, meaning: "Follows All Proceedure" },
    ],
    title: "Proceedure",
    tagline: "General Proceedure"
  },
  "twat6uiTTo420rrVllFU" : {
    benchmarks: [
      { minScore: 1, meaning: "Bucket Sitter" },
      { minScore: 2, meaning: "Works When Told" },
      { minScore: 3, meaning: "Minimal Work done" },
      { minScore: 4, meaning: "Works as expected" },
      { minScore: 5, meaning: "Exceeds Expectations" },
    ],
    title: "Productivity",
    tagline: "General Productivity"
  },
  "Po8rbw0ltL9uswK4nd7L" : {
    benchmarks: [
      { minScore: 1, meaning: "Consistently Messing Up Orders" },
      { minScore: 2, meaning: "Makes mistakes at times" },
      { minScore: 3, meaning: "Most orders are correct" },
      { minScore: 4, meaning: "Rarely Makes Mistakes" },
      { minScore: 5, meaning: "Always makes orders Correctly" },
    ],
    title: "Accuracy",
    tagline: "General Accuracy"
  },
  "ddwuzIgK7KfzutCUJY8B" : {
    benchmarks: [
      { minScore: 1, meaning: "All Red, Low Urgency" },
      { minScore: 2, meaning: "Some Red, Urgent when Red" },
      { minScore: 3, meaning: "Mostly Yellow, Urgent when Needed" },
      { minScore: 4, meaning: "Mostly Green Screen, Highly Urgent most Times" },
      { minScore: 5, meaning: "Green Screens, Always Highly Urgent" },
    ],
    title: "Speed",
    tagline: "General Speed"
  },
  "V8GBg6uCAdCwXdJRgcsI" : {
    benchmarks: [
      { minScore: 1, meaning: "Never informs Breader of needs" },
      { minScore: 2, meaning: "Sometimes lets the breader know what needs to be made next" },
      { minScore: 3, meaning: "Will inform breader of needs, but not before hand" },
      { minScore: 4, meaning: "Will inform Breader of needs most of the time" },
      { minScore: 5, meaning: "Always lets the breader know of upcoming needs" },
    ],
    title: "Forecasting",
    tagline: "Machines -- Forecasting"
  },
  "MEVIs7dxrnw5I8e9hJ4L" : {
    benchmarks: [
      { minScore: 1, meaning: "Pays no attention to Lean, Too much or too little chicken" },
      { minScore: 2, meaning: "Always extra chicken after 20 min" },
      { minScore: 3, meaning: "Prepares food that mostly stays for 20 mins but has to throw away some" },
      { minScore: 4, meaning: "Prepares the right amount of chicken most the time" },
      { minScore: 5, meaning: "Always prepares the right amount of chicken" },
    ],
    title: "Lean",
    tagline: "Breading -- Lean"
  },
  "fLX3ZPSraqBX33OeyCiq" : {
    benchmarks: [
      { minScore: 1, meaning: "Always holding Low Urgency" },
      { minScore: 2, meaning: "Some Holding, Urgent when Holding" },
      { minScore: 3, meaning: "Barely not Holding, Urgent when Needed" },
      { minScore: 4, meaning: "Mostly not Holding, Highly Urgent most Times" },
      { minScore: 5, meaning: "Never Holding, Always Highly Urgent" },
    ],
    title: "Speed",
    tagline: "Breading -- Speed"
  }
}
