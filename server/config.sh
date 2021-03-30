#!/bin/sh

# Get latest configurations script
tsc config/configurations.ts --outDir generatedConfig --experimentalDecorators || exit 1

# Move the firebase key
cp HotAutoScheduler-83cc0b4f520d.json ./generatedConfig/server

node generatedConfig/server/config/configurations.js $* || exit 1

echo "Done"
