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
    templateId: "closed"
  }, {
    activeTimes: [ 19 ],
    templateId: "dinner"
  } ],
  structures: {
    "DoubleRowKitchen002": {
      displayName: "Double Row Kitchen",
      maxColumns: 4,
      sections: [ {
        positions: [ {
          id: "+leader",
          jobTitle: ["BOH - Open", "BOH - Close"],
          maxNumber: 2,
          title: "Leader",
          beginsRow: true
        } ],
        sectionTitle: "Leadership"
      }, {
        positions: [ {
          id: "+primaryFries",
          maxNumber: 2,
          requireTraining: "@fries",
          title: "Fries",
          beginsRow: true
        }, {
          id: "+specials",
          maxNumber: 2,
          requireTraining: "@primary",
          title: "Specials",
        }, {
          id: "+grills",
          maxNumber: 2,
          requireTraining: "@fries",
          title: "Grills",
        }, {
          id: "+secondaryFries",
          maxNumber: 2,
          requireTraining: "@fries",
          title: "Fries",
        }, {
          id: "+specialsRegulars",
          maxNumber: 2,
          width: 2,
          requireTraining: "@primary",
          title: "Specials/Regulars",
          beginsRow: true
        }, {
          id: "+nuggets",
          maxNumber: 2,
          width: 2,
          requireTraining: "@secondary",
          title: "Nuggets",
        }, {
          id: "+bunsRegulars",
          maxNumber: 2,
          width: 2,
          requireTraining: "@primary",
          title: "Buns/Regulars",
          beginsRow: true
        }, {
          id: "+bunsNuggets",
          maxNumber: 2,
          width: 2,
          requireTraining: "@secondary",
          title: "Buns/Nuggets",
        } ],
        sectionTitle: "Front of Kitchen"
      }, {
        positions: [ {
          id: "+machines",
          maxNumber: 2,
          requireTraining: "@machines",
          title: "Machines"
        }, {
          id: "+utility",
          maxNumber: 4,
          requireTraining: "@secondary",
          title: "Utility",
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
          width: 2,
          requireTraining: "@breading",
          title: "Breading",
          beginsRow: true
        }, {
          id: "+dishes",
          maxNumber: 2,
          title: "Dishes",
          width: 2
        } ],
        sectionTitle: "Back of Kitchen"
      } ],
    },
    "BreakfastKitchen002": {
      displayName: "Breakfast Kitchen",
      maxColumns: 4,
      sections: [ {
        positions: [ {
          id: "+leader",
          jobTitle: ["BOH - Open", "BOH - Close"],
          maxNumber: 4,
          title: "Leader",
          beginsRow: true
        }, ],
        sectionTitle: "Leadership"
      }, {
        positions: [ {
          id: "+hashbrowns",
          maxNumber: 2,
          requireTraining: "@fries",
          title: "Hashbrowns",
          width: 1,
          beginsRow: true
        }, {
          id: "+specials",
          maxNumber: 2,
          requireTraining: "@primary",
          title: "Specials",
        }, {
          id: "+burritos",
          maxNumber: 2,
          requireTraining: "@primary",
          title: "Burritos",
        }, {
          id: "+hashbrownsGrill",
          maxNumber: 2,
          requireTraining: "@fries",
          title: "Hashbrowns/Grill",
        }, {
          id: "+specReg",
          maxNumber: 2,
          width: 2,
          requireTraining: "@primary",
          title: "Specials/Reg",
          beginsRow: true
        }, {
          id: "+minis",
          maxNumber: 4,
          width: 2,
          requireTraining: "@secondary",
          title: "Minis",
        }, {
          id: "+biscuitCutter",
          maxNumber: 2,
          width: 2,
          requireTraining: "@primary",
          title: "Biscuit Cutter",
          beginsRow: true
        }, {
          id: "+biscuits",
          maxNumber: 2,
          width: 2,
          requireTraining: "@primary",
          title: "Biscuits",
        } ],
        sectionTitle: "Front of Kitchen"
      }, {
        positions: [ {
          id: "+machines",
          maxNumber: 2,
          requireTraining: "@machines",
          title: "Machines"
        }, {
          id: "+utility",
          maxNumber: 4,
          requireTraining: "@secondary",
          title: "Utility",
          width: 2
        }, {
          id: "+prep",
          jobTitle: "Prep",
          maxNumber: 3,
          requireTraining: "@prep",
          title: "Prep"
        }, {
          id: "+breading",
          maxNumber: 3,
          width: 2,
          requireTraining: "@breading",
          title: "Breading",
          beginsRow: true
        }, {
          id: "+dishes",
          maxNumber: 2,
          title: "Dishes",
          width: 2
        } ],
        sectionTitle: "Back of Kitchen"
      } ],
    }
  },
  templates: {
    chill: {
      displayName: "Totally Chill",
      structureId: "DoubleRowKitchen002",
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
      structureId: "DoubleRowKitchen002",
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
      structureId: "DoubleRowKitchen002",
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
      structureId: "DoubleRowKitchen002",
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
      structureId: "DoubleRowKitchen002",
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
      structureId: "BreakfastKitchen002",
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
      structureId: "DoubleRowKitchen002",
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
