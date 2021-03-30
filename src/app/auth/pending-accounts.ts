import { CollectionReference, QuerySnapshot, FieldValue } from '@firebase/firestore-types';

import { EmployeeIdentifier } from '../../../database/db-user.model';
import { AppUser } from './app-user.model';
import { UserCreatedPendingAccount, BusinessCreatedPendingAcccount } from '../../../database/pending-account.model';
import { Omit } from '../helpers/omit';
import firebase from '@firebase/app';

export async function linkPendingAccounts(pendingAccounts: CollectionReference, user: AppUser): Promise<boolean> {
  // booleans indicates whether or not links were made

  let results: QuerySnapshot = await pendingAccounts.where('email', '==', user.email).get();
  if(results.empty){
    if(!user.businesses || !user.businesses.length){
      // a request has been stored. If the managers data comes in it will be approved
      let newPendingAccount: Omit<UserCreatedPendingAccount, 'created'> & { created: FieldValue } = {
        createdBy: 'user',
        created: firebase.firestore.FieldValue.serverTimestamp(),
        email: user.email,
        userId: user.id,
      };
      await pendingAccounts.doc().set(newPendingAccount);
    }
    return false;
  }else{
    // perform the link(s)
    // an email can be added to several stores
    let businesses: EmployeeIdentifier[] = [],
        networkRequests: Promise<void>[] = [];

    results.forEach(pendingAccount => {
      let data = pendingAccount.data() as BusinessCreatedPendingAcccount;
      if(data.createdBy !== 'business'){
        // console.warn(`Pending account was found for ${user.email} created by not a business`);
        return;
      }

      if(!data.businessId || !data.employeeId){
        console.warn(`Pending account created by ${data.createdBy} is missing either businessId or employeeId:`, data);
        return;
      }

      let eid: EmployeeIdentifier = {
            businessId: data.businessId,
            employeeId: data.employeeId,

            ...(data.destinationId && {destinationId: data.destinationId}),
            ...(data.businessName && {businessName: data.businessName}),
            ...(data.destinationName && {destinationName: data.destinationName}),
          };

      businesses.push(eid);
      networkRequests.push(pendingAccount.ref.delete());
    });

    if(businesses.length){
      try {
        console.log('Adding businesses', businesses);
        networkRequests.push(user.addBusinesses(businesses));
        await Promise.all(networkRequests);
        return true;
      }catch(e){
        throw Error('pending-account: ' + e);
        return false;
      }
    }else
      return false;
  }
}