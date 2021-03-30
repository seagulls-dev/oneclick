import { ClientPermissionConfig, RoleList } from "../../../src/app/config/client-permission-config.model";

export var ClientPermissions: ClientPermissionConfig = {
  // Organize Shifts
  "editShifts": {
    requireRoles: ["serviceAccount", "teamLeader"],
    name: 'edit shifts',
    description: "Assign shifts, manage breaks, and send people home.",
    requireBusinessPermission: ["useAdvancedFeatures"]
  },
  "editNote": {
    requireRoles: ["serviceAccount", "manager"],
    name: 'edit note',
    description: "Edit the notes for the day."
  },
  "viewRatingPrompts": {
    requireRoles: ['serviceAccount', 'trainer'],
    name: 'view rating prompts',
    description: 'View algorithmically generated prompts which guide rating notes',
    requireBusinessPermission: ["useTraining"]
  },

  // Employee Profiles
  "createRatings": {
    requireRoles: ["trainer"],
    allowSelf: false,
    name: "create ratings",
    description: "Provide positional feedback via the rating form."
  },
  "recommendPositions": {
    requireRoles: ["trainer", "manager"],
    allowSelf: false,
    requireBelow: true,
    name: 'recommend positions',
    description: "Recommend a position for additional practice with Trainer authority."
  },
  "requestPositions": {
    requireRoles: ["teamMember"],
    allowOthers: false,
    name: 'request positions',
    description: "Ask to practice a position one has already been trained on."
  },
  "manageDestinations": {
    requireRoles: ['manager'],
    name: 'manage destinations',
    description: "Remove people from specific destinations after they have been added."
  },
  "performAdvancedProfileOperations": {
    requireRoles: ['manager'],
    name: 'perform advanced profile operations',
    description: "Use advanced buttons such as 'Link to Another Email' and 'Reset GroupMe Data'."
  },
  "editPermissions": {
    requireRoles: ["manager"],
    allowSelf: false,
    requireBelow: true,
    name: 'edit permissions',
    description: "Edit the permissions of another employee, up to your own authority."
  },
  "viewRatings": {
    requireRoles: ["trainer"],
    name: 'view ratings',
    description: "View the ratings created via the rating form.",
    requireBusinessPermission: ["useTraining"]
  },
  "editNickname": {
    requireRoles: ["teamLeader"],
    allowSelf: false,
    name: 'edit nicknames',
    description: "Edit the nickname of the employees. Employees have some ability to control it from within HotSchedules."
  },
  "editProfile": {
    requireRoles: ["shiftLeader"],
    name: 'edit profiles',
    description: "Edit the email, phone number, profile photo, pin... etc. of employees besides yourself.",
  },

  // Employees
  "viewTrainingDashboard": {
    requireRoles: ["trainer"],
    name: "view training dashboard",
    description: "View and interact with the list of all employees which may or may not include training and MooLa information.",
    requireBusinessPermission: ["useTraining"],
  },

  // Training
  "viewLists": {
    requireRoles: ['serviceAccount'],
    name: "view lists",
    description: "Can open the lists panel to view what needs to be done."
  },
  "markListsDone": {
    requireRoles: ['serviceAccount', 'shiftLeader'],
    name: "mark lists done",
    description: "Interact with the check lists by marking them done."
  },
  "editLists": {
    requireRoles: ['manager'],
    name: "edit lists",
    description: "Create and delete lists, and items todo within the lists."
  },
  "passOffLists": {
    requireRoles: ['shiftLeader'],
    name: "pass off lists",
    description: "Evaluate or rate an employee based on their performance with a check list."
  },

  // MooLa
  "giveMooLa": {
    requireRoles: ['teamMember'],
    name: "give Moo-La",
    allowSelf: false,
    description: "Spend your Moo-La to give it to someone else.",
    requireBusinessPermission: ["useMooLa"]
  },
  "grantMooLa": {
    requireRoles: ['serviceAccount', 'trainer'],
    name: "grant Moo-La",
    allowSelf: false,
    allowGeneral: true,
    description: "Grant Moo-La to other team members from your weekly budget.",
    requireBusinessPermission: ["useMooLa"]
  },
  "chargeMooLa": {
    requireRoles: ['manager'],
    name: 'charge Moo-La',
    description: "Charge Moo-La on behalf of the cows for purchases and other expenditures.",
    requireBusinessPermission: ["useMooLa"]
  },
  "supplyMooLa": {
    requireRoles: ['manager'],
    name: 'supply Moo-La',
    allowSelf: false,
    description: "Supply another leader with more Moo-La budget to grant to others. This increased limit is still temporary and will reset on Sunday.",
    requireBusinessPermission: ["useMooLa"]
  },
  "disburseUnlimitedMooLa": {
    requireRoles: ['director'],
    name: "grant unlimited Moo-La",
    description: "Freely dish out the Moo-La without any limits or restrictions in grant and supply operations.",
    requireBusinessPermission: ["useMooLa"]
  },
  "viewMooLa": {
    requireRoles: ['shiftLeader'],
    name: 'view Moo-La',
    description: "View how much Moo-La employees besides yourself have in their account.",
    requireBusinessPermission: ["useMooLa"]
  },
  "manageMooLa": {
    requireRoles: ['manager'],
    name: 'manage Moo-La',
    description: "View MooLa logs, and use administrative functions like supply, and charge.",
    requireBusinessPermission: ["useMooLa"]
  },
  "grantReservedBills": {
    requireRoles: ['manager'], // TODO: maybe restrict to only specific people, or combine with manageMooLa permission
    name: "grant reserved bills",
    description: "Give away specialty bills like the $2 and $50",
    requireBusinessPermission: ["useMooLa"]
  },

  // General
  "guestSignIn": {
    requireRoles: ["serviceAccount", "strict"] as RoleList,
    name: 'sign in as a guest',
    description: "Allow other employees to sign in temporarily using only their clock-in number."
  },
  "useApplication": {
    requireRoles: ['teamMember', 'serviceAccount', 'strict'] as RoleList,
    name: 'use the application',
    description: "Load and view the data pertaining to the business"
  }
}
