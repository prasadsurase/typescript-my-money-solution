import { Console } from 'console';
import * as fs from 'fs';

let CommonUtils = {
  getCharge: (passengerType: string): number => {
    let charge: number = 0;
    switch(passengerType) { 
      case 'SENIOR_CITIZEN': { 
        charge = 100;
        break;
      } 
      case 'ADULT': { 
        charge = 200;
        break;
      } 
      case 'KID': { 
        charge = 50;
        break;
      } 
    } 
    return charge;
  },

  getDestination: (source: string): string => {
    return source == 'CENTRAL' ? 'AIRPORT' : 'CENTRAL';
  },

  readFile: (path: string): string[] => {
    let lines: string[] = [];
    const allFileContents = fs.readFileSync(path, 'utf-8');
    
    allFileContents.split(/\r?\n/).forEach(line =>  {
      lines.push(line.trim());
    });
    
    return lines;
  },

  getNewId: <T extends { id: number }>(items: T[]): number => {
    let max: number = 0;
    for (let i = 0; i < items.length; i++) {
      if(items[i].id > max) {
        max = items[i].id;
      }
    }

    return max + 1;
  },

  updateInList: <T extends {id: number | string}>(list: T[], obj: T): T[] => {
    let indx:number = list.findIndex(l => l.id == obj.id)
    if(indx > -1) {
      list[indx] = obj
    }
    return list;
  },

  calculateDiscountAmount: (amount: number, discountPercentage: number): number => {
    return (amount  * (discountPercentage/100))
  },

  getAmountAfterDiscount: (amount: number, discount: number): number => {
    return amount - (amount * (discount/100))
  },

  calculatePercentage: (amount: number, total: number): number => {
    let percentage: number = (amount/total) * 100
    return percentage
  }
};

export default CommonUtils
