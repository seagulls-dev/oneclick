import * as firestore from '../firebaseAdmin';

export default async function count(alsoTheOldRatings?: boolean): Promise<MonthlyRatings> {

  // If requested, also include the old format of ratings
  var kinds = ['rating2'];
  if(alsoTheOldRatings)
    kinds.push('rating');

  const query = firestore.firestore.collectionGroup('history')
    .where('kind', "in", kinds)
    .orderBy('time')
    .select('time');

  const ratingsSnapshot = await query.get();

  var monthlyRatings: MonthlyRatings = {};
  for(let rating of ratingsSnapshot.docs){
    const time = rating.get('time').toDate();
    const businessId = rating.ref.parent.parent.parent.parent.id;

    const year = ("" + time.getUTCFullYear()).padStart(4, "0");
    const month = ("" + time.getUTCMonth()).padStart(2, "0");
    const monthKey = year + "-" + month;

    if(!monthlyRatings[businessId])
      monthlyRatings[businessId] = {};

    if(!monthlyRatings[businessId][monthKey])
      monthlyRatings[businessId][monthKey] = 0;

    monthlyRatings[businessId][monthKey]++;
  }

  return monthlyRatings;
}

export interface MonthlyRatings {
  [businessId: string]: {
    [monthKey: string]: number; // Number of ratings in that month for that business
  }
}
