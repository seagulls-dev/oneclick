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
          title: "Close DR"
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
        }, {
          id: "+driveThru",
          maxNumber: 2,
          requireTraining: "@frontCounter",
          title: "Close DT",
          width:2,
          height: 2,
        } ]
      } ]
    },
    "driveThru005": {
      maxColumns: 6,
      displayName: "Drive-Thru",
      sections: [ {
        sectionTitle: "Leadership",
        positions: [ {
          id: "+shiftLeader",
          jobTitle: "Shift Leader",
          maxNumber: 4,
          requireRoles: ["shiftLeader"],
          title: "Shift Leader"
        },{
          id: "+huddleLeader",
          maxNumber: 4,
          title: "Huddle Leader"
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
          width: 2,
          maxNumber: 2,
          requireTraining: "@diningRoom",
          positionGroup: "+drGroup",
          title: "Host"
        }, {
          id: "+runner",
          title: "Runner",
          positionGroup: "+runnerGroup",
          maxNumber: 3,
          width: 2,
          requireTraining: "@runner"
        }, {
          id: "+register1",
          title: "Register 1",
          maxNumber: 2,
          requireTraining: "@frontCounter",
          positionGroup: "+fcGroup",
          beginsRow: true
        }, {
          id: "+register2",
          title: "Register 2",
          maxNumber: 2,
          positionGroup: "+fcGroup",
          requireTraining: "@frontCounter"
        }, {
          id: "+register3",
          title: "Register 3",
          maxNumber: 2,
          positionGroup: "+fcGroup",
          requireTraining: "@frontCounter"
        },   {
          id: "+fcBagger",
          title: "FC Bagger",
          maxNumber: 2,
          height: 2,
          requireTraining: "@bagger",
          positionGroup: "+baggerGroup"
        }, {
          id: "+mobileBagger",
          title: "Mobile Bagger",
          positionGroup: "+baggerGroup",
          maxNumber: 2,
          height: 2,
          requireTraining: "@bagger"
        }, {
          id: "+fcStocker",
          title: "Stocker",
          maxNumber: 2,
          height: 2,
          positionGroup: "+fcGroup",
          requireTraining: "@frontCounter"
        }, {
          id: "+register4",
          title: "Register 4",
          maxNumber: 2,
          positionGroup: "+fcGroup",
          requireTraining: "@frontCounter",
          beginsRow: true
        },{
          id: "+register5",
          title: "Register 5",
          maxNumber: 2,
          positionGroup: "+fcGroup",
          requireTraining: "@frontCounter"
        },{
          id: "+register6",
          title: "Register 6",
          maxNumber: 2,
          positionGroup: "+fcGroup",
          requireTraining: "@frontCounter"
        } ]
      }, {
        sectionTitle: "Drive-Thru",
        positions:  [ {
          id: "+iPOSPink",
          maxNumber: 2,
          width: 1,
          requireTraining: "@iPOS",
          positionGroup: "+iposGroup",
          title: "iPOS 1 Pink"
        }, {
          id: "+iPOSRed",
          maxNumber: 2,
          width: 1,
          requireTraining: "@iPOS",
          positionGroup: "+iposGroup",
          title: "iPOS 1 Red"
        }, {
          id: "+iPOSOrange",
          maxNumber: 2,
          width: 1,
          requireTraining: "@iPOS",
          positionGroup: "+iposGroup",
          title: "iPOS 1 Orange"
        }, {
          id: "+iPOSTeal",
          maxNumber: 2,
          width: 1,
          requireTraining: "@iPOS",
          positionGroup: "+iposGroup",
          title: "iPOS 2 Teal"
        }, {
          id: "+iPOSGreen",
          maxNumber: 2,
          width: 1,
          requireTraining: "@iPOS",
          positionGroup: "+iposGroup",
          title: "iPOS 2 Green"
        }, {
          id: "+iPOSBlack",
          maxNumber: 2,
          width: 1,
          requireTraining: "@iPOS",
          positionGroup: "+iposGroup",
          title: "iPOS 2 Black"
        }, {
          id: "+purplePayment",
          title: "Purple Payment",
          maxNumber: 2,
          positionGroup: "+cashCartGroup",
          requireTraining: "@cashCart",
          beginsRow: true
        }, {
          id: "+outsideRunners",
          title: "Outside Runners",
          positionGroup: "+runnerGroup",
          width: 3,
          maxNumber: 6,
          requireTraining: "@runner"
        }, {
          id: "+bluePayment",
          title: "Blue Payment",
          maxNumber: 2,
          positionGroup: "+cashCartGroup",
          requireTraining: "@cashCart"
        }, {
          id: "+outsideWindow",
          title: "Outside Window",
          width: 1,
          maxNumber: 2,
          positionGroup: "+windowGroup",
          requireTraining: "@window"
        } ]
      }, {
        sectionTitle: "Drive-Thru Cockpit",
        positions: [{
          id: "+sauceBoss",
          beginsRow: true,
          maxNumber: 2,
          requireTraining: "@runner",
          title: "Sauce Boss"
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
          title: "Drinks 1"
        }, {
          id: "+headset2",
          maxNumber: 2,
          requireTraining: "@headset",
          positionGroup: "+headsetGroup",
          title: "Drinks 2"
        }, {
          id: "+desserts",
          maxNumber: 2,
          requireTraining: "@shakes",
          title: "Desserts"
        }, {
          id: "+old",
          width: 1,
          height: 2,
          maxNumber: 2,
          requireTraining: "@runner",
          positionGroup: "+drGroup",
          title: "OLD Driver"
        }, {
          id: "+dtBagger",
          width: 2,
          maxNumber: 2,
          requireTraining: "@bagger",
          positionGroup: "+baggerGroup",
          title: "DT Baggers",
          beginsRow: true
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
          title: "Set 5",
        }, {
          id: "+rotateSet6",
          height: 2,
          maxNumber: 3,
          title: "Set 6"
        } ]
      } ]
    },
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
      structureId: "driveThru005",
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
      structureId: "driveThru005",
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
      structureId: "driveThru005",
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
