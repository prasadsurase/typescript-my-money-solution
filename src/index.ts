import CommonUtils from './utils/common_utils';

console.log("=".repeat(180))
console.log("=".repeat(180))
console.log("=".repeat(180))
let currentYear: number = new Date().getFullYear()

type ExpectedAllocation = {
  id: number
  percentageEquity: number
  percentageDebt: number
  percentageGold: number
}

type Allocation = {
  id: number
  amountEquity: number
  amountDebt: number
  amountGold: number
}

type Sip = {
  id: number
  amountEquity: number
  amountDebt: number
  amountGold: number
}

type Change = {
  id: number,
  percentageEquity: number
  percentageDebt: number
  percentageGold: number
  month: string
}

type MonthlyCalculation = {
  id: number
  sipId: number
  changeId: number
  oldEquity: number
  oldDebt: number
  oldGold: number
  month?: string
  newEquity: number
  newDebt: number
  newGold: number
  rebalanced: boolean
}

let allocation: Allocation;
let expectedAllocation: ExpectedAllocation;
let sips: Sip[] = [];
let changes: Change[] = [];
let monthlyCalculations: MonthlyCalculation[] = []

let rebalance = (monthlyCalculation: MonthlyCalculation): MonthlyCalculation => {
  if(changes.length < 6){
    console.error("CANNOT_REBALANCE")
    return monthlyCalculation
  }
  
  let total = monthlyCalculation.newEquity + monthlyCalculation.newDebt + monthlyCalculation.newGold;
  monthlyCalculation.rebalanced = true
  monthlyCalculation.newEquity = CommonUtils.calculateDiscountAmount(total, expectedAllocation.percentageEquity)
  monthlyCalculation.newDebt = CommonUtils.calculateDiscountAmount(total, expectedAllocation.percentageDebt)
  monthlyCalculation.newGold = CommonUtils.calculateDiscountAmount(total, expectedAllocation.percentageGold)
  console.table([monthlyCalculation])

  return monthlyCalculation
}

let calculateNewAllocation = (change: Change): void => {
  let monthlyCalculation: MonthlyCalculation = {
    id: CommonUtils.getNewId(monthlyCalculations),
    sipId: -1,
    changeId: change.id,
    oldEquity: 0,
    oldDebt: 0,
    oldGold: 0,
    newEquity: 0,
    newDebt: 0,
    newGold: 0,
    rebalanced: false
  }

  monthlyCalculation.oldDebt = allocation.amountDebt
  monthlyCalculation.oldEquity = allocation.amountEquity
  monthlyCalculation.oldGold = allocation.amountGold
  
  allocation.amountEquity += CommonUtils.calculateDiscountAmount(allocation.amountEquity, change.percentageEquity)
  allocation.amountDebt += CommonUtils.calculateDiscountAmount(allocation.amountDebt, change.percentageDebt)
  allocation.amountGold += CommonUtils.calculateDiscountAmount(allocation.amountGold, change.percentageGold)
  
  sips.forEach(sip => {
    monthlyCalculation.sipId = sip.id
    allocation.amountEquity += sip.amountEquity
    allocation.amountDebt += sip.amountDebt
    allocation.amountGold += sip.amountGold
  }) 
  
  monthlyCalculation.newDebt = allocation.amountDebt
  monthlyCalculation.newEquity = allocation.amountEquity
  monthlyCalculation.newGold = allocation.amountGold
  if (['JUNE', 'DECEMBER'].includes(change.month)){
    monthlyCalculation = rebalance(monthlyCalculation)
  }
  monthlyCalculations.push(monthlyCalculation)
}

let getBalanceForMonth = (month: string): void => {
  let change: Change | undefined = changes.find(c => c.month == month)
  if (change !== undefined){
    console.log("Balance for: ", month)
    // console.table([change])
    let mc: MonthlyCalculation | undefined = monthlyCalculations.find(mc => mc.changeId === change?.id)
    console.table([mc])
  } else {
    console.log(`Month ${month} not found`)
  }
}

let lines: string[] = CommonUtils.readFile('./input/input1.txt');

lines.forEach(line => {
  if(line.trim() !== '') {
    let data: string[] = line.split(' ');
    console.log(data)
    switch(data[0]) { 
      case 'ALLOCATE': {
        allocation = {id: 1, amountEquity: parseFloat(data[1]), amountDebt: parseFloat(data[2]), amountGold: parseFloat(data[3])}
        let total: number = allocation.amountEquity + allocation.amountDebt + allocation.amountGold
        expectedAllocation = {
          id: 1,
          percentageEquity: CommonUtils.calculatePercentage(allocation.amountEquity, total),
          percentageDebt: CommonUtils.calculatePercentage(allocation.amountDebt, total), 
          percentageGold: CommonUtils.calculatePercentage(allocation.amountGold, total)
        }
        console.table(allocation);
        console.table(expectedAllocation);
        break; 
      } 
      case 'SIP': {
        sips.push({id: CommonUtils.getNewId(sips), amountEquity: parseFloat(data[1]), amountDebt: parseFloat(data[2]), amountGold: parseFloat(data[3])})
        break;
      } 
      case 'CHANGE': {
        let change: Change = {
          id: CommonUtils.getNewId(changes),
          percentageEquity: parseFloat(data[1]),
          percentageDebt: parseFloat(data[2]),
          percentageGold: parseFloat(data[3]),
          month: data[4]
        }
        changes.push(change)
        calculateNewAllocation(change)
        break;
      } 
      case 'BALANCE': {
        getBalanceForMonth(data[1])
        break;
      } 
      case 'REBALANCE': {
        rebalance(monthlyCalculations[monthlyCalculations.length - 1])
        break;
      }
      default: { 
        break; 
      } 
    } 
  }
});