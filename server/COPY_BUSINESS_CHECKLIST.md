# Steps to create a new business by copying an old one

1. Prepare the necessary information
    - HS username & password
    - Store Number
    - Address
    - Store name
2. Copied the DEMO_TEMPLATE folder
2. Generate information that the script will hopefully do for
    - BusinessId
    - Expiration Date
3. Get HS scheule ID from HS
    - Schedule ID with URL https://www.hotschedules.com/hs/spring/employee/1537306559/schedule?_=1595282528722
        + change the first long number after employee
```
On the console:
d=[[ paste the json data ]]
d.sort((a, b) =>a.jobName.localeCompare(b.jobName)).map(j=>console.log(j.id, j.jobName))

```
2. Run `copy-business.sh`
3. Fill in the HS username and password
4. Customize project structure
    - layouts Front of House & Back of House
        + convert sketch to structure
        + include auto-scheduling hooks
        + link to training positions
    - permissions
    - position progression
5. Configure GroupMe
    - If they already have groups, add Da Cowz to the groups
    - Fill in GroupIds
    - Dry run the manage-groupme scripts to check that match up the existing users to employees
6. Billing on Waveapps.com
