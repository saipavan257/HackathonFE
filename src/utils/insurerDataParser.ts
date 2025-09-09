import type { InsurerCoverageData, InsurerStats } from '../types';

export const parseInsurerData = async (insurerName: string): Promise<InsurerStats> => {
  try {
    let data: InsurerCoverageData[] = [];
    
    switch (insurerName.toLowerCase()) {
      case 'aetna':
        data = (await import('../data/aetna_nuro.json')).default;
        break;
      case 'anthem':
        data = (await import('../data/anthem_nuro.json')).default;
        break;
      case 'humana':
        data = (await import('../data/humana_nuro.json')).default;
        break;
      default:
        throw new Error(`No data available for insurer: ${insurerName}`);
    }

    // Extract statistics
    const uniqueBrands = new Set(data.map(item => item.brand_name)).size;
    const uniqueIndications = new Set(data.map(item => item.indication)).size;
    const priorAuthRequired = data.filter(item => 
      item.prior_authorization_required?.toLowerCase() === 'yes'
    ).length;
    const stepTherapyRequired = data.filter(item => 
      item.step_therapy_required?.toLowerCase() === 'yes'
    ).length;
    const uniqueHCPCS = new Set(data.map(item => 
      item.hcpcs_code || item.hcpc_code
    ).filter(Boolean)).size;

    // Find the most recent update date
    const dates = data.map(item => {
      const dateFields = [
        item.policy_revised_date,
        item.policy_effective_date,
        item.policy_approved_date,
        item.published_date,
        item.last_review_date
      ].filter(Boolean);
      
      return dateFields.length > 0 ? new Date(Math.max(...dateFields.map(d => new Date(d!).getTime()))) : null;
    }).filter(Boolean) as Date[];

    const lastUpdated = dates.length > 0 
      ? new Date(Math.max(...dates.map(d => d.getTime()))).toISOString().split('T')[0]
      : 'Unknown';

    return {
      name: insurerName,
      totalBrands: uniqueBrands,
      totalIndications: uniqueIndications,
      priorAuthRequired,
      stepTherapyRequired,
      lastUpdated,
      uniqueHCPCS,
      coverageData: data
    };
  } catch (error) {
    console.error(`Error parsing data for ${insurerName}:`, error);
    throw error;
  }
};

export const getAllInsurerStats = async (): Promise<InsurerStats[]> => {
  const insurers = ['Aetna', 'Anthem', 'Humana'];
  const results: InsurerStats[] = [];
  
  for (const insurer of insurers) {
    try {
      const stats = await parseInsurerData(insurer);
      results.push(stats);
    } catch (error) {
      console.error(`Failed to load data for ${insurer}:`, error);
    }
  }
  
  return results;
};
