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
      maxColumns: 4,
      displayName: "Drive Thru",
      sections: [ {
        sectionTitle: "Leadership",
        positions: [ {
          id: "+shiftLeader",
          jobTitle: "Shift Leader",
          maxNumber: 2,
          requireRoles: ["shiftLeader"],
          title: "Shift Leader",
          beginsRow: true
        } ]
      }, {
        sectionTitle: "Front Counter",
        positions: [ {
          id: "+mobileBagger",
          height: 2,
          maxNumber: 3,
          requireTraining: "@bagger",
          positionGroup: "+baggerGroup",
          title: "Mobile Bagger",
        }, {
          id: "+runner",
          maxNumber: 3,
          height: 2,
          requireTraining: "@runner",
          positionGroup: "+runnerGroup",
          title: "Runners"
        }, {
          id: "+mobileDrinks",
          title: "Mobile Drinks",
          positionGroup: "+headsetGroup",
          maxNumber: 2,
          requireTraining: "@headset"
        }, {
          id: "+rotations",
          title: "Rotations",
          positionGroup: "+runnerGroup",
          maxNumber: 5,
          height: 2,
          requireTraining: "@runner"
        }, {
          id: "+mobileExpo",
          title: "Mobile Expo",
          maxNumber: 2,
          requireTraining: "@runner",
          positionGroup: "+runnerGroup",
        } ]
      }, {
        sectionTitle: "Drive-Thru",
        positions:  [ {
          id: "+lane1iPOSleader",
          maxNumber: 2,
          width: 1,
          requireTraining: "@iPOS",
          positionGroup: "+iposGroup",
          title: "iPOS 1 Leader"
        },{
          id: "+iPOS",
          maxNumber: 4,
          width: 2,
          height: 2,
          requireTraining: "@iPOS",
          positionGroup: "+iposGroup",
          title: "iPOS"
        }, {
          id: "+expos",
          title: "Expos",
          maxNumber: 3,
          height: 2,
          positionGroup: "+runnerGroup",
          requireTraining: "@runner"
        }, {
          id: "+mobileCash",
          title: "Mobile Cash",
          positionGroup: "+cashCartGroup",
          width: 1,
          maxNumber: 2,
          requireTraining: "@cashCart",
          beginsRow: true
        } ]
      }, {
        sectionTitle: "Drive-Thru Cockpit",
        positions: [{
          id: "+baggers",
          beginsRow: true,
          maxNumber: 3,
          height: 2,
          requireTraining: "@bagger",
          positionGroup: "+baggerGroup",
          title: "Baggers"
        }, {
          id: "+drinks",
          maxNumber: 2,
          requireTraining: "@headset",
          positionGroup: "+headsetGroup",
          title: "Drinks"
        }, {
          id: "+window",
          maxNumber: 2,
          requireTraining: "@window",
          positionGroup: "+windowGroup",
          title: "Window"
        }, {
          id: "+desserts",
          maxNumber: 2,
          requireTraining: "@shakes",
          title: "Desserts"
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
          id: "+lemons",
          jobTitle: "Drinks",
          width: 1,
          maxNumber: 2,
          requireTraining: "@diningRoom",
          title: "Lemons"
        }, {
          beginsRow: true,
          id: "+mobileBagger",
          maxNumber: 2,
          requireTraining: "@bagger",
          title: "Mobile Bagger"
        }, {
          id: "+floater",
          width: 2,
          maxNumber: 4,
          requireTraining: "@frontCounter",
          title: "Floater"
        } ]
      }, {
        sectionTitle: "Drive-Thru",
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
          id: "+mobileCash",
          maxNumber: 2,
          requireTraining: "@cashCart",
          title: "Mobile Cash"
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
        "+mobileBagger": {
          minNumber: 1,
        },
        "+iPOS": {
          minNumber: 2,
        },
        "+expos": {
          minNumber: 2,
        },
        "+runners": {
          minNumber: 0,
        },
        "+cashCart": {
          minNumber: 1,
        },
        "+baggers": {
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
        "+baggers": {
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
