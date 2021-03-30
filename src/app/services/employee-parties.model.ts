import { RoleId as GroupMeRoleId, Member } from '../../../server/GroupMe';
import { ContactNumber } from '../../../server/HotSchedules/HotSchedules.d';
import { Omit } from '../helpers/omit';

export type PartyName = 'Monday' | 'HotSchedules' | 'OneClick' | 'GroupMe';
export type Parties = {
  Monday?: MondayParty,
  HotSchedules?: HotSchedulesParty;
  OneClick?: OneClickParty;
  GroupMe?: GroupMeParty;
}

export interface MondayParty {}
export interface HotSchedulesParty {
  id: number;
  firstname: string;
  lastname: string;
  nickname: string;
  birthDate: Date;
  email: string;
  hireDate: Date;
  phoneNumber: number;
  phoneNumberObject: ContactNumber;
}
export interface OneClickParty {
  // these two always go together
  phoneNumber?: number;

  email?: string;
  profileUrl?: string;
}
export interface GroupMeParty {
  user_id: number;

  groups: { [groupId: string]: SmallGroupMeMember };
}

// Convert any number-like strings to numbers
export type SmallGroupMeMember = Omit<Member, "user_id"|"id"> & {
  user_id: number;
  id: number;
}
