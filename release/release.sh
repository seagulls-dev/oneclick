#!/bin/sh

# move to the correct directory ;)
cd ~/environment/oneclick

# increment the version
sh release/increment-version.sh $1
if [ ! $? -eq 0 ]; then
    exit 1
fi

read -r version < release/version.txt

git commit -am "RELEASE $version"
git push

# The sass compiler doesn't support node 14.x.x
# I don't need to run this because I already set the default node version
# nvm use 13.13.0

# build the version. Do it safely so if it fails, we give up.
{
    ng build --prod
    cd dist/oneclick

    # update the code version in the index file
    perl -pi -e "s/window.OneClickCodeVersion = \"\d+.\d+.\d+\";/window.OneClickCodeVersion = \"$version\";/g" index.html

    cd ../..
} || {
    echo "Error: Build failed."
    exit 1;
}

echo "Build succeeded. Upload the generated files to Firebase Hosting and then run: sh release/finish.sh"
exit 0;
