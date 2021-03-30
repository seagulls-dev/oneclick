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
    "ClosingLayoutStructure002": {
      maxColumns: 2,
      displayName: "Front Counter Closing",
      sections: [ {
        sectionTitle: "Leadership",
        positions: [ {
          id: "+shiftLeader",
          jobTitle: "Shift Leader",
          maxNumber: 2,
          requireRoles: ["shiftLeader"],
          title: "Shift Leader",
          width: 2
        }, {
          id: "+teamLeader",
          jobTitle: "Team Leader",
          maxNumber: 2,
          requireRoles: ["teamLeader"],
          title: "Team Leader",
          width: 2
        } ]
      }, {
        sectionTitle: "Dining Room",
        positions: [ {
          id: "+diningRoom",
          maxNumber: 4,
          requireTraining: "@diningRoom",
          positionGroup: "+drGroup",
          title: "Close DR",
          width: 2
        } ]
      }, {
        sectionTitle: "Front Counter",
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
          title: "Close Icecream",
          width: 2,
          beginsRow: true
        }, {
          id: "+dishes",
          maxNumber: 2,
          requireTraining: "@diningRoom",
          title: "Dishes",
          width: 2,
          beginsRow: true
        }, {
          id: "+patio",
          maxNumber: 2,
          requireTraining: "@diningRoom",
          title: "Close Patio",
          width: 2,
          beginsRow: true
        }, {
          id: "+backCounter",
          maxNumber: 2,
          requireTraining: "@diningRoom",
          title: "Back Counter",
          width: 2,
          beginsRow: true
        }, {
          id: "+stocker",
          maxNumber: 2,
          requireTraining: "@diningRoom",
          title: "Stocker",
          width: 2,
          beginsRow: true
        } ]
      } ]
    },
    "fohLayout001": {
      maxColumns: 5,
      displayName: "Double Drive Through",
      sections: [ {
        sectionTitle: "Leadership",
        positions: [ {
          id: "+shiftLeader",
          jobTitle: "Shift Leader",
          maxNumber: 2,
          requireRoles: ["shiftLeader"],
          title: "Shift Leader",
          width: 2,
          beginsRow: true
        }, {
          id: "+teamLeader",
          jobTitle: "Team Leader",
          maxNumber: 2,
          requireRoles: ["teamLeader"],
          title: "Team Leader",
          width: 2
        } ]
      }, {
        sectionTitle: "Mobile",
        positions: [  {
          id: "+mobileRunner",
          title: "Mobile Expo",
          positionGroup: "+runnerGroup",
          maxNumber: 3,
          width: 2,
          requireTraining: "@runner"
        }, {
          id: "+mobileDrinks",
          title: "Mobile Drinks",
          maxNumber: 2,
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
        sectionTitle: "Outside Drive-Thru",
        positions:  [ {
          id: "+iPOS",
          maxNumber: 6,
          width: 4,
          requireTraining: "@iPOS",
          positionGroup: "+iposGroup",
          title: "Order Takers"
        }, {
          id: "+trafficDirector",
          title: "Traffic Director",
          maxNumber: 3,
          positionGroup: "+iposGroup",
          requireTraining: "@iPOS"
        }, {
          id: "+outsideExpeditors",
          title: "Outside Runners",
          positionGroup: "+runnerGroup",
          width: 5,
          maxNumber: 6,
          requireTraining: "@runner",
        } ]
      }, {
        sectionTitle: "Inside Drive-Thru",
        positions: [ {
          id: "+headset",
          maxNumber: 2,
          width: 2,
          requireTraining: "@headset",
          positionGroup: "+headsetGroup",
          title: "Drinks",
        }, {
          id: "+desserts",
          maxNumber: 2,
          requireTraining: "@shakes",
          title: "Desserts"
        }, {
          id: "+accuracyCheck",
          maxNumber: 2,
          width: 2,
          requireTraining: "@window",
          positionGroup: "+windowGroup",
          title: "Accuracy Check"
        }, {
          id: "+dtBagger",
          maxNumber: 4,
          width: 3,
          requireTraining: "@bagger",
          positionGroup: "+baggerGroup",
          title: "DT Baggers"
        }, {
          id: "+window",
          maxNumber: 2,
          requireTraining: "@window",
          positionGroup: "+windowGroup",
          title: "Window"
        }, {
          id: "+windowPusher",
          maxNumber: 2,
          requireTraining: "@window",
          positionGroup: "+windowGroup",
          title: "Window Pusher"
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
    "breakfastStructure002": {
      maxColumns: 3,
      displayName: "Breakfast Structure",
      sections: [ {
        sectionTitle: "Leadership",
        positions: [ {
          id: "+shiftLeader",
          jobTitle: "Shift Leader",
          maxNumber: 2,
          width: 2,
          requireRoles: ["shiftLeader"],
          title: "Shift Leader",
          beginsRow: true
        }, {
          id: "+teamLeader",
          jobTitle: "Team Leader",
          maxNumber: 2,
          width: 2,
          requireRoles: ["teamLeader"],
          title: "Team Leader"
        } ]
      }, {
        sectionTitle: "Drive Thru",
        positions: [{
          id: "+iPOS",
          beginsRow: true,
          width: 2,
          maxNumber: 3,
          requireTraining: "@iPOS",
          title: "Order Takers",
        }, {
          id: "+drinks",
          maxNumber: 2,
          width: 2,
          requireTraining: "@headset",
          title: "Drinks"
        }, {
          id: "+bagger",
          width: 2,
          maxNumber: 2,
          requireTraining: "@bagger",
          title: "DT Bagger",
          beginsRow: true
        }, {
          id: "+window",
          maxNumber: 2,
          width: 2,
          requireTraining: "@window",
          title: "Window"
        } ]
      } ]
    }
  },
  templates : {
    closed: {
      displayName: "That's All Folks!",
      structureId: "ClosingLayoutStructure002",
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
      structureId: "fohLayout001",
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
      structureId: "fohLayout001",
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
      structureId: "breakfastStructure002",
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
