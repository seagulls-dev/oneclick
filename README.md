# OneClick

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.9.

## Development server

Run `npm start` for a dev server.
Navigate to `https://63b44a3109a542068534384a18798d59.vfs.cloud9.us-west-2.amazonaws.com/oneclick/`.
The app will automatically reload if you change any of the source files.

## Release version

Run `sh release/release.sh` to build the project.
The script will ask for an additional flag indicating the type of release.
The build artifacts will be stored in the `dist/` directory and deployed
to the remote server.

## Deploy configuration chagnes

See `server/config/README.md`.

# General notes
## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Running for development use
`npm start`

## Deploying release

### First-time setup
Releases are deployed using the [firebase-tools cli](https://firebase.google.com/docs/cli).
Follow those instructions, which are loosely:
    - `npm install -g firebase-tools`
    - `firebase login`
        note, we should be able to set this up on cloud9 later if we want by using the flag --no-localhost
    - From the top-level oneclick dir, run `firebase init`
        Choose only the 'hosting' option, setup as one-page app.
        For the 'public' space, do 'dist/oneclick' (this is where the release-ready version of the code already is)

### Release Process
First commit all recent changes (the release script will do more commits itself).
Merge to master branch/push if need be, and checkout master.
Then run `sh release/release.sh`, specifying a version update of `--major`, `--minor`, `--patch`, or `--keepVersion``.
After that finishes, do a test run:
    Download dist/oneclick as a zip, and put it on your local machine in the same location for firebase to use.
    Run with `firebase serve`. This will serve the files locally and let you try it out first.
    Be sure to check that the version matches the new release version (may have to refresh or use icognito).
    When satisfied that all is working, stop that server and deploy it to production using `firebase deploy --only hosting`.
        The '--only hosting' indicates to only deploy what we have setup in the firebase 'hosting' module. If you only chose the 'hosting'
        option when running 'firebase init', then this flag is irrelevant.
Check online at [firebase hosting](https://console.firebase.google.com/project/hotautoscheduler/hosting/sites/hotautoscheduler)
that the new release is live (may take a minute or two, and the 'files' count may be at 0 in that time.)
Access the live version of the app and make sure it's up-to-date and working now.
    **Importantly, if it's not working, you can select 'Rollback' in the 3-dot menu of a previous build.
If all is well, run `sh release/finish.sh` to prompt an update on all current clients.
Congrats! Settle back and grab a cookie. You released it.

### TODO: build context menus
https://stackoverflow.com/a/35730445/2844859
