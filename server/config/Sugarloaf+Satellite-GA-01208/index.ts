import { ContainedBusinessConfig } from '../config';

import { FOHConfig } from './foh-config';
import { BOHConfig } from './boh-config';
import { BusinessConfig } from './business-config';

const containedBusinessConfig: ContainedBusinessConfig = {
  skip: false,
  businessId: "sugarloafdf156d51d65f",
  document: {
    configUpdated: new Date,
    info: {
      name: "CFA Sugarloaf & Satellite - Duluth, GA #01208",
      storeNumber: "01208",
      address: "2020 Satellite Blvd, Duluth, GA 30097"
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
    autoUpdate: new Date("2020-08-31T23:59:59-06:00"),
    useTraining: new Date("2020-08-31T23:59:59-06:00"),
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
