import { RatingCriteriaPool } from "../../../src/app/config/training-config.model";

export const SharedFOHratingCriteria: RatingCriteriaPool = {
  "-LYYJTcHQbJaLTFCy2rb" : {
    benchmarks: [ {
      minScore: 0,
      meaning: "This employee cannot serve guests even in a slow time."
    }, {
      minScore: 3,
      meaning: "This employee can always serve guests in under 30 seconds."
    }, {
      minScore: 5,
      meaning: "This employee never holds up the business by performing tasks in under 20 seconds."
    } ],
    title: "Speed",
    tagline: "General Speed"
  },
  "-LYYJTcI60k5I_s1egV9" : {
    benchmarks: [ {
      minScore: 0,
      meaning: "This employee frequently makes mistakes that must be corrected by other workers, or go uncorrected."
    }, {
      minScore: 3,
      meaning: "This employee makes mistakes no more than 3 or 4 mistakes on a shift."
    }, {
      minScore: 5,
      meaning: "This employee usually never makes a mistake. This employee can be counted on to do the job correctly."
    } ],
    title: "Accuracy",
    tagline: "General Accuracy"
  },
  "-LYYJTcI60k5I_s1egVC" : {
    benchmarks: [ {
      minScore: 5,
      meaning: "Remarkable service for every guest: creates a connection, uses the Language of Hospitality, and anticipates needs"
    }, {
      minScore: 4,
      meaning: "Strongly attempts to connect with all guests"
    }, {
      minScore: 3,
      meaning: "Creates experiences when convient"
    }, {
      minScore: 2,
      meaning: "Occasional moments of 2nd Mile"
    }, {
      minScore: 1,
      meaning: "Task-oriented; no customer experience"
    } ],
    title: "2nd Mile Service",
    tagline: "Generaal 2MS"
  },
  "-LYYJTcJTzpwN3g-tPBz" : {
    benchmarks: [ {
      minScore: 0,
      meaning: "This employee frequently distracts others from their jobs."
    }, {
      minScore: 3,
      meaning: "This employee makes mistakes no more than 3 or 4 mistakes on a shift."
    }, {
      minScore: 5,
      meaning: "This employee usually never makes a mistake. This employee can be counted on to do the job correctly."
    } ],
    title: "Productivity",
    tagline: "General Productivity"
  },
  "-LYYL2AX_xKQiVf4AYDh" : {
    benchmarks: [ {
      minScore: 0,
      meaning: "This employee frequently relies on others to solve even the simplist of problems."
    }, {
      minScore: 3,
      meaning: "This employee makes mistakes no more than 3 or 4 mistakes on a shift."
    }, {
      minScore: 5,
      meaning: "This employee usually never makes a mistake. This employee can be counted on to do the job correctly."
    } ],
    title: "Problem Solving",
    tagline: "General Problem Solvinb"
  },
  "-LZ0KafCubTw8ZlORlVa" : {
    benchmarks: [ {
      minScore: 1,
      meaning: "Ignores the task at hand."
    }, {
      minScore: 2,
      meaning: "Is unaware of the need for speed, or walks slowly, or struggles."
    }, {
      minScore: 3,
      meaning: "Is aware of the needs, but still consistently falls behind."
    }, {
      minScore: 4,
      meaning: "Consistently keeps the area clean, but occasionally misses spots."
    }, {
      minScore: 5,
      meaning: "Is alwasys cleaning quickly; Effectively clears the tables withing 2 minutes vacating."
    } ],
    tagline: "Dining Room Speed",
    title: "Speed"
  },
  "-LZ0KafDlvsCa_sNVYCd" : {
    benchmarks: [ {
      minScore: 1,
      meaning: "Cannot complete tasks without assistance."
    }, {
      minScore: 2,
      meaning: "Constantly asks for help."
    }, {
      minScore: 3,
      meaning: "Keeps tables clean."
    }, {
      minScore: 4,
      meaning: "Can clean more than just tables."
    }, {
      minScore: 5,
      meaning: "Always busy, always working."
    } ],
    tagline: "Dining Room Productivity",
    title: "Productivity"
  },
  "-LZ0KafDlvsCa_sNVYCe" : {
    benchmarks: [ {
      minScore: 5,
      meaning: "Keeps all areas sparkling and spotless."
    }, {
      minScore: 4,
      meaning: "Checks the unworn areas, outside, and the playground."
    }, {
      minScore: 3,
      meaning: "Cleans only eye-level on down, inside the store."
    }, {
      minScore: 2,
      meaning: "Cleans with detail only the table tops."
    }, {
      minScore: 1,
      meaning: "Only wipes tables; does not attempt to clean any further."
    } ],
    tagline: "Dining Room Cleanliness",
    title: "Cleanliness"
  },
  "-LZ0KafGibvcuIOSpoOh" : {
    benchmarks: [ {
      minScore: 5,
      meaning: "Aware of trays on counter and moves them immediately."
    }, {
      minScore: 4,
      meaning: "Rarely falls behind in a rush and has a sense of urgency."
    }, {
      minScore: 3,
      meaning: "Good at keeping up with demand, but can fall behind in a rush."
    }, {
      minScore: 2,
      meaning: "Takes food out, but wanders on the return. Can't keep up."
    }, {
      minScore: 1,
      meaning: "Leans on the wall, or has no sense of urgency."
    } ],
    tagline: "Running Speed",
    title: "Speed"
  },
  "-LZ0KafGibvcuIOSpoOi" : {
    benchmarks: [ {
      minScore: 5,
      meaning: "Double checks and reads back the service ticket without leaving it with the guest. Never makes errors."
    }, {
      minScore: 4,
      meaning: "Doubles checks and reads back the ticket, but still makes a few errors."
    }, {
      minScore: 3,
      meaning: "Occasional error despite double checking ticket. Does not read them back."
    }, {
      minScore: 2,
      meaning: "Errors rise during a rush."
    }, {
      minScore: 1,
      meaning: "Makes multiple errors on several orders, and fails to double check tickets."
    } ],
    tagline: "Running Accuracy",
    title: "Accuracy"
  },
  "-LZ0KafHfeuk6NEgDgvB" : {
    benchmarks: [ {
      minScore: 5,
      meaning: "Stocks a full apron to anticipate needs. Is helpful everywhere."
    }, {
      minScore: 4,
      meaning: "Finds additional ways to assist during a rush."
    }, {
      minScore: 3,
      meaning: "Productively cleans and runs food without managerial prompting."
    }, {
      minScore: 2,
      meaning: "Is sometimes told to go help in the dining room. Can be found leaning against the wall."
    }, {
      minScore: 1,
      meaning: "Leans on the wall. No food, no work."
    } ],
    tagline: "Running productivity",
    title: "Productivity"
  },
  "-LZ0KafIDYhVUiqADgho" : {
    benchmarks: [ {
      minScore: 5,
      meaning: "Zero errors. Perfect delivery."
    }, {
      minScore: 4,
      meaning: "Knows POS shortcuts and product alterations."
    }, {
      minScore: 3,
      meaning: "Fails to deliver condiments or markers occasionally."
    }, {
      minScore: 2,
      meaning: "Proficient at all basic orders, but makes errors on changes."
    }, {
      minScore: 1,
      meaning: "Cannot operate POS; frequently makes errors."
    } ],
    tagline: "Front Counter Accuracy",
    title: "Accuracy"
  },
  "-LZ0KafIDYhVUiqADghp" : {
    benchmarks: [ {
      minScore: 5,
      meaning: "Finishes orders within 45 seconds by multitasking with drinks and sauces."
    }, {
      minScore: 4,
      meaning: "Multi-tasks, but can improve speed. Uses some shortcuts to improve speed."
    }, {
      minScore: 3,
      meaning: "Trusted to move line in a rush. Can improve multi-tasking."
    }, {
      minScore: 2,
      meaning: "Proficient, but doesn't multi-task."
    }, {
      minScore: 1,
      meaning: "Is easily distracted; can't move customers quickly."
    } ],
    tagline: "Front Counter Speed",
    title: "Speed"
  },
  "-LZ0SKYVvqPckLATUpCy" : {
    benchmarks: [ {
      minScore: 5,
      meaning: "Constantly working with the guests always in mind."
    }, {
      minScore: 4,
      meaning: "Does not need direction, runs checklist well."
    }, {
      minScore: 3,
      meaning: "Does the checklist well, when prompted."
    }, {
      minScore: 2,
      meaning: "Stocks sauces and nothing else. Talks to team members during down times."
    }, {
      minScore: 1,
      meaning: "No work beyond the transactions."
    } ],
    tagline: "Front Counter Productivity",
    title: "Productivity"
  },
  "-LZ0SKYXcix6Ch7pUM4r" : {
    benchmarks: [ {
      minScore: 5,
      meaning: "Resolves problems effectively while using the Language of Hospitality with guests and team members."
    }, {
      minScore: 4,
      meaning: "Resolves mos"
    }, {
      minScore: 3,
      meaning: ""
    }, {
      minScore: 2,
      meaning: ""
    }, {
      minScore: 1,
      meaning: ""
    } ],
    tagline: "Front Counter Communication",
    title: "Communication"
  },
  "-LZ0SKYXcix6Ch7pUM5r" : {
    benchmarks: [ {
      minScore: 1,
      meaning: "Is a leader"
    } ],
    tagline: "General Leadership Requirement",
    title: "Leadership"
  }
}
