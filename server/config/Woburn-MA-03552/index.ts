import { ContainedBusinessConfig } from '../config';

import { FOHConfig } from './foh-config';
import { BOHConfig } from './boh-config';
import { BusinessConfig } from './business-config';

const containedBusinessConfig: ContainedBusinessConfig = {
  skip: false,
  businessId: "woburn31654d61d6",
  document: {
    configUpdated: new Date,
    info: {
      name: "CFA Woburn, MA #01801",
      storeNumber: "03552",
      address: "375 Washington St, Woburn, MA 01801"
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
    autoUpdate: new Date("2020-09-17T23:59:59-06:00"),
    useTraining: new Date("2020-09-17T23:59:59-06:00"),
    useAdvancedFeatures: true, // must be true to edit shifts
    processGroupMe: false,
    useMooLa: false,
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
