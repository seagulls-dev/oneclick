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
    activeTimes: [ 21 ],
    templateId: "lateSlow"
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
    "doubleDriveThroughStructure004": {
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
          beginsRow: true
        }, {
          id: "+teamLeader",
          jobTitle: "Team Leader",
          maxNumber: 3,
          requireRoles: ["teamLeader"],
          title: "Team Leader"
        } ]
      }, {
        sectionTitle: "Dining Room",
        positions: [ {
          id: "+diningRoom",
          width: 2,
          maxNumber: 4,
          requireTraining: "@diningRoom",
          positionGroup: "+drGroup",
          title: "Dining Room",
          beginsRow: true
        }, {
          id: "+host",
          maxNumber: 2,
          requireTraining: "@diningRoom",
          positionGroup: "+drGroup",
          jobTitle: "Dining Room Host",
          title: "Host"
        }, {
          id: "+runner",
          title: "Runner",
          positionGroup: "+runnerGroup",
          maxNumber: 3,
          height: 2,
          requireTraining: "@runner"
        }, {
          id: "+mobileRunner",
          title: "Mobile Runner",
          positionGroup: "+runnerGroup",
          maxNumber: 2,
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
          id: "+mobileDrinks",
          title: "Mobile Drinks",
          maxNumber: 1,
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
          id: "+fcStocker",
          title: "Stocker",
          maxNumber: 2,
          width: 2,
          positionGroup: "+fcGroup",
          requireTraining: "@frontCounter"
        }, {
          id: "+mobileBagger",
          title: "Mobile Bagger",
          positionGroup: "+baggerGroup",
          maxNumber: 2,
          requireTraining: "@bagger"
        } ]
      }, {
        sectionTitle: "Lane 1",
        positions:  [ {
          id: "+lane1iPOSleader",
          maxNumber: 2,
          width: 1,
          requireTraining: "@iPOS",
          positionGroup: "+iposGroup",
          title: "iPOS 1 Leader"
        },{
          id: "+lane1iPOS",
          maxNumber: 3,
          width: 3,
          requireTraining: "@iPOS",
          positionGroup: "+iposGroup",
          title: "iPOS Lane 1"
        }, {
          id: "+cashCart",
          title: "Cash Cart",
          maxNumber: 3,
          height: 1,
          positionGroup: "+cashCartGroup",
          requireTraining: "@cashCart"
        }, {
          id: "+lane1expeditorsLeader",
          title: "Exp Leader",
          positionGroup: "+runnerGroup",
          width: 1,
          maxNumber: 2,
          requireTraining: "@runner",
          beginsRow: true
        }, {
          id: "+lane1expeditors",
          title: "Outside Expeditors",
          positionGroup: "+runnerGroup",
          width: 3,
          maxNumber: 6,
          requireTraining: "@runner",
          beginsRow: false
        }, {
          id: "+mobileCash",
          title: "Mobile Cash",
          width: 1,
          maxNumber: 2,
          positionGroup: "+cashCartGroup",
          requireTraining: "@cashCart"
        } ]
      }, {
        sectionTitle: "Lane 2",
        positions:  [ {
          id: "+lane2iPOSLeader",
          maxNumber: 2,
          width: 1,
          requireTraining: "@iPOS",
          positionGroup: "+iposGroup",
          title: "iPOS 2 Leader"
        }, {
          id: "+lane2iPOS",
          maxNumber: 3,
          width: 3,
          requireTraining: "@iPOS",
          positionGroup: "+iposGroup",
          title: "iPOS Lane 2"
        }, {
          id: "+cashCart",
          title: "Cash Cart",
          maxNumber: 3,
          height: 2,
          positionGroup: "+cashCartGroup",
          requireTraining: "@cashCart"
        }, {
          id: "+lane2expeditors",
          title: "Outside Expeditors",
          positionGroup: "+runnerGroup",
          width: 4,
          maxNumber: 4,
          requireTraining: "@runner",
          beginsRow: true
        } ]
      }, {
        sectionTitle: "Drive Thru",
        positions: [{
          id: "+dtLeader",
          beginsRow: true,
          maxNumber: 2,
          requireTraining: "@headset",
          title: "DT Leader"
        }, {
          id: "+dtBagger",
          maxNumber: 2,
          requireTraining: "@bagger",
          positionGroup: "+baggerGroup",
          title: "Chicken"
        }, {
          id: "+dtBagger2",
          maxNumber: 2,
          requireTraining: "@bagger",
          positionGroup: "+baggerGroup",
          title: "Waffles"
        }, {
          id: "+window",
          maxNumber: 2,
          requireTraining: "@window",
          positionGroup: "+windowGroup",
          title: "Window"
        }, {
          id: "+passer",
          maxNumber: 2,
          requireTraining: "@window",
          positionGroup: "+windowGroup",
          title: "Passer"
        }, {
          id: "+headset",
          maxNumber: 2,
          requireTraining: "@headset",
          positionGroup: "+headsetGroup",
          title: "Drinks 1",
          beginsRow: true
        }, {
          id: "+headset2",
          maxNumber: 2,
          requireTraining: "@headset",
          positionGroup: "+headsetGroup",
          title: "Drinks 2"
        }, {
          id: "+shakes",
          maxNumber: 2,
          requireTraining: "@shakes",
          title: "Shakes"
        }, {
          id: "+dtStocker",
          maxNumber: 4,
          width: 2,
          positionGroup: "+fcGroup",
          requireTraining: "@frontCounter",
          title: "Stocker"
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
    }, "lateNightDriveThru001": {
      maxColumns: 5,
      displayName: "Late Night Drive Thru",
      sections: [ {
        sectionTitle: "Leadership",
        positions: [ {
          id: "+shiftLeader",
          jobTitle: "Shift Leader",
          maxNumber: 2,
          requireRoles: ["shiftLeader"],
          title: "Shift Leader",
          beginsRow: true
        }, {
          id: "+teamLeader",
          jobTitle: "Team Leader",
          maxNumber: 3,
          requireRoles: ["teamLeader"],
          title: "Team Leader"
        } ]
      }, {
        sectionTitle: "Dining Room",
        positions: [ {
          id: "+diningRoom",
          width: 2,
          maxNumber: 4,
          requireTraining: "@diningRoom",
          positionGroup: "+drGroup",
          title: "Dining Room",
          beginsRow: true
        }, {
          id: "+host",
          maxNumber: 2,
          requireTraining: "@diningRoom",
          positionGroup: "+drGroup",
          jobTitle: "Dining Room Host",
          title: "Host"
        }, {
          id: "+fcStocker",
          title: "Stocker",
          maxNumber: 2,
          height: 2,
          positionGroup: "+fcGroup",
          requireTraining: "@frontCounter"
        }, {
          id: "+runner",
          title: "Runner",
          positionGroup: "+runnerGroup",
          maxNumber: 3,
          height: 2,
          requireTraining: "@runner"
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
          positionGroup: "+fcGroup",
          requireTraining: "@frontCounter"
        } ]
      }, {
        sectionTitle: "Lane 1",
        positions:  [ {
          id: "+lane1iPOS",
          maxNumber: 5,
          width: 4,
          requireTraining: "@iPOS",
          positionGroup: "+iposGroup",
          title: "iPOS Lane 1"
        }, {
          id: "+cashCart",
          title: "Cash Cart",
          maxNumber: 3,
          height: 1,
          positionGroup: "+cashCartGroup",
          requireTraining: "@cashCart"
        } ]
      }, {
        sectionTitle: "Drive Thru",
        positions: [{
          id: "+dtBagger",
          beginsRow: true,
          maxNumber: 2,
          requireTraining: "@bagger",
          title: "DT Bagger"
        }, {
          id: "+window",
          maxNumber: 2,
          requireTraining: "@window",
          positionGroup: "+windowGroup",
          title: "Window"
        }, {
          id: "+headset",
          maxNumber: 2,
          requireTraining: "@headset",
          positionGroup: "+headsetGroup",
          title: "Drinks",
        }, {
          id: "+shakes",
          maxNumber: 2,
          requireTraining: "@shakes",
          title: "Shakes"
        }, {
          id: "+dtStocker",
          maxNumber: 4,
          positionGroup: "+fcGroup",
          requireTraining: "@frontCounter",
          title: "Stocker"
        } ]
      } ]
    },
    "breakfastStructure001": {
      maxColumns: 3,
      displayName: "Breakfast Structure",
      sections: [ {
        sectionTitle: "Leadership",
        positions: [ {
          id: "+shiftLeader",
          jobTitle: "Shift Leader",
          maxNumber: 2,
          requireRoles: ["shiftLeader"],
          title: "Shift Leader",
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
          id: "+lemons",
          jobTitle: "Lemons",
          width: 1,
          maxNumber: 2,
          requireTraining: "@diningRoom",
          title: "Lemons"
        }, {
          beginsRow: true,
          id: "+fcBagger",
          maxNumber: 2,
          requireTraining: "@bagger",
          title: "FC Bagger"
        }, {
          id: "+floater",
          width: 2,
          maxNumber: 4,
          requireTraining: "@frontCounter",
          title: "Floater"
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
      }
    },
    lateSlow: {
      structureId: "lateNightDriveThru001",
      updates: {
        "+shiftLeader": {
          minNumber: 1,
        },
        "+fcBagger": {
          minNumber: 1,
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
