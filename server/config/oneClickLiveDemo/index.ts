import { ContainedBusinessConfig } from '../config';

import { FOHConfig } from './foh-config';
import { BOHConfig } from './boh-config';
import { BusinessConfig } from './business-config';

const containedBusinessConfig: ContainedBusinessConfig = {
  skip: false,
  businessId: "oneClickLiveDemo",
  document: {
    configUpdated: new Date,
    info: {
      name: "Demo Store",
      storeNumber: "02789",
      address: "3003 S 25th E, Ammon, ID 83406"
    },
    destinationInfo: [
      {
        abbreviation: "FOH",
        icon: "cash-register",
        id: "frontOfHouse",
        name: "Front of House"
      },
      {
        abbreviation: "BOH",
        icon: "utensils",
        id: "backOfHouse",
        name: "Back of House"
      }
    ],

    // Permissions!
    // Dates represent when the permission expires
    autoUpdate: true,
    processGroupMe: false,
    useAdvancedFeatures: true, // must be true to edit shifts
    useTraining: true,
    useMooLa: true,
  },

  destinations: {
    "frontOfHouse": {
      config: FOHConfig,
      document: {
        name: "Front of House"
      }
    },
    "backOfHouse": {
      config: BOHConfig,
      document: {
        name: "Back of House",
      }
    }
  },
  config: BusinessConfig,
}

export default containedBusinessConfig;
