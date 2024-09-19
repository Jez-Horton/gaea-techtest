import { transfers } from "../models/Transfers";

export const filterTransfersByDate = (data: transfers[], date: string): transfers[] => {
    const targetDate = new Date(date);
    return data.filter(transfer => {
      const transferDate = new Date(transfer.date);
      return transferDate.getFullYear() === targetDate.getFullYear() &&
             transferDate.getMonth() === targetDate.getMonth() &&
             transferDate.getDate() === targetDate.getDate();
    });
  };

  export const findTopOrganization = (totals: Record<string, number>): { organization: string; totalWeight: number } => {
    let maxWeight = 0;
    let topOrganization = '';
  
    for (const [organization, totalWeight] of Object.entries(totals)) {
      if (totalWeight > maxWeight) {
        maxWeight = totalWeight;
        topOrganization = organization;
      }
    }
  
    return { organization: topOrganization, totalWeight: maxWeight };
  };