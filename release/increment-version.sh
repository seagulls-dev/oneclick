#!/bin/sh

if [ -z "$1" ]
then
    ## https://www.cyberciti.biz/faq/unix-linux-bash-script-check-if-variable-is-empty/
    # No version indicator was passed in
    echo "No version incrementer. Use one of --major, --minor, --patch, or --keepVersion"
    exit 1
fi

# move to the correct directory ;)
OLD_PATH=$(pwd)
cd ~/environment/oneclick/release

# read, parse, and update the old version according to the command line arg
read -r old_version < version.txt

major_version="$(cut -d'.' -f1 <<<"$old_version")"
minor_version="$(cut -d'.' -f2 <<<"$old_version")"
patch_version="$(cut -d'.' -f3 <<<"$old_version")"

if [ $1 = "--major" ]; then
    major_version="$(( $major_version + 1 ))"
    minor_version="0"
    patch_version="0"
elif [ $1 = "--minor" ]; then
    minor_version="$(( $minor_version + 1 ))"
    patch_version="0"
elif [ $1 = "--patch" ]; then
    patch_version="$(( $patch_version + 1 ))"
elif [ $1 = "--keepVersion" ]; then
    exit 0
else
    echo "Unrecognized version incrementer. Use one of --major, --minor, --patch, or --keepVersion"
    exit 1
fi

# save the new version number in our file
new_version="$major_version.$minor_version.$patch_version"
echo "$new_version" > version.txt

# put the new version in the dev environmet
perl -pi -e "s/OneClickCodeVersion.?=.?\".*\"/OneClickCodeVersion = \"$new_version\"/" ../src/index.html

# git add and commit everything, including the new version
git add *
git commit -m "VERSION: $new_version"

echo "New version: $new_version"
cd $OLD_PATH

exit 0
