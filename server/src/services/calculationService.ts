import { transfers } from "../models/Transfers";

export const calculateTotalWeightByOrganization = (transfers: transfers[]): Record<string, number> => {
    const totals: Record<string, number> = {};
    
    transfers.forEach(transfer => {
      const weight = parseFloat(transfer.weight as any);
      
      if (isNaN(weight)) {
        console.error(`Invalid weight for organization ${transfer.organization}: ${transfer.weight}`);
        return;  
      }

      if (!totals[transfer.organization]) {
        totals[transfer.organization] = 0;
      }

      totals[transfer.organization] += weight;
    });
  
    return totals;
};
