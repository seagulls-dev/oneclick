import { ClientConfig } from './client-config.model';
import { TrainingConfig } from './training-config.model';
import { ServerConfig } from './server-config.model';
import { MooLaConfig } from './moola-config.model';

export interface Config {
  client?: ClientConfig;
  server?: ServerConfig;
  training?: TrainingConfig;
  moola?: MooLaConfig;
}
