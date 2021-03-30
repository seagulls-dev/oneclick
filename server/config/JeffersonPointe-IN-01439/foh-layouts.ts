import { LayoutGenerationConfig } from "../../../src/app/config/layout-generation-config.model";

export const FOHlayouts: LayoutGenerationConfig = {
  meta : [ {
    activeTimes: [ 6 ],
    templateId: "morningmorningmorning"
  }, {
    activeTimes: [ 14, 19 ],
    templateId: "slow"
  }, {
    activeTimes: [ 11, 17 ],
    templateId: "busy"
  }, {
    activeTimes: [ 22 ],
    templateId: "closed"
  } ],
  structures : {
    "ClosingLayoutStructure001": {
      maxColumns: 2,
      displayName: "Front Counter Closing",
      sections: [ {
        sectionTitle: "Leadership",
        positions: [ {
         id: "+teamLeader",
          jobTitle: "Team Leader",
          maxNumber: 1,
          requireRoles: ["teamLeader"],
          title: "Team Leader"
        } ]
      }, {
        sectionTitle: "Front Counter",
        positions: [ {
          id: "+frontCounter",
          maxNumber: 4,
          requireTraining: "@frontCounter",
          positionGroup: "+fcGroup",
          title: "Close FC",
          width: 2,
          height: 2
        } ]
      } ]
    },
    "doubleDriveThroughStructure004": {
      maxColumns: 5,
      displayName: "Double Drive Through",
      sections: [ {
        sectionTitle: "Leadership",
        positions: [ {
          id: "+director",
          jobTitle: "Director",
          maxNumber: 3,
          requireRoles: ["director"],
          title: "Director",
          beginsRow: true
        }, {
          id: "+teamLeader",
          jobTitle: "Team Leader",
          maxNumber: 1,
          requireRoles: ["teamLeader"],
          title: "Team Leader"
        } ]
      }, {
        sectionTitle: "Front Counter",
        positions: [ {
          id: "+mobileRunner",
          title: "Mobile Runner",
          positionGroup: "+runnerGroup",
          maxNumber: 2,
          width: 2,
          requireTraining: "@runner",
          beginsRow: true
        }, {
          id: "+mobileDrinks",
          title: "Mobile Drinks",
          maxNumber: 1,
          positionGroup: "+fcGroup",
          requireTraining: "@frontCounter"
        }, {
          id: "+mobileBagger",
          title: "Mobile Bagger",
          positionGroup: "+baggerGroup",
          maxNumber: 2,
          width: 2,
          requireTraining: "@bagger"
        } ]
      }, {
        sectionTitle: "Drive-Thru",
        positions:  [ {
          id: "+mobileCash",
          title: "Mobile Cash",
          maxNumber: 2,
          height: 2,
          positionGroup: "+cashCartGroup",
          requireTraining: "@cashCart"
        }, {
          id: "+iPOS",
          maxNumber: 3,
          width: 3,
          requireTraining: "@iPOS",
          positionGroup: "+iposGroup",
          title: "iPOS"
        }, {
          id: "+traffic",
          title: "Traffic",
          maxNumber: 2,
          positionGroup: "+runnerGroup",
          requireTraining: "@runner"
        }, {
          id: "+outsideExpeditors",
          title: "Outside Expeditors",
          positionGroup: "+runnerGroup",
          width: 3,
          maxNumber: 6,
          requireTraining: "@runner"
        }, {
          id: "+sauceCart",
          title: "Sauce Cart",
          maxNumber: 2,
          positionGroup: "+runnerGroup",
          requireTraining: "@runner"
        } ]
      }, {
        sectionTitle: "Drive-Thru Cockpit",
        positions: [ {
          id: "+desserts",
          maxNumber: 2,
          requireTraining: "@shakes",
          title: "Shakes"
        }, {
          id: "+headset",
          maxNumber: 2,
          width: 3,
          requireTraining: "@headset",
          positionGroup: "+headsetGroup",
          title: "Drinks"
        }, {
          id: "+dtStocker",
          maxNumber: 4,
          height: 2,
          positionGroup: "+fcGroup",
          requireTraining: "@frontCounter",
          title: "Stocker"
        }, {
          id: "+window",
          maxNumber: 2,
          requireTraining: "@window",
          positionGroup: "+windowGroup",
          title: "Window",
          beginsRow: true
        }, {
          id: "+dtBagger",
          maxNumber: 2,
          width: 3,
          requireTraining: "@bagger",
          positionGroup: "+baggerGroup",
          title: "DT Bagger"
        } ]
      }, {
        sectionTitle: "Rotating Buddies",
        positions: [ {
          id: "+rotateSet1",
          height: 2,
          maxNumber: 3,
          title: "Set 1"
        }, {
          id: "+rotateSet2",
          height: 2,
          maxNumber: 3,
          title: "Set 2"
        }, {
          id: "+rotateSet3",
          height: 2,
          maxNumber: 3,
          title: "Set 3"
        } ]
      } ]
    },
    "breakfastStructure001": {
      maxColumns: 3,
      displayName: "Breakfast Structure",
      sections: [ {
        sectionTitle: "Leadership",
        positions: [ {
          id: "+teamLeader",
          jobTitle: "Team Leader",
          maxNumber: 1,
          requireRoles: ["teamLeader"],
          title: "Team Leader"
        } ]
      }, {
        sectionTitle: "Morning Drive-Thru",
        positions: [ {
          id: "+drinks",
          maxNumber: 2,
          requireTraining: "@headset",
          title: "Drinks"
        }, {
          id: "+window",
          maxNumber: 2,
          requireTraining: "@window",
          title: "Window"
        }, {
          id: "+bagger",
          maxNumber: 2,
          requireTraining: "@bagger",
          title: "DT Bagger"
        }, {
          id: "+floater",
          maxNumber: 2,
          requireTraining: "@runner",
          title: "Floater"
        } ]
      } ]
    }
  },
  templates : {
    closed: {
      displayName: "That's All Folks!",
      structureId: "ClosingLayoutStructure001",
      updates: {
        "+diningRoom": {
          minNumber: 1
        },
        "+frontCounter": {
          minNumber: 1
        },
        "+shiftLeader": {
          minNumber: 1
        }
      }
    },
    busy: {
      structureId: "doubleDriveThroughStructure004",
      updates: {
        "+shiftLeader": {
          minNumber: 1,
        },
        "+fcBagger": {
          minNumber: 1,
        },
        "+lane1iPOS": {
          minNumber: 2,
        },
        "+lane2iPOS": {
          minNumber: 2,
        },
        "+lane1expeditors": {
          minNumber: 2,
        },
        "+lane2expeditors": {
          minNumber: 0,
        },
        "+cashCart": {
          minNumber: 1,
        },
        "+dtBagger": {
          minNumber: 1,
        },
        "+headset": {
          minNumber: 1,
        },
        "+window": {
          minNumber: 1,
        }
      }
    },
    slow: {
      structureId: "doubleDriveThroughStructure004",
      updates: {
        "+shiftLeader": {
          minNumber: 1,
        },
        "+fcBagger": {
          minNumber: 1,
        },
        "+lane1iPOS": {
          minNumber: 2,
        },
        "+lane2iPOS": {
          minNumber: 1,
        },
        "+lane1expeditors": {
          minNumber: 1,
        },
        "+lane2expeditors": {
          minNumber: 0,
        },
        "+cashCart": {
          minNumber: 1,
        },
        "+dtBagger": {
          minNumber: 1,
        },
        "+headset": {
          minNumber: 1,
        },
        "+window": {
          minNumber: 1,
        }
    },
    },
    morningmorningmorning: {
      structureId: "breakfastStructure001",
      updates: {
        "+headset": {
          minNumber: 1,
        },
        "+bagger": {
          minNumber: 1,
        }
      }
    }
  }
}
