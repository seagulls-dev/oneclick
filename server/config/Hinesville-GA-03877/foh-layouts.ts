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
          id: "+teamCaptain",
          jobTitle: "Team Captain",
          maxNumber: 2,
          width: 2,
          requireRoles: ["shiftLeader"],
          title: "Team Captain",
        },{
          id: "+teamLeader",
          maxNumber: 2,
          width: 2,
          requireRoles: ["teamLeader"],
          title: "Team Leader",
        } ]
      }, {
        sectionTitle: "Closing Positions",
        positions: [ {
          id: "+frontCounter",
          maxNumber: 4,
          requireTraining: "@frontCounter",
          positionGroup: "+fcGroup",
          title: "Close FC",
          width: 2
        }, {
          id: "+shakes",
          maxNumber: 2,
          requireTraining: "@shakes",
          title: "Close Shakes",
          width: 2,
          beginsRow: true
        }, {
          id: "+driveThru",
          maxNumber: 2,
          requireTraining: "@diningRoom",
          title: "Close Drive-Thru",
          width: 2,
          beginsRow: true
        }, {
          id: "+money",
          maxNumber: 2,
          title: "Close Money",
          width: 2,
          beginsRow: true
        }, {
          id: "+dishes",
          maxNumber: 2,
          title: "Close Dishes",
          width: 2,
          beginsRow: true
        }, {
          id: "+floor",
          maxNumber: 2,
          requireTraining: "@floor",
          title: "Close Floor",
          width: 2,
          beginsRow: true
        } ]
      } ]
    },
    "driveThru001": {
      maxColumns: 5,
      displayName: "Double Drive Through",
      sections: [ {
        sectionTitle: "Leadership",
        positions: [ {
          id: "+teamCaptain",
          jobTitle: "Team Captain",
          maxNumber: 2,
          requireRoles: ["shiftLeader"],
          title: "Team Captain",
          beginsRow: true
        }, {
          id: "+teamLeader",
          maxNumber: 2,
          requireRoles: ["teamLeader"],
          title: "Team Leader"
        } ]
      }, {
        sectionTitle: "Front Counter",
        positions: [ {
          id: "+diningRoom",
          maxNumber: 2,
          requireTraining: "@diningRoom",
          positionGroup: "+drGroup",
          title: "Dining Room",
          beginsRow: true
        }, {
          id: "+runner",
          title: "Runner",
          positionGroup: "+runnerGroup",
          maxNumber: 3,
          width: 2,
          requireTraining: "@runner"
        }, {
          id: "+register",
          title: "Register",
          maxNumber: 2,
          requireTraining: "@frontCounter",
          positionGroup: "+fcGroup",
        }, {
          id: "+mobileDrinks",
          title: "Mobile Drinks",
          maxNumber: 2,
          positionGroup: "+fcGroup",
          requireTraining: "@frontCounter"
        }, {
          id: "+fcBagger",
          title: "FC Bagger",
          maxNumber: 2,
          width: 2,
          requireTraining: "@bagger",
          positionGroup: "+baggerGroup",
          beginsRow: true
        }, {
          id: "+mobileBagger",
          title: "Mobile Bagger",
          positionGroup: "+baggerGroup",
          maxNumber: 2,
          requireTraining: "@bagger"
        },{
          id: "+saucer",
          title: "Saucer",
          maxNumber: 2,
          width: 2,
          positionGroup: "+fcGroup",
          requireTraining: "@frontCounter"
        } ]
      }, {
        sectionTitle: "Drive-Thru",
        positions:  [ {
          id: "+mobileCash",
          maxNumber: 3,
          height: 2,
          requireTraining: "@cashCart",
          positionGroup: "+cashCartGroup",
          title: "Mobile Cash"
        }, {
          id: "+iPOSLead",
          maxNumber: 2,
          requireTraining: "@iPOS",
          positionGroup: "+iposGroup",
          title: "iPOS Lead"
        }, {
          id: "+iPOS",
          maxNumber: 5,
          width: 3,
          requireTraining: "@iPOS",
          positionGroup: "+iposGroup",
          title: "iPOS"
        }, {
          id: "+expeditorsLeader",
          title: "Exp Leader",
          positionGroup: "+runnerGroup",
          width: 1,
          maxNumber: 2,
          requireTraining: "@runner",
        }, {
          id: "+expeditors",
          title: "Outside Expeditors",
          positionGroup: "+runnerGroup",
          width: 3,
          maxNumber: 6,
          requireTraining: "@runner",
        }, ]
      }, {
        sectionTitle: "Drive-Thru Cockpit",
        positions: [ {
          id: "+drinks",
          maxNumber: 2,
          width: 2,
          requireTraining: "@headset",
          positionGroup: "+headsetGroup",
          title: "Drinks"
        }, {
          id: "+dessert",
          maxNumber: 2,
          requireTraining: "@shakes",
          title: "Dessert"
        }, {
          id: "+saucer",
          maxNumber: 2,
          height: 2,
          requireTraining: "@window",
          positionGroup: "+windowGroup",
          title: "Saucer"
         },{
          id: "+dtBagger",
          maxNumber: 2,
          width: 2,
          requireTraining: "@bagger",
          positionGroup: "+baggerGroup",
          title: "DT Baggers",
          beginsRow: true
        }, {
          id: "+window",
          maxNumber: 2,
          requireTraining: "@window",
          positionGroup: "+windowGroup",
          title: "Window"
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
        }, {
          id: "+rotateSet4",
          height: 2,
          maxNumber: 3,
          title: "Set 4"
        }, {
          id: "+rotateSet5",
          height: 2,
          maxNumber: 3,
          title: "Set 5"
        } ]
      } ]
    },
    "breakfastStructure001": {
      maxColumns: 3,
      displayName: "Breakfast Structure",
      sections: [ {
        sectionTitle: "Leadership",
        positions: [ {
          id: "+teamCaptain",
          jobTitle: "Team Captain",
          maxNumber: 2,
          requireRoles: ["shiftLeader"],
          title: "Team Captain",
          beginsRow: true
        }, {
          id: "+teamLeader",
          jobTitle: "Team Leader",
          maxNumber: 2,
          requireRoles: ["teamLeader"],
          title: "Team Leader"
        } ]
      }, {
        sectionTitle: "Front Counter",
        positions: [ {
          id: "+runner",
          maxNumber: 2,
          requireTraining: "@runner",
          title: "Runner",
          beginsRow: true
        }, {
          id: "+register",
          maxNumber: 1,
          requireTraining: "@frontCounter",
          title: "Register"
        }, {
          id: "+fcBagger",
          maxNumber: 2,
          requireTraining: "@bagger",
          title: "FC Bagger"
        } ]
      }, {
        sectionTitle: "Drive-Thru",
        positions: [{
          id: "+iPOS",
          beginsRow: true,
          maxNumber: 3,
          requireTraining: "@iPOS",
          title: "iPOS",
        }, {
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
          id: "+cashCart",
          maxNumber: 2,
          requireTraining: "@cashCart",
          title: "Cash Cart"
        }, {
          id: "+bagger",
          width: 2,
          maxNumber: 2,
          requireTraining: "@bagger",
          title: "DT Bagger",
          beginsRow: true
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
      structureId: "driveThru001",
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
      structureId: "driveThru001",
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
        "+lemons": {
          minNumber: 1,
        },
        "+bagger": {
          minNumber: 1,
        }
      }
    }
  }
}
