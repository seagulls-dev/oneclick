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
          id: "+manager",
          maxNumber: 2,
          requireRoles: ["manager"],
          title: "Manager",
          width: 1
        },{
          id: "+teamLeader",
          jobTitle: "Team Leader",
          maxNumber: 1,
          requireRoles: ["teamLeader"],
          title: "Team Leader"
        } ]
      },  {
        sectionTitle: "Front Counter",
        positions: [ {
          id: "+closingLead",
          maxNumber: 4,
          requireTraining: "@frontCounter",
          positionGroup: "+fcGroup",
          title: "Close Lead",
          width: 2,
          beginsRow: true
        }, {
          id: "+frontCounter",
          maxNumber: 4,
          requireTraining: "@frontCounter",
          positionGroup: "+fcGroup",
          title: "Close FC",
          width: 2,
          beginsRow: true
        }, {
          id: "+shakes",
          maxNumber: 2,
          requireTraining: "@shakes",
          title: "Close Shakes",
          width: 2,
          beginsRow: true
        }, {
          id: "+trash",
          maxNumber: 2,
          requireTraining: "@diningRoom",
          title: "Close Trash",
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
      }, {
        sectionTitle: "Outside Drive-Thru",
        positions: [ {
          id: "+outsideDriveThru",
          maxNumber: 4,
          requireTraining: "@diningRoom",
          positionGroup: "+drGroup",
          title: "Close Outside Drive-Thru",
          width: 2
        } ]
      } ]
    },
    "driveThroughStructure002": {
      maxColumns: 5,
      displayName: "Drive Through",
      sections: [ {
        sectionTitle: "Leadership",
        positions: [ {
          id: "+seniorDirector",
          maxNumber: 3,
          requireRoles: ["director"],
          title: "Sr. Director",
          width: 2
        }, {
          id: "+manager",
          jobTitle: "Manager",
          maxNumber: 4,
          requireRoles: ["manager"],
          title: "Manager",
          width: 3
        } ]
      }, {
        sectionTitle: "Mobile",
        positions: [ {
          id: "+mobileLead",
          maxNumber: 4,
          requireRoles: ['teamLeader'],
          title: "Mobile Lead",
          beginsRow: true
        }, {
          id: "+mobileBagger",
          title: "Mobile Bagger",
          positionGroup: "+baggerGroup",
          maxNumber: 2,
          requireTraining: "@bagger"
        }, {
          id: "+stuffer",
          title: "Stuffer",
          maxNumber: 2,
          width: 2,
          positionGroup: "+fcGroup",
          requireTraining: "@frontCounter"
        }, {
          id: "+mobileDrinks",
          title: "Mobile Drinks",
          maxNumber: 3,
          height: 2,
          positionGroup: "+fcGroup",
          requireTraining: "@frontCounter"
        }, {
          id: "+mobileRunner",
          title: "Mobile Runner",
          positionGroup: "+runnerGroup",
          maxNumber: 6,
          width: 4,
          requireTraining: "@runner"
        } ]
      }, {
        sectionTitle: "Outside DT",
        positions:  [ {
          id: "+outsideLeader",
          maxNumber: 2,
          width: 1,
          requireRoles: ['teamLeader'],
          title: "Outside Lead"
        }, {
          id: "+outsideExpeditors",
          title: "Outside Expos",
          positionGroup: "+runnerGroup",
          width: 3,
          maxNumber: 6,
          requireTraining: "@runner",
        }, {
          id: "+trafficAttendant",
          title: "Traffic Attendant",
          positionGroup: "+runnerGroup",
          width: 1,
          maxNumber: 2,
          requireTraining: "@runner",
        }, {
          id: "+outsideOrderTakers",
          maxNumber: 6,
          width: 3,
          requireTraining: "@iPOS",
          positionGroup: "+iposGroup",
          title: "Outside Order-Takers"
        }, {
          id: "+payment",
          title: "Payment",
          maxNumber: 3,
          width: 2,
          positionGroup: "+cashCartGroup",
          requireTraining: "@cashCart"
        } ]
      }, {
        sectionTitle: "Inside DT",
        positions: [{
          id: "+dtLeader",
          beginsRow: true,
          width: 2,
          maxNumber: 3,
          requireRoles: ['teamLeader'],
          title: "DT Leads"
        },{
          id: "+drinks",
          maxNumber: 2,
          requireTraining: "@headset",
          positionGroup: "+headsetGroup",
          title: "Drinks",
        }, {
          id: "+desserts",
          maxNumber: 2,
          requireTraining: "@shakes",
          title: "Desserts"
        }, {
          id: "+stuffer",
          maxNumber: 2,
          height: 2,
          requireTraining: "@window",
          positionGroup: "+windowGroup",
          title: "Stuffer"
        }, {
          id: "+dtBagger",
          maxNumber: 2,
          requireTraining: "@bagger",
          positionGroup: "+baggerGroup",
          title: "Bagger 1"
        }, {
          id: "+dtBagger2",
          maxNumber: 2,
          requireTraining: "@bagger",
          positionGroup: "+baggerGroup",
          title: "Bagger 2"
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
        } ]
      } ]
    },
    "breakfastStructure001": {
      maxColumns: 3,
      displayName: "Breakfast Structure",
      sections: [ {
        sectionTitle: "Leadership",
        positions: [ {
          id: "+manager",
          jobTitle: "Manager",
          maxNumber: 2,
          requireRoles: ["manager"],
          title: "Manager",
          beginsRow: true
        }, {
          id: "+teamLeader",
          jobTitle: "Team Leader",
          maxNumber: 1,
          requireRoles: ["teamLeader"],
          title: "Team Leader"
        } ]
      }, {
        sectionTitle: "Breakfast",
        positions: [ {
          beginsRow: true,
          id: "+mobileBagger",
          maxNumber: 2,
          requireTraining: "@bagger",
          title: "Mobile Bagger"
        }, {
          id: "+dtBagger",
          maxNumber: 2,
          requireTraining: "@bagger",
          title: "DT Bagger",
        }, {
          id: "+window",
          maxNumber: 2,
          requireTraining: "@window",
          title: "Window"
        }, {
          id: "+stuffer",
          maxNumber: 4,
          requireTraining: "@frontCounter",
          title: "Stuffer"
        }, {
          id: "+drinks",
          maxNumber: 2,
          requireTraining: "@headset",
          title: "Drinks"
        }, {
          id: "+iPOS",
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
        "+manager": {
          minNumber: 1
        }
      }
    },
    busy: {
      structureId: "driveThroughStructure002",
      updates: {
        "+manager": {
          minNumber: 1,
        },
        "+mobileBagger": {
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
      structureId: "driveThroughStructure002",
      updates: {
        "+manager": {
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
