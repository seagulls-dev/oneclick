import { LayoutGenerationConfig } from "../../../src/app/config/layout-generation-config.model";

export const FOHlayouts: LayoutGenerationConfig = {
  meta : [ {
    activeTimes: [ 14, 19 ],
    templateId: "slow"
  }, {
    activeTimes: [ 6, 17 ],
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
        sectionTitle: "Lobby",
        positions: [ {
          id: "+lobby",
          maxNumber: 4,
          requireTraining: "@diningRoom",
          positionGroup: "+drGroup",
          title: "Close Lobby",
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
          id: "+driveThru",
          maxNumber: 2,
          requireTraining: "@frontCounter",
          title: "Close DT",
          width: 2,
          beginsRow: true
        }, {
          id: "+outside",
          maxNumber: 2,
          requireTraining: "@diningRoom",
          title: "Close Out",
          width: 2,
          beginsRow: true
        } ]
      } ]
    },
    "doubleDriveThroughStructure006": {
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
          maxNumber: 1,
          requireRoles: ["teamLeader"],
          title: "Team Leader"
        } ]
      }, {
        sectionTitle: "Front Counter",
        positions: [ {
          id: "+curbsideRunner",
          title: "Curbside Runner",
          positionGroup: "+runnerGroup",
          width: 3,
          height: 2,
          maxNumber: 7,
          requireTraining: "@runner"
        }, {
          id: "+backups",
          title: "Backups",
          positionGroup: "+baggerGroup",
          width: 2,
          maxNumber: 2,
          requireTraining: "@bagger"
        }, {
          id: "+curbsideCaptain",
          title: "Curbside Captain",
          maxNumber: 1,
          positionGroup: "+fcGroup",
          requireTraining: "@frontCounter",
          beginsRow: true
        }, {
          id: "+safetyCaptain",
          title: "Safety Captain",
          maxNumber: 1,
          positionGroup: "+fcGroup",
          requireTraining: "@frontCounter"
        }, {
          id: "+curbsideStage",
          title: "Curbside Stage ",
          maxNumber: 1,
          width: 1,
          requireTraining: "@runner",
          positionGroup: "+drGroup"
        }, {
          id: "+fcDrinks1",
          title: "FC Drinks 1",
          maxNumber: 1,
          requireTraining: "@frontCounter",
          positionGroup: "+fcGroup"
        }, {
          id: "+fcDrinks2",
          title: "FC Drinks 2",
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
          id: "+reliever",
          title: "Reliever",
          maxNumber: 3,
          width: 3,
          requireTraining: "@runner",
          positionGroup: "+drGroup"
        } ]
      }, {
        sectionTitle: "Drive-Thru",
        positions:  [ {
          id: "+outsideSequence",
          title: "Out Sequence",
          width: 1,
          maxNumber: 2,
          positionGroup: "+cashCartGroup",
          requireTraining: "@cashCart"
        }, {
          id: "+outsideOrderTaker",
          maxNumber: 4,
          width: 3,
          requireTraining: "@iPOS",
          positionGroup: "+iposGroup",
          title: "Outside Order Takers"
        }, {
          id: "+outsideCash",
          title: "Out Cash",
          maxNumber: 2,
          height: 2,
          positionGroup: "+cashCartGroup",
          requireTraining: "@cashCart"
        }, {
          id: "+outsideExpeditorsCaptain",
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
          requireTraining: "@runner"
        } ]
      }, {
        sectionTitle: "Drive-Thru Cockpit",
        positions: [ {
          id: "+icecream",
          maxNumber: 2,
          requireTraining: "@shakes",
          title: "Icecream"
        }, {
          id: "+headset1",
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
          id: "+headset",
          maxNumber: 2,
          height: 2,
          requireTraining: "@headset",
          positionGroup: "+headsetGroup",
          title: "Headset"
        }, {
          id: "+pacer",
          height: 2,
          maxNumber: 2,
          requireTraining: "@window",
          positionGroup: "+windowGroup",
          title: "Pacer"
        }, {
          id: "+dtBagger",
          maxNumber: 2,
          width: 2,
          requireTraining: "@bagger",
          positionGroup: "+baggerGroup",
          title: "DT Baggers"
        }, {
          id: "+window",
          maxNumber: 2,
          requireTraining: "@window",
          positionGroup: "+windowGroup",
          title: "Window"
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
      structureId: "doubleDriveThroughStructure006",
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
      structureId: "doubleDriveThroughStructure006",
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
  }
}
