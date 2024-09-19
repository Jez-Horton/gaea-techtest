import { transfers } from "../models/Transfers";

export const calculateTotalWeightByOrganization = (transfers: transfers[]): Record<string, number> => {
    const totals: Record<string, number> = {};
    
    transfers.forEach(transfer => {
      const weight = transfer.weight;

      if (!totals[transfer.organization]) {
        totals[transfer.organization] = 0;
      }

      totals[transfer.organization] += weight;
    });
  
    return totals;
};
