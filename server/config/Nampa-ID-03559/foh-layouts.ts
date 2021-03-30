import { LayoutGenerationConfig } from "../../../src/app/config/layout-generation-config.model";

export const FOHlayouts: LayoutGenerationConfig = {
  meta : [ {
    activeTimes: [ 6 ],
    templateId: "morning"
  }, {
    activeTimes: [ 10, 14, 19 ],
    templateId: "slow"
  }, {
    activeTimes: [ 11, 17 ],
    templateId: "busy"
  }, {
    activeTimes: [ 22 ],
    templateId: "closed"
  } ],
  structures : {
    "3dZ9Iv3gBg7b2o8Q1oYv": {
      maxColumns: 2,
      displayName: "Front Counter Closing",
      sections: [ {
        positions: [ {
          id: "+shiftLeader",
          jobTitle: ["Shift Leader", "FOH - Open", "FOH - Close"],
          maxNumber: 2,
          requireRoles: ["shiftLeader"],
          title: "Shift Leader",
          width: 1
        } ],
        sectionTitle: "Leadership"
      }, {
        positions: [ {
          id: "+diningRoom",
          maxNumber: 4,
          requireTraining: "@diningRoom",
          title: "Close DR",
          width: 2
        } ],
        sectionTitle: "Dining Room"
      }, {
        positions: [ {
          id: "+frontCounter",
          maxNumber: 4,
          requireTraining: "@frontCounter",
          title: "Close FC",
          width: 2
        }, {
          id: "+shakes",
          maxNumber: 2,
          requireTraining: "@window",
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
        }, {
          id: "+floors",
          jobTitle: "Cleaning",
          maxNumber: 2,
          requireTraining: "@diningRoom",
          title: "Clean Floors",
          width: 2,
          beginsRow: true
        } ],
        sectionTitle: "Front Counter"
      } ]
    },
    "drivethru001": {
      maxColumns: 4,
      displayName: "Drive Through",
      sections: [ {
        positions: [ {
          id: "+shiftLeader",
          jobTitle: ["Shift Leader", "FOH - Open", "FOH - Close"],
          maxNumber: 2,
          requireRoles: ["shiftLeader"],
          title: "Shift Leader",
          beginsRow: true
        }, {
          id: "+teamLeader",
          jobTitle: ["Team Leader", "FOH - Open", "FOH - Close"],
          maxNumber: 1,
          requireRoles: ["teamLeader"],
          title: "Team Leader"
        } ],
        sectionTitle: "Leadership"
      }, {
        positions: [ {
          id: "+host",
          jobTitle: "Dining Room Host",
          width: 2,
          maxNumber: 4,
          requireTraining: "@diningRoom",
          title: "Host"
        }, {
          id: "+diningRoom",
          width: 2,
          maxNumber: 4,
          requireTraining: "@diningRoom",
          title: "Dining Room"
        }, {
          id: "+register1",
          title: "Register 1",
          jobTitle: "Cashier",
          maxNumber: 1,
          requireTraining: "@frontCounter",
          beginsRow: true
        }, {
          id: "+register2",
          title: "Register 2",
          jobTitle: "Cashier",
          maxNumber: 1,
          requireTraining: "@frontCounter"
        }, {
          id: "+register3",
          title: "Register 3",
          jobTitle: "Cashier",
          maxNumber: 1,
          requireTraining: "@frontCounter"
        }, {
          id: "+runner",
          title: "Runner",
          jobTitle: ["Runner", "Server"],
          height: 2,
          maxNumber: 3,
          requireTraining: "@runner"
        }, {
          id: "+fcBagger",
          title: "FC Bagger",
          jobTitle: "Bagger",
          maxNumber: 2,
          requireTraining: "@bagger",
          beginsRow: true
        }, {
          id: "+fcStocker",
          title: "Stocker",
          maxNumber: 2,
          width: 2,
          requireTraining: "@frontCounter"
        } ],
        sectionTitle: "Dining Room"
      }, {
        positions: [{
          id: "+dtBagger",
          jobTitle: "Bagger",
          maxNumber: 2,
          requireTraining: "@bagger",
          title: "Chicken"
        }, {
          id: "+dtBagger2",
          jobTitle: "Bagger",
          maxNumber: 2,
          requireTraining: "@bagger",
          title: "Waffles"
        }, {
          id: "+stuffer",
          maxNumber: 2,
          requireTraining: "@window",
          title: "Stuffer"
        }, {
          id: "+window",
          jobTitle: "Drive Thru",
          maxNumber: 2,
          requireTraining: "@window",
          title: "Window"
        }, {
          id: "+drinks1",
          jobTitle: "Drinks",
          maxNumber: 2,
          requireTraining: "@headset",
          title: "Drinks 1",
          beginsRow: true
        }, {
          id: "+drinks2",
          jobTitle: "Drinks",
          maxNumber: 2,
          requireTraining: "@headset",
          title: "Drinks 2"
        }, {
          id: "+shakes",
          maxNumber: 2,
          requireTraining: "@shakes",
          title: "Shakes"
        }, {
          id: "+dtStocker",
          maxNumber: 2,
          requireTraining: "@frontCounter",
          title: "Stocker"
        } ],
        sectionTitle: "DT Cockpit"
      }, {
        positions:  [ {
          id: "+iPOS",
          jobTitle: "Drive Thru Order Taker",
          width: 4,
          maxNumber: 8,
          requireTraining: "@iPOS",
          title: "iPOS"
        }, {
          id: "+expeditor",
          jobTitle: "Expediter",
          title: "Outside Expeditor",
          width: 4,
          maxNumber: 8,
          requireTraining: "@runner",
          beginsRow: true
        }, {
          id: "+cashCart",
          jobTitle: "Drive Thru Cashier",
          title: "Cash Cart",
          maxNumber: 2,
          requireTraining: "@cashCart"
        }, {
          id: "+mobileCash",
          title: "Mobile Cash",
          jobTitle: "Drive Thru Cashier",
          maxNumber: 1,
          requireTraining: "@cashCart"
        }, {
          id: "+lemons",
          jobTitle: "Lemons",
          width: 1,
          maxNumber: 2,
          requireTraining: "@diningRoom",
          title: "Lemons"
        } ],
        sectionTitle: "DT Outside"
      } ]
    }
  },
  templates : {
    closed: {
      displayName: "That's All Folks!",
      structureId: "3dZ9Iv3gBg7b2o8Q1oYv",
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
      structureId: "drivethru001",
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
    slow: {
      structureId: "drivethru001",
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
    },
    },
    morning: {
      structureId: "drivethru001",
      updates: {
        "+headset": {
          minNumber: 1,
        },
      }
    },
  }
}
