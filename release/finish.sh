# This script should be run after running release.sh and uploading the generated
# files into Firebase hosting via a local computer.

# This script updates the version string in Firestore which causes all of the
# clients to reload and be running the latest version

# move to the correct directory ;)
cd ~/environment/oneclick

# Read the version
read -r version < release/version.txt

# run the update version script
tsc server/update-version.ts --outDir server/generated --experimentalDecorators || exit 1
node server/generated/update-version.js "$version" || exit 1

echo "Released $version"
exit 0
