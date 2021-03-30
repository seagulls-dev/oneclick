import { DbUser } from './db-user.model';
import { DbBusiness } from './db-business.model';
import { ServerTask } from './server-task.model';
import { PendingAccount } from './pending-account.model';

export interface Database {
  environments: {
    "DEV"?: Environment;
    "PROD"?: Environment;
  };
}
export interface Environment {
  businesses: Collection<DbBusiness>;
  serverQueue: Collection<ServerTask>;
  pendingAccounts: Collection<PendingAccount<any>>;
  users: Collection<DbUser>;
}

export type Collection<T> = {
  [id: string]: T;
}