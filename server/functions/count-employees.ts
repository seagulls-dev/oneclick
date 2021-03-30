import * as firestore from '../firebaseAdmin';

// Counts the number of active employees in a business
export default async function count(businessId: string): Promise<number> {
  const businessRef = firestore.env.collection('businesses').doc(businessId);
  const employeesSnapshot = await businessRef.collection('employees')
    .where('archived', "==", false)
    .get();

  return employeesSnapshot.size;
}
