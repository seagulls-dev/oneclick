import { ContainedBusinessConfig } from '../config';

import { FOHConfig } from './foh-config';
import { BOHConfig } from './boh-config';
import { BusinessConfig } from './business-config';

const containedBusinessConfig: ContainedBusinessConfig = {
  skip: false,
  businessId: "hinesivilled8s7f9s7f",
  document: {
    configUpdated: new Date,
    info: {
      name: "CFA Hinesville - Hinesville, GA #03877",
      storeNumber: "03877",
      phoneNumber: "(912) 877-6631",
      address: "877 W Oglethorpe Hwy, Hinesville, GA 31313-4404"
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
    autoUpdate: true,
    useTraining: true,
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
