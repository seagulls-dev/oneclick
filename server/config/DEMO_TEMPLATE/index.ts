import { ContainedBusinessConfig } from '../config';

import { FOHConfig } from './foh-config';
import { BOHConfig } from './boh-config';
import { BusinessConfig } from './business-config';

const containedBusinessConfig: ContainedBusinessConfig = {
  skip: false,
  businessId: "##BUSINESS_ID##",
  document: {
    configUpdated: new Date,
    info: {
      name: "##BUSINESS_NAME##",
      storeNumber: "##BUSINESS_STORE_NUMBER##",
      phoneNumber: "##BUSINESS_PHONE_NUMBER##",
      address: "##BUSINESS_ADDRESS##"
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
    // Dates represent when the permission expires and are in UTC time when run in cloud9 server.
    // Use e.g. "2020-08-20T23:59:59-06:00" to expire the permission just before midnight MDT on Aug 20
    autoUpdate: ##FREE_TRIAL_30_DAYS##,
    useTraining: ##FREE_TRIAL_30_DAYS##,
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
