import { Config } from "../../src/app/config/config.model";
import { InputBusiness } from "../../database/db-business.model";

import { Destination } from "../../src/app/services/destination.model";

export type AllConfig = {
  [businessId: string]: ContainedBusinessConfig
}
export interface ContainedBusinessConfig {
  destinations: {
    [destinationId: string]: {
      config: Config;
      document: Partial<Destination>;
    };
  };

  config: Config;
  document: InputBusiness;

  skip?: boolean;

  businessId: string;
}
