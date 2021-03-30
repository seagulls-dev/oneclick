import { LayoutGenerationConfig } from "../../../src/app/config/layout-generation-config.model";

export const FOHlayouts: LayoutGenerationConfig = {
  meta : [ {
    activeTimes: [ 6 ],
    templateId: "morning"
  }, {
    activeTimes: [ 19 ],
    templateId: "lateSlow"
  }, {
    activeTimes: [ 15 ],
    templateId: "midSlow"
  }, {
    activeTimes: [ 11 ],
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
          id: "+money",
          maxNumber: 2,
          requireTraining: "@diningRoom",
          title: "Money",
          width: 2,
          beginsRow: true
        } ]
      } ]
    },
    "driveThru009": {
      maxColumns: 4,
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
          id: "+areaLeader",
          maxNumber: 1,
          requireTraining: "@bagger",
          title: "Area Leader"
        } ]
      }, {
        sectionTitle: "Front Counter",
        positions: [ {
          id: "+fcBagger",
          title: "FC Bagger",
          positionGroup: "+baggerGroup",
          maxNumber: 2,
          width: 1,
          requireTraining: "@bagger"
        }, {
          id: "+runner",
          title: "Runner",
          maxNumber: 3,
          width: 1,
          positionGroup: "+fcGroup",
        } ]
      }, {
        sectionTitle: "Drive-Thru Cockpit",
        positions:  [ {
          id: "+dtBagger",
          maxNumber: 2,
          requireTraining: "@bagger",
          positionGroup: "+baggerGroup",
          title: "DT Bagger",
        }, {
          id: "+accuracyAce",
          title: "Accuracy Ace",
          width: 1,
          maxNumber: 2,
          positionGroup: "+runnerGroup",
          requireTraining: "@runner"
        }, {
          id: "+window",
          title: "Window",
          positionGroup: "+windowGroup",
          width: 1,
          maxNumber: 2,
          requireTraining: "@runner",
        }, {
          id: "+drinks",
          title: "Drinks",
          positionGroup: "+headsetGroup",
          width: 1,
          maxNumber: 3,
          requireTraining: "@headset"
        } ]
      }, {
        sectionTitle: "iPOS",
        positions: [ {
          id: "+orderTakers",
          maxNumber: 4,
          width: 3,
          requireTraining: "@iPOS",
          positionGroup: "+iposGroup",
          title: "Order Takers",
        }, {
          id: "+mobileCash",
          maxNumber: 3,
          requireTraining: "@cashCart",
          positionGroup: "+cashCartGroup",
          title: "Mobile Cash",
        } ]
      } ]
    },
    "driveThru008": {
      maxColumns: 4,
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
          id: "+areaLeader",
          maxNumber: 1,
          requireTraining: "@bagger",
          title: "Area Leader"
        } ]
      }, {
        sectionTitle: "Front Counter",
        positions: [ {
          id: "+fcBagger",
          title: "FC Bagger",
          positionGroup: "+baggerGroup",
          maxNumber: 2,
          width: 1,
          requireTraining: "@bagger"
        }, {
          id: "+precloser",
          title: "Pre-Closer",
          maxNumber: 2,
          width: 1,
          positionGroup: "+runnerGroup",
          requireTraining: "@runner"
        } ]
      }, {
        sectionTitle: "Drive-Thru Cockpit",
        positions:  [ {
          id: "+dtBagger",
          maxNumber: 3,
          width: 1,
          requireTraining: "@bagger",
          positionGroup: "+baggerGroup",
          title: "DT Bagger",
        },  {
          id: "+window",
          title: "Window",
          positionGroup: "+windowGroup",
          width: 1,
          maxNumber: 2,
          requireTraining: "@runner",
        }, {
          id: "+drinks",
          title: "Drinks",
          positionGroup: "+headsetGroup",
          width: 1,
          maxNumber: 3,
          requireTraining: "@headset"
        } ]
      }, {
        sectionTitle: "iPOS",
        positions: [ {
          id: "+orderTakers",
          maxNumber: 4,
          width: 2,
          requireTraining: "@iPOS",
          positionGroup: "+iposGroup",
          title: "Order Takers",
        }, {
          id: "+mobileCash",
          maxNumber: 2,
          requireTraining: "@cashCart",
          positionGroup: "+cashCartGroup",
          title: "Mobile Cash",
        } ]
      } ]
    },
    "driveThru007": {
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
          id: "+areaLeader",
          maxNumber: 1,
          requireTraining: "@bagger",
          title: "Area Leader"
        } ]
      }, {
        sectionTitle: "Front Counter",
        positions: [ {
          id: "+fcBagger",
          title: "FC Bagger",
          positionGroup: "+baggerGroup",
          maxNumber: 2,
          width: 2,
          requireTraining: "@bagger"
        }, {
          id: "+accuracyAce",
          title: "Accuracy Ace ",
          maxNumber: 2,
          width: 1,
          positionGroup: "+runnerGroup",
          requireTraining: "@runner"
        }, {
          id: "+mobileDrinks",
          title: "Mobile Drinks",
          maxNumber: 2,
          width: 1,
          requireTraining: "@bagger",
          positionGroup: "+baggerGroup",
        }, {
          id: "+runner",
          title: "Runner",
          maxNumber: 3,
          width: 1,
          positionGroup: "+fcGroup",
        } ]
      }, {
        sectionTitle: "Drive-Thru Cockpit",
        positions:  [ {
          id: "+dtBagger",
          maxNumber: 3,
          width: 2,
          requireTraining: "@bagger",
          positionGroup: "+baggerGroup",
          title: "DT Bagger",
        }, {
          id: "+accuracyAce",
          title: "Accuracy Ace",
          width: 1,
          maxNumber: 2,
          positionGroup: "+runnerGroup",
          requireTraining: "@runner"
        }, {
          id: "+window",
          title: "Window",
          positionGroup: "+windowGroup",
          width: 1,
          maxNumber: 2,
          requireTraining: "@runner",
        }, {
          id: "+drinks",
          title: "Drinks",
          positionGroup: "+headsetGroup",
          width: 1,
          height: 3,
          maxNumber: 3,
          requireTraining: "@headset"
        } ]
      }, {
        sectionTitle: "iPOS",
        positions: [ {
          id: "+orderTakers",
          maxNumber: 5,
          width: 2,
          height: 2,
          requireTraining: "@iPOS",
          positionGroup: "+iposGroup",
          title: "Order Takers",
        }, {
          id: "+outsideExpeditors",
          maxNumber: 4,
          width: 2,
          height: 2,
          requireTraining: "@runner",
          positionGroup: "+runnerGroup",
          title: "Outside Expeditors"
        }, {
          id: "+mobileCash",
          maxNumber: 3,
          height: 2,
          requireTraining: "@cashCart",
          positionGroup: "+cashCartGroup",
          title: "Mobile Cash",
        } ]
      } ]
    },
    "breakfastStructure004": {
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
          id: "+areaLeader",
          maxNumber: 1,
          requireTraining: "@bagger",
          title: "Area Leader"
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
          id: "+fcBagger",
          maxNumber: 2,
          width: 2,
          requireTraining: "@bagger",
          title: "FC Bagger"
        }, ]
      }, {
        sectionTitle: "Drive Thru",
        positions: [ {
          id: "+bagger",
          maxNumber: 2,
          requireTraining: "@bagger",
          title: "DT Bagger",
        }, {
          id: "+window",
          maxNumber: 2,
          requireTraining: "@window",
          title: "Window"
        }, {
          id: "+drinks",
          maxNumber: 2,
          requireTraining: "@headset",
          title: "Drinks"
        } ]
      }, {
        sectionTitle: "iPOS",
        positions: [ {
          id: "+orderTakers",
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
      structureId: "driveThru007",
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
    lateSlow: {
      structureId: "driveThru008",
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
        },
        "+drinks": {
          height: 1,
        }
    },
    },
    midSlow: {
      structureId: "driveThru009",
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
        },
        "+drinks": {
          height: 1,
        }
    },
    },
    morning: {
      structureId: "breakfastStructure004",
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
