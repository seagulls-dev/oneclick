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
          id: "+iceream",
          maxNumber: 2,
          requireTraining: "@shakes",
          title: "Close Icecream",
          width: 2,
          beginsRow: true
        } ]
      } ]
    },
    "driveThroughStructure": {
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
          id: "+breaker",
          jobTitle: "breaker",
          maxNumber: 1,
          title: "Breaker"
        } ]
      }, {
        sectionTitle: "Front Counter",
        positions: [ {
          id: "+bagger",
          maxNumber: 3,
          width: 2,
          requireTraining: "@bagger",
          positionGroup: "+baggerGroup",
          title: "Mobile Bagger",
          beginsRow: true
        }, {
          id: "+register",
          maxNumber: 2,
          requireTraining: "@frontCounter",
          positionGroup: "+fcGroup",
          title: "Register"
        }, {
          id: "+mobileExpo",
          title: "Mobile Expo",
          positionGroup: "+runnerGroup",
          maxNumber: 3,
          requireTraining: "@runner"
        }, {
          id: "+fcStocker",
          title: "Stocker",
          maxNumber: 2,
          positionGroup: "+fcGroup",
          requireTraining: "@frontCounter"
        } ]
      }, {
        sectionTitle: "Drive-Thru",
        positions:  [ {
          id: "+lane1iPOSleader",
          maxNumber: 2,
          width: 1,
          requireTraining: "@iPOS",
          positionGroup: "+iposGroup",
          title: "iPOS Leader"
        },{
          id: "+lane1iPOS",
          maxNumber: 4,
          width: 3,
          requireTraining: "@iPOS",
          positionGroup: "+iposGroup",
          title: "iPOS"
        }, {
          id: "+mobileCash",
          title: "Mobile Cash",
          maxNumber: 3,
          height: 2,
          positionGroup: "+cashCartGroup",
          requireTraining: "@cashCart"
        }, {
          id: "+trafficDirector",
          title: "Traffic Director",
          positionGroup: "+runnerGroup",
          width: 1,
          maxNumber: 2,
          requireTraining: "@runner",
          beginsRow: true
        }, {
          id: "+outsideExpeditors",
          title: "Outside Expeditors",
          positionGroup: "+runnerGroup",
          width: 3,
          maxNumber: 6,
          requireTraining: "@runner",
        } ]
      }, {
        sectionTitle: "Drive Thru",
        positions: [ {
          id: "+dtBagger",
          maxNumber: 4,
          width: 2,
          height: 2,
          requireTraining: "@bagger",
          positionGroup: "+baggerGroup",
          title: "Bagger",
          beginsRow: true
        }, {
          id: "+drinks",
          maxNumber: 2,
          requireTraining: "@headset",
          title: "Drinks"
        }, {
          id: "+icecream",
          maxNumber: 2,
          requireTraining: "@shakes",
          title: "Icecream"
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
        }, {
          id: "+rotateSet6",
          height: 2,
          maxNumber: 3,
          title: "Set 6"
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
          id: "+breaker",
          jobTitle: "breaker",
          maxNumber: 1,
          title: "Breaker"
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
          jobTitle: "Drinks",
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
      structureId: "driveThroughStructure",
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
      structureId: "driveThroughStructure",
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
