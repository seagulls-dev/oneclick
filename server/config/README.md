These files hold the entire configuration trees for every business right now.
When these files are updated and sent to Firestore, they overwrite every config
change. Thus, changes should only be made here instead of doing some directly in the console.

Each business has a folder with it's own config. The `config.sh` script will compile all
the TypeScript config files into JavaScript and overwrite the config in the businesses.
Individual businesses may be specified, or may run it on all and change the `skip` field in a given
business' index.ts file.


Running:
  `cd oneclick/server`
  `sh config.sh Vicksburg-MS-03037`
where the business ("Vicksburg-MS-03037") may be changed to the desired business, or multiple businesses
may be specified.
To run for all businesses at once (except those with `skip` set in index.ts), use
  `sh config.sh --all`
HotSchedules processing will automatically be run the first time a business is setup (**removed until fixed). However, it can
also be run manually by passing `--hs` to the script.

When done adding/modifying a business' config, be sure to commit the changes to git.
For example:
`git status` (view changed files)
'git diff' (view changes text in files)
`git add -A` (add all changes for committing)
`git commit -m "Made really cool changes" --author="Eric <elongberg@gmail.com>"` (commit changes with author info)
`git push` (push changes to github)


Read more about changing layouts at LAYOUT_DESIGN.md

## File structure
Each file in the config folder for each business has a specific purpose.

Most of them `export` sets of values to be used by other files.

Some of them `import` shared values from `../SHARED/*.ts`. These values can be replaced
with customized solutions for that particular business. Use the same format as the value that
was being imported.

NOTE: With the exception of these shared imports, the configuration of each business
is entirely independent of every other. Edits can be made to each specific business
to fit their needs. This also means that batch operations will be labor intensive.
Feel free to use Copy & Paste if this is necessary, otherwise, just do your best.

This should mostly only be an issue with a developer who wants to add in features
that rely on config flags. Those flags would need to be edited or updated on each business
individually.
