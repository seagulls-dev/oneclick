import { RoleId } from "../services/employee.model";
import { BusinessPermissionId } from '../services/business.model';

export interface ClientPermissionConfig {
  [activity: string]: ActivityPermission;
}

// TODO: provide some automatic way to restrict this to only allowed id's
export type ActivityPermissionId = string;

export interface ActivityPermission {
  // ** rules?: Rule[]; // Not implementing
  // this feature would allow strict permissions restricted to only oneself,
  // but with a non-director with privileges for everyone

  requireRoles: RoleList;
  allowSelf?: boolean;      // default: true
  allowOthers?: boolean;    // default: true
  requireBelow?: boolean;   // default: false
  allowGuest?: boolean;     // default: true --> otherwise, require an email sign in w permissions
  allowGeneral?: boolean;   // default: false. When true, it will ignore errors
    // caused by not passing in an employee for allowSelf (not the others right now)
  requireBusinessPermission?: BusinessPermissionId[];


  // displayed on the configurations screen and within the app
  name: string;
  description: string;
}

// each of these are interpreted in strict mode, except the last one
// if the last element is 'strict'; every role will be interpreted strictly
// an empty array means that *anyone* can perform the action
// TODO: the compilier is not correctly understanding this better typed solution
// TODO: when it's fixed, remove the type assertions (as RoleList) that I inserted
export type RoleList = RoleId[]; // (RoleId | "strict")[]

/*
export interface Rule {
  role: RoleId;
  allowSelf?: boolean; // default: true
  allowOthers?: boolean; // default: true
  requireBelow?: boolean; // default: false
  strict?: boolean; // default: true, except false for the last rule
}
*/