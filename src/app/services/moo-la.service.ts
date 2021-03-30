import { Injectable } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { ConfigService } from '../config/config.service';

import { Employee, MooLaDestination, BillMap } from './employee.model';
import { insertIntoString, randomElement } from '../helpers/snippet';
import { MooLaBill } from '../config/moola-config.model';
import { giveMooLaReasons, grantMooLaReasons, chargeMooLaReasons, supplyMooLaReasons } from '../helpers/moola-suggested-responses';

@Injectable({
  providedIn: 'root'
})
export class MooLaService {
  constructor(
    private authService: AuthService,
    private configService: ConfigService
  ) { }

  private handleTransaction(type: "give"|"grant"|"supply", amount: number, to: Employee, forReason: string): Promise<boolean> {
    // the boolean indicates if it was successfully deposited and? withdrawn

    // These are for caching and convience
    const give = type === "give";
    const grant = type === "grant";
    const supply = type === "supply";

    // Verify a few assertions
    if(!give && !grant && !supply)
      throw Error(`A transaction type must be 'give,' 'grant,' or 'supply.' Received '${type}'.`);

    const from = this.authService.getEmployee();
    if(!from)
      throw new Error("Cannot handle MooLa transaction without an acting employee");
    if(to.id === from.id){
      console.warn(`Cannot ${type} MooLa neither to nor from yourself.`);
      return Promise.resolve(false);
    }

    amount = Math.abs(amount);
    if(amount <= 0){
      alert(`Sorry ${from.getName()}, you don't have any funds to ${type}.`);
      return Promise.resolve(false);
    }

    const permission = `${type}MooLa`; // grantMooLa, giveMooLa, supplyMooLa
    if(!this.authService.can(permission, to)){
      alert(`Sorry ${from.getName()}, you aren't allow to ${type} Moo-La to ${to.getName()}.`);
      return Promise.resolve(false);
    }

    // const verb = (grant && "Granting") || (give && "Giving") || (supply && "Supplying");
    // console.log(`${verb} ${to.getName()} $${amount} Moo-La from ${from.getName()} for ${forReason}`);

    // TODO: perform these calls as a batch operation for the atomical success and for
    // better security rules checking. In a batch, the rules can verify that any
    // write also includes a new transaction, I think.
    // Part of the issue is the privacy of the ref's on my objects...
    var calls: Promise<void>[] = [];

    // When granting and giving, subtract the value from the correct location of
    // the giver, unless the giver is granting and has permission to grant infinitely
    if(give || (grant && !this.authService.can('disburseUnlimitedMooLa'))){
      // if we're granting, check the budget; else, check the value
      const mooLaSource = grant ? MooLaDestination.weeklyBudget : MooLaDestination.personalStore;

      if(from.hasMooLa(amount, mooLaSource))
        // subtract the MooLa from the giving person's budget
        calls.push(from.changeMooLa(amount * -1, mooLaSource));
      else{
        // They don't have enough funds
        alert(`Sorry ${from.getName()}, you only have $${from.readMooLa(mooLaSource)} to ${type}.`);
        return Promise.resolve(false);
      }
    }

    // When granting, log the value into the disbusedCounter of the distributor
    if(grant)
      calls.push(from.changeMooLa(amount, MooLaDestination.disbursedCounter));

    // generate the transaction
    const business = this.authService.getBusiness();
    calls.push(business.saveMooLaTransaction({
      value: amount,
      type,
      forReason,

      from: this.authService.generateSubmittedBy(),
      to: this.authService.generatePartialSubmittedBy(to),
    }))

    // deposit the Moo-La in the account
    const destinationLocation = supply ? MooLaDestination.weeklyBudget : MooLaDestination.personalStore;
    calls.push(to.changeMooLa(amount, destinationLocation));

    return Promise.all(calls)
      .then(() => true);
  }
  grant(amount: number, to: Employee, forReason: string): Promise<boolean> {
    // Michelle C granted Colby $5 Moo-La for being an all-star!
    return this.handleTransaction('grant', amount, to, forReason);
  }
  give(amount: number, to: Employee, forReason: string): Promise<boolean> {
    // Brittney L gave Nae Nae $15 Moo-La for covering my shift on Thursday.
    return this.handleTransaction('give', amount, to, forReason);
  }
  supply(amount: number, to: Employee, toPurpose: string): Promise<boolean> {
    // Cory G supplied Teeny with $10 Moo-La **to** give to others
    return this.handleTransaction('supply', amount, to, toPurpose)
  }
  charge(amount: number, from: Employee, forReason: string): Promise<boolean> {
    // The boolean indicates if it was successfully charged

    // Cory G charged James F $10 Moo-La for a hat and two scarves.
    // James F paid Da Cowz $10 Moo-La for a hat and two scarves.

    if(!this.authService.can('chargeMooLa', from))
      return Promise.resolve(false);

    const by = this.authService.getEmployee();
    amount = Math.abs(amount);

    // One can charge himself
    // We don't do zero valued transactions
    if(!amount || amount <= 0){
      console.warn("Cannot perform a zero-valued transaction");
      return Promise.resolve(false);
    }

    console.log(`Charging $${amount} Moo-La from ${from.getName()} by ${by.getName()} for ${forReason}.`);

    // The person can't afford this
    if(!from.hasMooLa(amount))
      return Promise.resolve(false);

    let calls = [];

    // generate the transaction
    const business = this.authService.getBusiness();
    calls.push(business.saveMooLaTransaction({
      value: amount,
      type: 'charge',
      forReason,

      from: this.authService.generatePartialSubmittedBy(from),
      by: this.authService.generateSubmittedBy(),
    }))

    // charge the employee
    calls.push(from.changeMooLa(amount * -1))

    return Promise.all(calls)
      .then(() => true);
  }

  // TODO: error handling!
  private getResponse(type: 'give'|'grant'|'charge'|'supply', targetEmployee: Employee, actingEmployee: Employee, maxValue: number): AmountAndReason|false {
    // returns the results if they are obtained,
    // or false if the operation is aborted for some reason

    const amountString = prompt(`How much Moo-La do you want to ${type} ${targetEmployee.getName(true)}?`, '0');
    const amount = Math.abs(parseInt(amountString, 10));

    // This also catches 0 values which we don't want to process
    if(!amountString || !amount || isNaN(amount)){
      // console.log(`Did not receive an amount (${amount}). Aborting.`);
      return false;
    }

    if(amount > maxValue){
      let failure: string,
          actingEmployeeName = actingEmployee.getName();
      switch(type){
        case "give":  failure = `Sorry ${actingEmployeeName}, you only have $${maxValue} Moo-La in your personal acount to give away.`; break;
        case "grant":  failure = `Sorry ${actingEmployeeName}, you only have $${maxValue} Moo-La in your weekly budget to grant away.`; break;
        case "charge":  failure = `Sorry ${actingEmployeeName}, ${targetEmployee.getName()} only has $${maxValue} Moo-La to be charged.`; break;
        case "supply":  failure = `Sorry ${actingEmployeeName}, you are only allowed to supply $${maxValue} Moo-La at a time.`; break;
        default:
          throw Error(`Unrecognized type for a MooLa Transaction: ${type}`);
      }
      alert(failure);
      return false;
    }

    let question: string,
        suggestedAnswer: string;
    switch(type){
      case "give":
        question = `I'm giving you, ${targetEmployee.getName()}, $${amount} Moo-La for...`;
        suggestedAnswer = randomElement(giveMooLaReasons);
        break;
      case "grant":
        question = `I'm granting you, ${targetEmployee.getName()}, $${amount} Moo-La for...`;
        suggestedAnswer = randomElement(grantMooLaReasons);
        break;
      case "charge":
        question = `I'm charging you, ${targetEmployee.getName()}, $${amount} Moo-La for...`;
        suggestedAnswer = randomElement(chargeMooLaReasons);
        break;
      case "supply":
        question = `I'm supplying you, ${targetEmployee.getName()}, $${amount} Moo-La to...`;
        suggestedAnswer = randomElement(supplyMooLaReasons);
        break;
      default:
        throw Error(`Unrecognized type for a MooLa Transaction: ${type}`);
    }

    if(!question)         throw Error(`Missing question for type ${type}!`);
    if(!suggestedAnswer)  throw Error(`Missing suggestedAnswer for type ${type}!`);

    let reason = prompt(question, suggestedAnswer);
    if(!reason){
      alert("You must answer this question to manage Moo-La.");
      return false;
    }

    return { amount, reason };
  }
  giveWithPrompts(to: Employee): Promise<boolean> {
    const from = this.authService.getEmployee();
    const response = this.getResponse('give', to, from, from.readMooLa(MooLaDestination.personalStore));
    if(!response) return Promise.resolve(false); // Did not get valid response from user

    return this.give(response.amount, to, response.reason);
  }
  grantWithPrompts(to: Employee): Promise<boolean> {
    const from = this.authService.getEmployee();
    const maxGrant = this.authService.can('disburseUnlimitedMooLa') ? Infinity : from.readMooLa(MooLaDestination.weeklyBudget);

    const response = this.getResponse('grant', to, from, maxGrant);
    if(!response) return Promise.resolve(false); // Did not get valid response from user

    return this.grant(response.amount, to, response.reason);
  }
  supplyWithPrompts(to: Employee): Promise<boolean> {
    const from = this.authService.getEmployee();

    // TODO: this is the only place that the limit is enforced...
    const maxSupplyAmount = this.configService.getConfig<number>('mooLa.maxSupplyTransactionAmount', 100);
    const maxSupply = this.authService.can("disburseUnlimitedMooLa") ? Infinity : maxSupplyAmount;

    const response = this.getResponse('supply', to, from, maxSupply);
    if(!response) return Promise.resolve(false); // Did not get valid response from user

    return this.supply(response.amount, to, response.reason);
  }
  chargeWithPrompts(from: Employee): Promise<boolean> {
    const by = this.authService.getEmployee();
    const response = this.getResponse('charge', from, by, from.readMooLa(MooLaDestination.personalStore));
    if(!response) return Promise.resolve(false); // Did not get valid response from user

    return this.charge(response.amount, from, response.reason);
  }

  getBudgetOrInfinity(employee?: Employee): number {
    if(!employee)
      return 0;

    if(this.authService.hasPermission(employee, "disburseUnlimitedMooLa").allowed)
      return Infinity;

    return employee.readMooLa(MooLaDestination.weeklyBudget);
  }

  private adjustForDomain(filename: string): string {
    return `assets/moola/${filename}`;
  }
  getFileName(bill: MooLaBill): string {
    return this.adjustForDomain(bill.filename);
  }
  getSmallFileName(bill: MooLaBill): string {
    // Takes the filename of the bill, and returns the modified version pointing
    // to a smaller file:
    // Ex: moolaX.jpg ==> moolaX.small.jpg
    const lastPeriodIndex = bill.filename.lastIndexOf('.');
    const smallVariant = insertIntoString(bill.filename, lastPeriodIndex, ".small");
    return this.adjustForDomain(smallVariant);
  }

  getBills(allBills?: boolean): MooLaBill[] {
    // Returns the bills sorted by ascending value
    // If allBills is true, it will return all the bills,
    // otherwise, it will only return those that the currently signed-in
    // employee has access to.

    const bills = this.configService.getConfig<MooLaBill[]>("moola.bills", []);
    const canGrantAll = allBills || this.authService.can("grantReservedBills");

    // Filter out the reserved bills if necessary,
    // and sort by value ascending
    return bills
      .filter(b => canGrantAll || !b.reserved)
      .sort((a, b) => a.value - b.value);
  }
  figureBills(amount: number): BillMap {
    // returns a map bills whose value adds up to the amount given
    const positiveAmount = Math.abs(amount);
    const bills = this.getBills();
    // const useReservedBills = this.authService.can('grantReservedBills');

    if(!bills || !bills.length)
      throw Error("Cannot figure bills without a list of bills");

    // Use the largest bills possible, respecting reserved limitations
    // Don't figure the $2 bill.
    var accruedValue = 0;
    var billMap: BillMap = {};

    for(let i=bills.length -1;i>=0;i--){
      const bill = bills[i];
      if(bill.value === 2)
        continue;

      if(accruedValue >= positiveAmount)
        break;

      const valueRemaining = positiveAmount - accruedValue;
      const useBillsNumber = Math.floor(valueRemaining / bill.value);
      if(useBillsNumber){
        accruedValue += useBillsNumber * bill.value;
        billMap[bill.value] = useBillsNumber;
      }
    }

    return billMap;
  }
}

interface AmountAndReason {
  amount: number;
  reason: string;
}
