import { DocumentReference } from '@firebase/firestore-types';
import { Omit } from '../helpers/omit';

import { BusinessId } from './business.model';

import { EmployeeId } from './employee.model';
import { PositionId } from '../config/layout-generation-config.model';
import { UserId } from '../auth/app-user.model';
import { DestinationId } from './destination.model';
import { CriteriaId } from '../config/training-config.model';
import { HintData } from '../organize-shifts/prompt-ratings/prompt-ratings.component';
import { SubmittedBy } from '../auth/submitted-by.model';
import { ListEvaluationResult } from '../lists/list.model';

// reference for tips:
// https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
export type HistoryEventKind = 'system' | 'rating' | 'rating2' | 'list';
export type HistoryEvent<T> =
  T extends SystemEvent ? SystemEvent :
  T extends ListEvent ? ListEvent :
  T extends RatingEvent ? RatingEvent :
  T extends RatingEvent2 ? RatingEvent2 :
  HistoryEventTemplate;

export interface HistoryEventTemplate {
  ref: DocumentReference;
  id: string;
  time: Date;
  kind: HistoryEventKind;
}
export type DbHistoryEventTemplate = Omit<HistoryEventTemplate, DbOmitFields>;

export interface RatingEventData {
  positionId: PositionId;
  submittedByUser: UserId;
  submittedByEmployee: EmployeeId;

  score: number; // average of subscores
  scores: { [criteriaId: string]: number };

  message: string; // html markup allowed
  note: string; // just the text of the message
}

export interface RatingEventData2 {
  position?: { id: PositionId; name: string; };
  destination?: { id: DestinationId; name: string; };
  business: { id: BusinessId; name: string; };

  submittedBy: SubmittedBy;

  score?: number; // average of subscores
  scores?: ScoreCache[];

  message?: htmlString; // TODO: DEPRECATED
  messageMarkdown: markdownString;

  composedInMinutes: number // Rounded to the tenth; minutes spent writing the review

  hint?: HintData; // If this was prompted by a hint
}
export interface ScoreCache {
  criteriaId: CriteriaId;
  name: string;
  value: number;
  meaning: string;
}

export interface ListEventData {
  destination: { id: DestinationId; name: string; };
  business: { id: BusinessId; name: string; };
  submittedBy: SubmittedBy;

  list: ListEvaluationResult;
}

export interface SystemEventData {
  description: string; // Password changed, hired, archived...
}

export type RatingEvent = { kind: 'rating' } & RatingEventData & HistoryEventTemplate;
export type RatingEvent2 = { kind: 'rating2' } & RatingEventData2 & HistoryEventTemplate;
export type ListEvent = { kind: 'list' } & ListEventData & HistoryEventTemplate;
export type SystemEvent = { kind: 'system' } & SystemEventData & HistoryEventTemplate;

// These fields are populated when the objects are regenerated on the client
type DbOmitFields = "ref"|"id";
export type DbRatingEvent2 = Omit<RatingEvent2, DbOmitFields>
export type DbSystemEvent = Omit<SystemEvent, DbOmitFields>
export type DbListEvent = Omit<ListEvent, DbOmitFields>

export type htmlString = string;
export type markdownString = string; // will be parsed into html by marked.js
