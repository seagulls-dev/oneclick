## Important scripts:
  - manual.sh `sh manual.sh` runs whatever is setup in manual.ts. Could include any of the below scripts.
  - config.sh: `sh config.sh <directory name of business>` Uploads (/overwrites) configuration data
    for a business in firestore. See config/README.md for more info.
  - process-businesses.ts: Manages HotSchedules shift info handling and GroupMe. Runs automatically
    in Google Cloud.
  - manage-membership.ts: (managePendingAccounts/deletePendingAccounts) Cleans up old pending accounts.
    Runs automatically in Google Cloud.
  - give-budgets.ts: (giveBudgets) Processes MooLa for businesses. Currently should be done manually every Sunday.
