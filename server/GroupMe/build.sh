# USAGE$: sh config/lint.sh

OLD_PATH=$(pwd)
cd ~/environment/oneclick/server/GroupMe
tsc ../operations.ts --experimentalDecorators
tsc *.ts --experimentalDecorators
rm ../../src/app/*/*.js
rm ../../database/*.js
cd $OLD_PATH
