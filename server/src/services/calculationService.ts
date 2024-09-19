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


//Transfers A -> B = SUM(SUM(Transfers A -> N) / SUM(Transfers -> N) * SUM(Transfers N -> B))
export const calculateMaterialAToB = (
    transfers: transfers[],
    materialA: string,
    materialB: string
  ): number => {
    // Materials that A is processed into
    const intermediateMaterials = new Set<string>();
  
    transfers.forEach(transfer => {
      if (transfer.from_material === materialA) {
        intermediateMaterials.add(transfer.to_material);
      }
    });
  
    console.log('Intermediate materials:', Array.from(intermediateMaterials));
  
    let totalTransfersAtoB = 0;
  
    //Foreach N work out contribution to B
    intermediateMaterials.forEach(intermediate => {
      
      const sumTransfersAtoN = transfers
        .filter(transfer => transfer.from_material === materialA && transfer.to_material === intermediate)
        .reduce((sum, transfer) => sum + parseFloat(transfer.weight as any), 0);
  
      console.log(`Transfers from A (${materialA}) to N (${intermediate}):`, sumTransfersAtoN);
  
      const sumTransfersNtoB = transfers
        .filter(transfer => transfer.from_material === intermediate && transfer.to_material === materialB)
        .reduce((sum, transfer) => sum + parseFloat(transfer.weight as any), 0);
  
      console.log(`Transfers from N (${intermediate}) to B (${materialB}):`, sumTransfersNtoB);
  
      const sumTransfersToN = transfers
        .filter(transfer => transfer.to_material === intermediate)
        .reduce((sum, transfer) => sum + parseFloat(transfer.weight as any), 0);
  
      console.log(`Total transfers to N (${intermediate}):`, sumTransfersToN);
        
      if (sumTransfersToN > 0 && sumTransfersNtoB > 0) {
        const contributionFromAtoB = (sumTransfersAtoN / sumTransfersToN) * sumTransfersNtoB;
        console.log(`Contribution from A to B through N (${intermediate}):`, contributionFromAtoB);
        totalTransfersAtoB += contributionFromAtoB;
      }
    });
  
    console.log('Total Transfers A to B:', totalTransfersAtoB);
  
    return totalTransfersAtoB > 0 ? totalTransfersAtoB : 0; // Return 0 if there's no valid transfer
  };