#!/bin/sh

# This script:
#   Copies the Firebase structure to a new business Id
#   Copies the config folder structure here
#   Set up Store account with email address
#   TODO: copy over the store account
#

echo "
This script will ask you for the following information:
Store Name                ex: CFA Ammon
Store Id                  (5 digit number identifying the store) ex: 02789
Source Business Id        (long firestore string identifying a business to copy from) ex: 8chdfsalk38l359llk
Store Email Address       as the default account

The store will be initiated in a demo mode that expires in 30 days from today,
and it must be upgraded with other tools.
"

read -p 'Do you have all this information ready? (y/n) ' ready
if [[ (-n $ready) || ($ready != "y") ]];
then
  echo $ready
  echo "That's ok. Go get it and come back when you're ready!"
  exit 1
fi

echo "Finished.";