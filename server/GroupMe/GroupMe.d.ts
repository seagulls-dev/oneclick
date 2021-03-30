// Information adapted from the official docs at https://dev.groupme.com/docs/v3
// Other information included that is not found in the documentation, but observed in the data

export interface Envelope<T> {
  meta: {
    code: number;
    errors?: string[];
  }
  response: T;
}

export interface Group {
  id: GroupId;
  name: string;
  type: GroupType;
  description: string;
  image_url: string;
  creator_user_id: UserId;
  created_at: StrangeDate;
  updated_at: StrangeDate;
  members: Member[];
  share_url: string;
  messages: {
    count: number;
    last_message_id: MessageId;
    last_message_created_at: StrangeDate; // strange date...
    preview: {
      nickname: string;
      text: string;
      image_url: string;
      attachments: Attachment<any>[];
    }
  };

  // not in the spec, but found in the data
  office_mode: boolean;
  group_id: StringNumber;
  phone_number: string; // +1 0000000000
  share_qr_code_url: string;
  max_members: number;
}
export interface Member {
  user_id: UserId;
  nickname: string;
  muted: boolean;
  image_url: string;

  // these aren't in the spec, but I found them in the data
  autokicked?: boolean;
  avatar_url?: string;
  id?: StringNumber;
  name?: string;
  roles?: RoleId[];
  app_installed?: true;

  // When retreiving from an addMember call
  guid?: string;
}

export interface ImageAttachment {
  type: "image";
  url: string;
}
export interface LocationAttachment {
  type: "location";
  lat: StringNumber;
  lng: StringNumber;
  name: string;
}
export interface SplitAttachment {
  type: "split";
  token: string;
}
export interface EmojiAttachment {
  type: "emoji";
  placeholder: string;
  charmap: Array<number[]>;
}
export interface AnyAttachment {
  type: string;
}
export type Attachment<T> =
  T extends "image" ? ImageAttachment :
  T extends "location" ? LocationAttachment :
  T extends "split" ? SplitAttachment :
  T extends "emoji" ? EmojiAttachment :
  AnyAttachment;

export type StrangeDate = number; // I don't know how to interpret the date
export type StringNumber = string; // a string that looks like a number

export type GroupId = StringNumber;
export type UserId = StringNumber;
export type MessageId = StringNumber;
export type RoleId = "admin"|"owner"|"user"; // any others?
export type GroupType = "private"|"public"|"closed";

// https://api.groupme.com/v3/groups/52675533?token=605b8c90915201372af476ece660d121
// https://api.groupme.com/v3/groups?token=605b8c90915201372af476ece660d121

export interface AddMemberData {
  // POST /groups/:group_id/members/add
  // with AddMemberData[]
  //
  nickname: string;
  guid: string; // techically optional, but I need to be linking these to employeeId's when they return

  // one of these is required
  email?: string;
  user_id?: string;
  phone_number?: string;
}
export interface AddMemberResponse {
  results_id: string;
}
export interface AddMemberResults {
  // processed asynchronously, available sometime later after the request is sent
  // GET /groups/:group_id/members/results/:results_id

  // STATUS: 200 OK
  // STATUS: 503 Service Unavailable    => Results aren't ready. Try again in a little bit.
  // Status: 404 Not Found              => Results are no longer available. Don't try again.

  members: (Member & { guid: string})[];

  // not official, but found in the data
  failed: ({code: number} & AddMemberData)[]; // todo: this is not quite right...
}

export interface PostMessageData {
  // POST /groups/:group_id/messages
  // with PostMessageData
  message: {
    source_guid: string; //a GUID that I provide which is checked for duplication on minute intervals
    text: string; // the message; max-length: 1000 characters.
    attachments?: AnyAttachment[];
  }
}
export interface PostMessageResponse {
  // STATUS: 201 Created
  message: {
    id: StringNumber,
    source_guid: string;
    created_at: StrangeDate;
    user_id: UserId;
    group_id: GroupId;
    name: String;
    avatar_url: string;
    text: string;
    system: boolean;
    favorited_by: UserId[];
    attachments: AnyAttachment[];
  }
}
