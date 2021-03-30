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
          height: 2,
          maxNumber: 2,
          title: "Team Leader",
          width: 1
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
          id: "+Icecream",
          maxNumber: 2,
          requireTraining: "@shakes",
          title: "Close Icecream",
          width: 2,
          beginsRow: true
        }, ]
      } ]
    },
    "doubleDriveThroughStructure004": {
      maxColumns: 6,
      displayName: "Double Drive Through",
      sections: [ {
        sectionTitle: "Leadership",
        positions: [ {
          id: "+shiftLeader",
          jobTitle: "Shift Leader",
          maxNumber: 6,
          requireRoles: ["shiftLeader"],
          title: "Shift Leader",
          beginsRow: true
        }, ]
      }, {
        sectionTitle: "Front Counter",
        positions: [ {
          id: "+diningRoom",
          width: 5,
          maxNumber: 5,
          requireTraining: "@diningRoom",
          positionGroup: "+drGroup",
          title: "Dining Room",
          beginsRow: true
        }, {
          id: "+stocker",
          maxNumber: 2,
          height: 2,
          requireTraining: "@diningRoom",
          positionGroup: "+drGroup",
          title: "Stocker"
        }, {
          id: "+runner",
          title: "Runner",
          positionGroup: "+runnerGroup",
          maxNumber: 5,
          width: 5,
          requireTraining: "@runner"
        }, {
          id: "+register1",
          title: "Register 1",
          maxNumber: 1,
          requireTraining: "@frontCounter",
          positionGroup: "+fcGroup",
          beginsRow: true
        }, {
          id: "+register2",
          title: "Register 2",
          maxNumber: 1,
          positionGroup: "+fcGroup",
          requireTraining: "@frontCounter"
        }, {
          id: "+register3",
          title: "Register 3",
          maxNumber: 1,
          positionGroup: "+fcGroup",
          requireTraining: "@frontCounter"
        }, {
          id: "+register4",
          title: "Register 4",
          maxNumber: 1,
          positionGroup: "+fcGroup",
          requireTraining: "@frontCounter"
        }, {
          id: "+register5",
          title: "Register 5",
          maxNumber: 1,
          positionGroup: "+fcGroup",
          requireTraining: "@frontCounter"
        }, {
          id: "+organizer",
          title: "Organizer",
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
          id: "+mobileDrinks",
          title: "Mobile Drinks",
          maxNumber: 1,
          width: 3,
          positionGroup: "+fcGroup",
          requireTraining: "@frontCounter"
        }, {
          id: "+completer",
          title: "Completer",
          positionGroup: "+baggerGroup",
          maxNumber: 2,
          requireTraining: "@bagger"
        } ]
      }, {
        sectionTitle: "Drive-Thru",
        positions:  [ {
          id: "+cashCart",
          title: "Cash Cart",
          maxNumber: 2,
          positionGroup: "+cashCartGroup",
          requireTraining: "@cashCart"
        }, {
          id: "+iPOS",
          maxNumber: 5,
          width: 5,
          requireTraining: "@iPOS",
          positionGroup: "+iposGroup",
          title: "iPOS"
        },  {
          id: "+sequencer",
          title: "Sequencer",
          positionGroup: "+cashCartGroup",
          width: 1,
          maxNumber: 2,
          requireTraining: "@cashCart",
          beginsRow: true
        }, {
          id: "+lane1expeditors",
          title: "Outside Expeditors",
          positionGroup: "+runnerGroup",
          width: 5,
          maxNumber: 5,
          requireTraining: "@runner",
        } ]
      }, {
        sectionTitle: "Drive-Thru Cockpit",
        positions: [ {
          id: "+headset",
          maxNumber: 2,
          width: 2,
          requireTraining: "@headset",
          positionGroup: "+headsetGroup",
          title: "Drinks",
          beginsRow: true
        }, {
          id: "+icecream",
          maxNumber: 2,
          requireTraining: "@shakes",
          title: "Icecream"
        }, {
          id: "+dtBagger",
          maxNumber: 2,
          width: 2,
          requireTraining: "@bagger",
          positionGroup: "+baggerGroup",
          title: "DT Bagger",
          beginsRow: true
        }, {
          id: "+window",
          maxNumber: 2,
          requireTraining: "@window",
          positionGroup: "+windowGroup",
          title: "Window"
        }, ]
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
      maxColumns: 5,
      displayName: "Breakfast Structure",
      sections: [ {
        sectionTitle: "Leadership",
        positions: [ {
          id: "+teamLeader",
          jobTitle: "Team Leader",
          maxNumber: 2,
          title: "Team Leader"
        } ]
      }, {
        sectionTitle: "Front Counter",
        positions: [ {
          id: "+runner",
          maxNumber: 2,
          width: 2,
          requireTraining: "@runner",
          title: "Runner",
          beginsRow: true
        }, {
          id: "+register1",
          title: "Register 1",
          maxNumber: 1,
          requireTraining: "@frontCounter",
          positionGroup: "+fcGroup",
        }, {
          id: "+register2",
          title: "Register 2",
          maxNumber: 1,
          positionGroup: "+fcGroup",
          requireTraining: "@frontCounter"
        }, {
          id: "+register3",
          title: "Register 3",
          maxNumber: 1,
          positionGroup: "+fcGroup",
          requireTraining: "@frontCounter"
        },  {
          beginsRow: true,
          id: "+fcBagger",
          maxNumber: 2,
          requireTraining: "@bagger",
          title: "FC Bagger"
        }, {
          id: "+stocker",
          width: 2,
          maxNumber: 4,
          requireTraining: "@frontCounter",
          title: "Stocker"
        }, {
          id: "+truck",
          jobTitle: "Truck",
          width: 2,
          maxNumber: 2,
          requireTraining: "@diningRoom",
          title: "Truck"
        } ]
      }, {
        sectionTitle: "Drive Thru",
        positions: [{
          id: "+iPOS",
          beginsRow: true,
          width: 3,
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
