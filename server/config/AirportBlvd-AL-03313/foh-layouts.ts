import { LayoutGenerationConfig } from "../../../src/app/config/layout-generation-config.model";

export const FOHlayouts: LayoutGenerationConfig = {
  meta : [  {
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
          id: "+money",
          maxNumber: 2,
          requireTraining: "@diningRoom",
          title: "Money",
          width: 2,
          beginsRow: true
        } ]
      } ]
    },
    "drivethru005": {
      maxColumns: 5,
      displayName: 'FOH Lineup',
      sections: [  {
        sectionTitle: "Leadership",
        positions: [ {
          id: "+directorsSupervisors",
          maxNumber: 8,
          width: 2,
          title: "Directors/Supervisors",
        } ]
      }, {
        sectionTitle: "FOH Setup",
        positions: [ {
          id: "+cashCart",
          maxNumber: 2,
          requireTraining: "@cashCart",
          positionGroup: "+cashCartGroup",
          title: "Cash Cart",
          beginsRow: true
        }, {
          id: "+orderTakers",
          maxNumber: 4,
          width: 4,
          requireTraining: "@iPOS",
          positionGroup: "+iPOS",
          title: "Order Takers"
        }, {
          id: "+outsideExpo",
          title: "Outside Expo",
          height: 3,
          positionGroup: "+runnerGroup",
          maxNumber: 4,
          requireTraining: "@runner",
          beginsRow: true
        }, {
          id: "+drinks",
          title: "Drinks",
          maxNumber: 2,
          width: 2,
          positionGroup: "+headsetGroup",
          requireTraining: "@headset"
        },  {
          id: "+desserts",
          title: "Desserts",
          maxNumber: 2,
          requireTraining: "@shakes",
        }, {
          id: "+stocker",
          title: "Stocker",
          maxNumber: 2,
          positionGroup: "+fcGroup",
          requireTraining: "@frontCounter"
        }, {
          id: "+window",
          title: "Window",
          maxNumber: 2,
          positionGroup: "+windowGroup",
          requireTraining: "@window",
        }, {
          id: "+stufffer",
          title: "Stuffer",
          maxNumber: 2,
          positionGroup: "+fcGroup",
          requireTraining: "@frontCounter"
        }, {
          id: "+dtBagger",
          title: "DT Bagger",
          maxNumber: 2,
          width: 2,
          requireTraining: "@bagger",
          positionGroup: "+baggerGroup"
        }, {
          id: "+mobileBagger",
          title: "Mobile Bagger",
          positionGroup: "+baggerGroup",
          maxNumber: 2,
          requireTraining: "@bagger",
        }, {
          id: "+mobileDrinks",
          title: "Mobile Drinks",
          maxNumber: 2,
          positionGroup: "+fcGroup",
          requireTraining: "@frontCounter"
        }, {
          id: "+runners",
          title: "Runners",
          maxNumber: 3,
          width: 2,
          positionGroup: "+runnerGroup",
          requireTraining: "@Runner"
        }  ]
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
      structureId: "drivethru005",
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
      structureId: "drivethru005",
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
    }
  }
}
