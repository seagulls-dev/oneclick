# Changelog

## 2.13.5 (10/15/2020)
- [Server-side] Re-added demo business config, setup store employee email
- Fixed Add Layout (and other) modals not showing up properly
- Allow appropriate users to access the demo business
- Properly handle businesses that no longer exist in a user's businesses list

## 2.13.4 (10/14/2020)
- [Server-side] Skip businesses with known HS login issues (bug that makes it affect businesses after)
- Fixed incorrectly showing business switcher button for users with only 1 business
    - Also prevent non-super users from accessing the demo business
- Fixed touchscreen scrolling on businesses list
- Fixed iOS issue of taken shifts not loading on startup and disappearing on scrolling
- Added a "pending" break state (yellow/orange) just before actually going on break (green)
- Made textarea at top resizable and with a scrollbar
- Version number is now a link to a changelog

## 2.13.1/2/3 (8/11/2020)
- Updates to businesses list (new fields, expiration dates, updated styling)
- Slightly updated backend scripts (track new business fields, catch errors, update logging)
- Loose tracking of shifts assigned per-business/day

## 2.13.0 (8/6/2020)
### New/Changed
- SuperUser support
    - See list of all businesses, view any
    - ServiceAccount and Director permissions
- Bottom of shifts panel: show business name, employee name
- Proper links to Terms of Service, Privacy Policy
- Styling updates for editing permissions/roles
- Slightly modified message for users with no businesses
- More obvious on-break color
- Highlight currently logged-in employee in shifts

### Fixed
- Loading issues when switching businesses
- Resolved warning with cookie security
- Director no longer allowed to remove own director/team member roles
- Hide training dashboard/ratings if don't have permission
- Menu bar not showing/being cut off on iOS devices

### Server-side
- Configurations:
    - Fixed several key name issues
    - Auto-create store (service) account, link to email if specified
    - Script for uploading these to the database per-business
    - Removed unnecessary version, defaultInviteConfig fields
    - requireBusinessPermission used now
    - Update HotSchedules on command
- Fixed ts build errors, show any that occur in the future
- Increased HotSchedules refresh rate (once every 2hrs throughout the day)
- Auto-run giveBudgets on a schedule, made functional for all businesses with MooLa
- Use environment-wide version vs business' version for auto-updating app
- Added firebase cli init files to git, updated various READMEs

## 2.12.9 (7/20/2020)
