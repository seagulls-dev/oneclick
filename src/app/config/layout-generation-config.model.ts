import { Section } from '../organize-shifts/layout.model';

export interface LayoutGenerationConfig {
  structures: {
    // default: LayoutStructure;
    [structureId: string]: LayoutStructure;
  };
  templates: { [templateId: string]: LayoutTemplate };
  meta: LayoutMeta[];
}

export interface LayoutStructure {
  displayName?: string;
  maxColumns: number;
  sections: Section[];
}
export interface LayoutTemplate {
  structureId: string; // This is required

  displayName?: string;
  updates: {
    [positionId: string]: {
      [property: string]: any;
      // override properties on any position
      // used to set min/max numbers etc...
    }
  }
}
export interface LayoutMeta {
  activeTimes: number[]; // see note on client.suggestedLayoutTimes
  templateId: string;
}

// refers to a trained position (Front Counter) as defined in config.client.progression
// I created a stand-in value '@list' to track the most recent list scores
export type PositionId = string; // begins with "@"
