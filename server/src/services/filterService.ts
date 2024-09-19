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

  export const findMostCommonTransfer = (transfers: transfers[]): { from_material: string; to_material: string; count: number } => {
    const transferCounts: Record<string, number> = {};
  
    transfers.forEach(transfer => {
      const key = `${transfer.from_material}->${transfer.organization}`; // Create a unique key for the transfer
  
      if (!transferCounts[key]) {
        transferCounts[key] = 0;
      }
  
      transferCounts[key] += 1; // Increment the count for this type of transfer
    });
  
    // Find the most common transfer
    let maxCount = 0;
    let mostCommonTransfer = { from_material: '', to_material: '', count: 0 };
  
    for (const [key, count] of Object.entries(transferCounts)) {
      if (count > maxCount) {
        maxCount = count;
  
        // Split the key back into from_material and to_material (organization)
        const [from_material, to_material] = key.split('->');
        mostCommonTransfer = { from_material, to_material, count };
      }
    }
  
    return mostCommonTransfer;
  };