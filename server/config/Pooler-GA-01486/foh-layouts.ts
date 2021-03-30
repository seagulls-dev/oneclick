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
          id: "+shiftLeader",
          jobTitle: "Shift Leader",
          maxNumber: 2,
          requireRoles: ["shiftLeader"],
          title: "Shift Leader",
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
          id: "+shakes",
          maxNumber: 2,
          requireTraining: "@shakes",
          title: "Close Shakes",
          width: 2,
          beginsRow: true
        }, {
          id: "+cage",
          maxNumber: 2,
          requireTraining: "@diningRoom",
          title: "Close Cage",
          width: 2,
          beginsRow: true
        } ]
      } ]
    },
    "driveThru001": {
      maxColumns: 5,
      displayName: "FOH Layout",
      sections: [ {
        sectionTitle: "Leadership",
        positions: [ {
          id: "+director",
          maxNumber: 4,
          requireRoles: ["director"],
          title: "Director",
          beginsRow: true
        }, {
          id: "+shiftLeader",
          jobTitle: "Shift Leader",
          maxNumber: 4,
          requireRoles: ["shiftLeader"],
          title: "Shift Leader",
        }, {
          id: "+teamLeader",
          jobTitle: "Team Leader",
          maxNumber: 4,
          requireRoles: ["teamLeader"],
          title: "Team Leader"
        } ]
      }, {
        sectionTitle: "Dining Room",
        positions: [ {
          id: "+diningRoom",
          width: 3,
          maxNumber: 4,
          requireTraining: "@diningRoom",
          positionGroup: "+drGroup",
          title: "Dining Room",
        }, {
          id: "+runners",
          maxNumber: 4,
          width: 2,
          height: 2,
          requireTraining: "@runner",
          positionGroup: "+runnerGroup",
          title: "Runners"
        }, {
          id: "+hosts",
          title: "Hosts",
          positionGroup: "+runnerGroup",
          maxNumber: 3,
          width: 3,
          requireTraining: "@runner"
        } ]
      }, {
        sectionTitle: "Front Counter",
        positions: [ {
          id: "+register1",
          maxNumber: 1,
          title: "Register 1",
          requireTraining: "@frontCounter",
          positionGroup: "+fcGroup"
        }, {
          id: "+register2",
          maxNumber: 1,
          title: "Register 2",
          requireTraining: "@frontCounter",
          positionGroup: "+fcGroup"
        }, {
          id: "+register3",
          maxNumber: 1,
          title: "Register 3",
          requireTraining: "@frontCounter",
          positionGroup: "+fcGroup"
        }, {
          id: "+mobileDrinks",
          maxNumber: 3,
          height: 2,
          title: "Mobile Drinks",
          requireTraining: "@headset",
          positionGroup: "+headsetGroup"
        },  {
          id: "+stocker",
          maxNumber: 3,
          height: 2,
          requireTraining: "@frontCounter",
          positionGroup: "+fcGroup",
          title: "Stocker"
        }, {
          id: "+fcBagger",
          maxNumber: 3,
          width: 2,
          requireTraining: "@bagger",
          positionGroup: "+baggerGroup",
          title: "FC Bagger",
          beginsRow: true
        }, {
          id: "+mobileBagger",
          maxNumber: 3,
          requireTraining: "@bagger",
          positionGroup: "+baggerGroup",
          title: "Mobile Bagger"
        } ]
      }, {
        sectionTitle: "Drive-Thru",
        positions:  [ {
          id: "+iPOS",
          maxNumber: 4,
          width: 4,
          requireTraining: "@iPOS",
          positionGroup: "+iposGroup",
          title: "iPOS"
        }, {
          id: "+cashCart",
          title: "Cash Cart",
          maxNumber: 3,
          positionGroup: "+cashCartGroup",
          requireTraining: "@cashCart"
        }, {
          id: "+outsideRunners",
          title: "Outside Runners",
          positionGroup: "+runnerGroup",
          width: 3,
          maxNumber: 6,
          requireTraining: "@runner",
          beginsRow: true
        }, {
          id: "+traffic",
          title: "Traffic",
          width: 2,
          maxNumber: 2,
          positionGroup: "+runnerGroup",
          requireTraining: "@runner"
        } ]
      }, {
        sectionTitle: "Drive-Thru Cockpit",
        positions: [{
          id: "+expo",
          beginsRow: true,
          maxNumber: 2,
          positionGroup: "+runnerGroup",
          requireTraining: "@runner",
          title: "Expo"
        }, {
          id: "+drinks",
          maxNumber: 2,
          width: 2,
          requireTraining: "@headset",
          positionGroup: "+headsetGroup",
          title: "Drinks"
        }, {
          id: "+stocker",
          maxNumber: 2,
          height: 2,
          requireTraining: "@runner",
          positionGroup: "+runnerGroup",
          title: "Stocker"
        }, {
          id: "+shakes",
          maxNumber: 2,
          requireTraining: "@shakes",
          title: "Shakes"
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
          title: "Window",
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
          id: "+teamLead1",
          jobTitle: "Team Leader",
          maxNumber: 1,
          requireRoles: ["teamLeader"],
          title: "Team Lead 1",
          beginsRow: true
        }, {
          id: "+teamLeader2",
          jobTitle: "Team Leader",
          maxNumber: 1,
          requireRoles: ["teamLeader"],
          title: "Team Lead 2"
        } ]
      }, {
        sectionTitle: "Front Counter",
        positions: [  {
          id: "+register",
          maxNumber: 1,
          requireTraining: "@frontCounter",
          title: "Register"
        }, {
          id: "+lemons",
          width: 1,
          maxNumber: 2,
          requireTraining: "@diningRoom",
          title: "Lemons"
        }, {
          beginsRow: true,
          id: "+fcBagger",
          maxNumber: 2,
          width: 2,
          requireTraining: "@bagger",
          title: "FC Bagger"
        } ]
      }, {
        sectionTitle: "Drive-Thru",
        positions: [{
          id: "+iPOS",
          beginsRow: true,
          width: 2,
          maxNumber: 3,
          requireTraining: "@iPOS",
          title: "iPOS",
        }, {
          id: "+cashCart",
          maxNumber: 2,
          requireTraining: "@cashCart",
          title: "Cash Cart"
        }, {
          id: "+drinks",
          maxNumber: 2,
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
          requireTraining: "@window",
          title: "Window"
        }, {
          id: "+shakes",
          maxNumber: 2,
          requireTraining: "@shakes",
          title: "Shakes",
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
        "+iPOS": {
          minNumber: 2,
        },
        "+outsideRunners": {
          minNumber: 2,
        },
        "+cashCart": {
          minNumber: 1,
        },
        "+dtBagger": {
          minNumber: 1,
        },
        "+drinks": {
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
        "+iPOS": {
          minNumber: 2,
        },
        "+outsideRunners": {
          minNumber: 1,
        },
        "+cashCart": {
          minNumber: 1,
        },
        "+dtBagger": {
          minNumber: 1,
        },
        "+drinks": {
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
        "+drinks": {
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
