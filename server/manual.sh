#!/bin/sh

# Preps/runs the manual.ts script

# Build in a special directory
tsc manual.ts --outDir generated --experimentalDecorators || exit 1

# Move in needed non-ts files (are package and package-lock actually needed though?)
cp HotAutoScheduler-83cc0b4f520d.json package-lock.json package.json ./generated/server

node generated/server/manual.js $* || exit 1

echo "Done"
