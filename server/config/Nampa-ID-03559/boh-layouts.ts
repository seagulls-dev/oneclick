import { LayoutGenerationConfig } from "../../../src/app/config/layout-generation-config.model";

export const BOHlayouts: LayoutGenerationConfig = {
  meta: [ {
    activeTimes: [ 6 ],
    templateId: "morning"
  }, {
    activeTimes: [ 10.75, 14 ],
    templateId: "slow"
  }, {
    activeTimes: [ 12, 17 ],
    templateId: "hardcoreplusfries"
  }, {
    activeTimes: [ 22 ],
    templateId: "closedclosed"
  }, {
    activeTimes: [ 19 ],
    templateId: "dinnerdishes"
  } ],
  structures: {
    "DoubleRowKitchen001": {
      displayName: "Main Setup",
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
          maxNumber: 2,
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
          width: 2,
          requireTraining: "@machines",
          title: "Machines"
        }, {
          id: "+floater",
          maxNumber: 4,
          requireTraining: "@secondary",
          title: "Floater"
        }, {
          id: "+prep",
          jobTitle: "Prep",
          maxNumber: 3,
          requireTraining: "@prep",
          title: "Prep"
        }, {
          id: "+breading",
          maxNumber: 2,
          width: 2,
          requireTraining: "@breading",
          title: "Breading",
          beginsRow: true
        }, {
          id: "+dishes",
          maxNumber: 2,
          title: "Dishes"
        }, {
          id: "+stocker",
          maxNumber: 2,
          title: "Stocker"
        } ],
        sectionTitle: "Back of Kitchen"
      } ]
    },
    "BreakfastLayoutStructure001": {
      displayName: "Breakfast Setup",
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
          maxNumber: 2,
          requireRoles: ["teamLeader"],
          title: "Team Leader"
        } ],
        sectionTitle: "Leadership"
      }, {
        positions: [ {
          id: "+hashbrowns",
          maxNumber: 2,
          requireTraining: "@fries",
          title: "Hashbrowns",
          width: 2,
          beginsRow: true
        }, {
          id: "+grill",
          maxNumber: 2,
          requireTraining: "@fries",
          title: "Grill",
          width: 2
        }, {
          id: "+biscuits",
          maxNumber: 2,
          requireTraining: "@primary",
          title: "Biscuits",
          width: 2,
          beginsRow: true
        }, {
          id: "+minisLunch",
          maxNumber: 2,
          requireTraining: "@secondary",
          title: "Minis/Lunch",
          width: 2
        }, {
          id: "+baglesMuffins",
          maxNumber: 2,
          requireTraining: "@primary",
          title: "Bagles/Muffins",
          width: 2,
          beginsRow: true
        }, {
          id: "+burritosFries",
          maxNumber: 2,
          requireTraining: "@secondary",
          title: "Burritos/Fries",
          width: 2
        } ],
        sectionTitle: "Front of Kitchen"
      }, {
        positions: [ {
          id: "+machines",
          maxNumber: 2,
          width: 2,
          requireTraining: "@machines",
          title: "Machines"
        }, {
          id: "+floater",
          maxNumber: 4,
          requireTraining: "@secondary",
          title: "Floater"
        }, {
          id: "+prep",
          jobTitle: "Prep",
          maxNumber: 3,
          requireTraining: "@prep",
          title: "Prep"
        }, {
          id: "+breading",
          maxNumber: 2,
          width: 2,
          requireTraining: "@breading",
          title: "Breading",
          beginsRow: true
        }, {
          id: "+dishes",
          maxNumber: 2,
          title: "Dishes"
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
    chillchill: {
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
    closedclosed: {
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
    dinnerdishes: {
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
    morning: {
      displayName: "Morning",
      structureId: "BreakfastLayoutStructure001",
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
