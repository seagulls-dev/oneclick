import { LayoutGenerationConfig } from "../../../src/app/config/layout-generation-config.model";

export const BOHlayouts: LayoutGenerationConfig = {
  meta: [ {
    activeTimes: [ 6 ],
    templateId: "morning"
  }, {
    activeTimes: [ 10, 14 ],
    templateId: "slow"
  }, {
    activeTimes: [ 12, 17 ],
    templateId: "hardcoreplusfries"
  }, {
    activeTimes: [ 22 ],
    templateId: "closed"
  }, {
    activeTimes: [ 19 ],
    templateId: "dinner"
  } ],
  structures: {
    "DoubleRowKitchen001": {
      displayName: "Double Row Kitchen",
      maxColumns: 4,
      sections: [ {
        positions: [ {
          id: "+shiftLeader",
          jobTitle: ["BOH - Open", "BOH - Close"],
          maxNumber: 2,
          requireRoles: ["shiftLeader"],
          title: "Shift Leader",
          beginsRow: true
        }, {
          id: "+teamLeader",
          jobTitle: "Team Leader",
          maxNumber: 4,
          requireRoles: ["teamLeader"],
          title: "Team Leader"
        } ],
        sectionTitle: "Leadership"
      }, {
        positions: [ {
          id: "+primaryFries",
          maxNumber: 2,
          requireTraining: "@fries",
          title: "Primary Fries",
          width: 2,
          beginsRow: true
        }, {
          id: "+secondaryFries",
          maxNumber: 2,
          requireTraining: "@fries",
          title: "Secondary Fries",
          width: 2
        }, {
          id: "+primary1",
          maxNumber: 2,
          requireTraining: "@primary",
          title: "Primary 1",
          width: 2,
          beginsRow: true
        }, {
          id: "+secondary1",
          maxNumber: 2,
          requireTraining: "@secondary",
          title: "Secondary 1",
          width: 2
        }, {
          id: "+primary2",
          maxNumber: 2,
          requireTraining: "@primary",
          title: "Primary 2",
          width: 2,
          beginsRow: true
        }, {
          id: "+secondary2",
          maxNumber: 2,
          requireTraining: "@secondary",
          title: "Secondary 2",
          width: 2
        } ],
        sectionTitle: "Front of Kitchen"
      }, {
        positions: [ {
          id: "+machines",
          maxNumber: 2,
          requireTraining: "@machines",
          title: "Machines"
        }, {
          id: "+floater",
          maxNumber: 4,
          requireTraining: "@secondary",
          title: "Floater",
          width: 2
        }, {
          id: "+prep",
          jobTitle: "Prep",
          maxNumber: 3,
          requireTraining: "@prep",
          title: "Prep"
        }, {
          id: "+breading",
          maxNumber: 2,
          requireTraining: "@breading",
          title: "Breading",
          beginsRow: true
        }, {
          id: "+dishes",
          maxNumber: 2,
          title: "Dishes",
          width: 2
        }, {
          id: "+stocker",
          maxNumber: 2,
          title: "Stocker"
        } ],
        sectionTitle: "Back of Kitchen"
      } ],
    }
  },
  templates: {
    chill: {
      displayName: "Totally Chill",
      structureId: "DoubleRowKitchen001",
      updates: {
        "+primary1": {
          minNumber: 1
        },
        "+primaryFries": {
          minNumber: 1
        }
      }
    },
    closed: {
      displayName: "That's All Folks!",
      structureId: "DoubleRowKitchen001",
      updates: {
        "+closer": {
          minNumber: 1
        },
        "+shiftLeader": {
          minNumber: 1
        }
      }
    },
    dinner: {
      displayName: "Late Night Dishes",
      structureId: "DoubleRowKitchen001",
      updates: {
        "+dishes": {
          minNumber: 1
        },
        "+primary1": {
          minNumber: 1
        },
        "+primaryFries": {
          minNumber: 1
        },
        "+secondary1": {
          minNumber: 1
        },
        "+shiftLeader": {
          minNumber: 1
        }
      }
    },
    hardcoreplusfries: {
      displayName: "Double Fries",
      structureId: "DoubleRowKitchen001",
      updates: {
        "+breading": {
          minNumber: 1
        },
        "+machines": {
          minNumber: 1
        },
        "+primary1": {
          minNumber: 1
        },
        "+primary2": {
          minNumber: 1
        },
        "+primaryFries": {
          minNumber: 1
        },
        "+secondary1": {
          minNumber: 1
        },
        "+secondary2": {
          minNumber: 1
        },
        "+secondaryFries": {
          minNumber: 1
        },
        "+shiftLeader": {
          minNumber: 1
        }
      }
    },
    morningPrep: {
      displayName: "Early Morning Prep",
      structureId: "DoubleRowKitchen001",
      updates: {
        "+prep": {
          minNumber: 1
        },
        "+primaryFries": {
          minNumber: 1
        }
      }
    },
    morning: {
      displayName: "Morning",
      structureId: "DoubleRowKitchen001",
      updates: {
        "+breader1": {
          minNumber: 1
        },
        "+primary1": {
          minNumber: 1
        },
        "+shiftLeader": {
          minNumber: 1
        }
      }
    },
    slow: {
      displayName: "Down Time",
      structureId: "DoubleRowKitchen001",
      updates: {
        "+breader1": {
          minNumber: 1
        },
        "+primary1": {
          minNumber: 1
        },
        "+secondary1": {
          minNumber: 1
        },
        "+shiftLeader": {
          minNumber: 1
        }
      }
    }
  }
}
