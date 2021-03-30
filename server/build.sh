#!/bin/sh

# Usage: convert all *.ts files to generated.*.js files
# Use as: ...$: sh build.sh

# Clear out the genereated directory
rm -r generated

# Build in a special directory
tsc *.ts --outDir generated --experimentalDecorators || exit 1

# remove the extra compiled scripts
cd generated # move into the /server/generated folder
rm -r database
rm -r src

# flatten the structure
mv ./server/* ./
rm -r server

cd ../ # move back into the /server folder

# Move in needed non-ts files (are package and package-lock actually needed though?)
cp HotAutoScheduler-83cc0b4f520d.json package-lock.json package.json ./generated

echo "Done"
