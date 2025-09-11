import humanaData from '../data/humana_nuro.json';
import anthemData from '../data/anthem_nuro.json';
import aetnaData from '../data/aetna_nuro.json';
import cignaData from '../data/cigna_nuro.json';
import uhcData from '../data/uhc_nuro.json';
import centeneData from '../data/centene_nuro.json';
import coverageData from '../data/insurers_coverage_data.json';

export interface DrugCoverageData {
  brand_name: string;
  inn_name?: string;
  hcpc_code?: string;
  hcpcs_code?: string;
  doc_hcpcs_code?: string; // Cigna specific
  state_policy_data?: string; // UHC specific
  prior_authorization_required: string;
  step_therapy_required?: string;
  indication: string;
  indicated_population: string;
  label_population: string;
  clinical_criteria: string;
  exclusion_criteria?: string;
  links?: string;
  insurer: string;
  // Fields to be removed for specific insurers
  date?: string;
  cpt_codes?: string;
  diagnosis_codes?: string;
  hcpcs_codes?: string;
}

export interface InsurerCoverageInfo {
  insurer: string;
  approx_covered_lives: string;
  percentage_us_population: string;
  notes: string;
  numericLives: number;
  numericPercentage: number;
  shortName: string;
  drugCount: number;
  uniqueBrands: string[];
  uniqueIndications: string[];
  uniqueHcpcsCodes: string[];
}

// Insurer-specific data transformations
const transformCignaData = (data: any[]): any[] => {
  return data.map(item => {
    // Remove specific fields
    const { date, cpt_codes, diagnosis_codes, ...cleanedItem } = item;
    
    // Transform doc_hcpcs_code: split by ":" and retain first value
    if (cleanedItem.doc_hcpcs_code) {
      cleanedItem.hcpcs_code = cleanedItem.doc_hcpcs_code.toString().split(':')[0].trim();
    }
    
    return cleanedItem;
  });
};

const transformUhcData = (data: any[]): any[] => {
  return data.map(item => {
    // Remove specific fields
    const { diagnosis_codes, hcpcs_codes, ...cleanedItem } = item;
    
    // Transform state_policy_data: split by newline, then by ":", retain first value, combine with commas
    if (cleanedItem.state_policy_data) {
      const transformedData = cleanedItem.state_policy_data
        .toString()
        .split('\n')
        .map((line: string) => line.split(':')[0].trim())
        .filter((item: string) => item)
        .join(', ');
      cleanedItem.state_policy_data = transformedData;
    }
    
    return cleanedItem;
  });
};

const transformAnthemData = (data: any[]): any[] => {
  return data.map(item => {
    // Remove hcpcs_code field for Anthem
    const { hcpcs_code, ...cleanedItem } = item;
    return cleanedItem;
  });
};

// Normalize data to ensure consistent structure
const normalizeData = (data: any[], insurerName: string): DrugCoverageData[] => {
  return data.map(item => ({
    brand_name: item.brand_name || '',
    inn_name: item.inn_name || '',
    hcpc_code: item.hcpc_code || item.hcpcs_code || item.doc_hcpcs_code || '',
    hcpcs_code: item.hcpcs_code || item.hcpc_code || item.doc_hcpcs_code || '',
    //doc_hcpcs_code: item.doc_hcpcs_code || '',
    state_policy_data: item.state_policy_data || '',
    prior_authorization_required: item.prior_authorization_required || (item.medication_sourcing_required ? "Yes" : "No") || 'No',
    step_therapy_required: item.step_therapy_required || 'No',
    indication: item.indication || '',
    indicated_population: item.indicated_population || '',
    label_population: item.label_population || '',
    clinical_criteria: item.clinical_criteria || '',
    exclusion_criteria: item.exclusion_criteria || '',
    links: item.links || '',
    insurer: insurerName
  }));
};

// Combine all drug data with normalization and transformations
const allDrugData: DrugCoverageData[] = [
  ...normalizeData(humanaData, 'Humana'),
  ...normalizeData(transformAnthemData(anthemData), 'Anthem'),
  ...normalizeData(aetnaData, 'Aetna'),
  ...normalizeData(transformCignaData(cignaData), 'Cigna Healthcare'),
  ...normalizeData(transformUhcData(uhcData), 'UnitedHealthcare'),
  ...normalizeData(centeneData, 'Centene')
];

// Process coverage data with drug information
export const getProcessedInsurerData = (filters?: {
  indication?: string;
  brand?: string;
  hcpcsCode?: string;
}): InsurerCoverageInfo[] => {
  // Filter drug data based on provided filters
  let filteredDrugData = allDrugData;
  
  if (filters?.indication) {
    filteredDrugData = filteredDrugData.filter(drug => 
      drug.indication.toLowerCase().includes(filters.indication!.toLowerCase())
    );
  }
  
  if (filters?.brand) {
    filteredDrugData = filteredDrugData.filter(drug => 
      drug.brand_name.toLowerCase().includes(filters.brand!.toLowerCase())
    );
  }
  
  if (filters?.hcpcsCode) {
    filteredDrugData = filteredDrugData.filter(drug => 
      (drug.hcpc_code && drug.hcpc_code.toLowerCase().includes(filters.hcpcsCode!.toLowerCase())) ||
      (drug.hcpcs_code && drug.hcpcs_code.toLowerCase().includes(filters.hcpcsCode!.toLowerCase()))
    );
  }

  // Group drug data by insurer
  const drugsByInsurer = filteredDrugData.reduce((acc, drug) => {
    if (!acc[drug.insurer]) {
      acc[drug.insurer] = [];
    }
    acc[drug.insurer].push(drug);
    return acc;
  }, {} as Record<string, DrugCoverageData[]>);

  // Process coverage data and add drug information
  return coverageData.map(coverage => {
    const numericLives = parseFloat(coverage.approx_covered_lives.replace(/[^0-9.]/g, ''));
    const numericPercentage = parseFloat(coverage.percentage_us_population.replace(/[^0-9.]/g, ''));
    const shortName = coverage.insurer.split(' ')[0];
    
    // Get drugs for this insurer
    const insurerDrugs = drugsByInsurer[coverage.insurer] || [];
    const uniqueBrands = [...new Set(insurerDrugs.map(drug => drug.brand_name))];
    const uniqueIndications = [...new Set(insurerDrugs.map(drug => drug.indication))];
    const uniqueHcpcsCodes = [...new Set(insurerDrugs.map(drug => drug.hcpc_code || drug.hcpcs_code).filter(Boolean) as string[])];
    
    return {
      ...coverage,
      numericLives,
      numericPercentage,
      shortName,
      drugCount: insurerDrugs.length,
      uniqueBrands,
      uniqueIndications,
      uniqueHcpcsCodes
    };
  });
};

// Get all unique values for filters
export const getFilterOptions = () => {
  const uniqueIndications = [...new Set(allDrugData.map(drug => drug.indication))].filter(Boolean).sort();
  const uniqueBrands = [...new Set(allDrugData.map(drug => drug.brand_name))].filter(Boolean).sort();
  const uniqueHcpcsCodes = [...new Set(allDrugData.map(drug => {
    const code = drug.hcpc_code || drug.hcpcs_code;
    // Extract only the code part before the colon (e.g., "J0791" from "J0791: Injection, crizanlizumab-tmca, 5 mg [Adakveo]")
    return code ? code.toString().split(':')[0].trim() : '';
  }).filter(Boolean))].sort();
  
  return {
    indications: uniqueIndications,
    brands: uniqueBrands,
    hcpcsCodes: uniqueHcpcsCodes
  };
};

// Get insurer-specific drug coverage statistics
export const getInsurerDrugStats = (insurerName: string, filters?: {
  indication?: string;
  brand?: string;
  hcpcsCode?: string;
}) => {
  let insurerDrugs = allDrugData.filter(drug => drug.insurer === insurerName);
  
  if (filters?.indication) {
    insurerDrugs = insurerDrugs.filter(drug => 
      drug.indication.toLowerCase().includes(filters.indication!.toLowerCase())
    );
  }
  
  if (filters?.brand) {
    insurerDrugs = insurerDrugs.filter(drug => 
      drug.brand_name.toLowerCase().includes(filters.brand!.toLowerCase())
    );
  }
  
  if (filters?.hcpcsCode) {
    insurerDrugs = insurerDrugs.filter(drug => {
      const hcpcCode = drug.hcpc_code ? drug.hcpc_code.toString().split(':')[0].trim() : '';
      const hcpcsCode = drug.hcpcs_code ? drug.hcpcs_code.toString().split(':')[0].trim() : '';
      return hcpcCode === filters.hcpcsCode || hcpcsCode === filters.hcpcsCode;
    });
  }

  const priorAuthRequired = insurerDrugs.filter(drug => drug.prior_authorization_required === 'Yes').length;
  const totalDrugs = insurerDrugs.length;
  const priorAuthPercentage = totalDrugs > 0 ? (priorAuthRequired / totalDrugs) * 100 : 0;

  return {
    totalDrugs,
    priorAuthRequired,
    priorAuthPercentage,
    uniqueBrands: [...new Set(insurerDrugs.map(drug => drug.brand_name))],
    uniqueIndications: [...new Set(insurerDrugs.map(drug => drug.indication))],
    uniqueHcpcsCodes: [...new Set(insurerDrugs.map(drug => {
      const code = drug.hcpc_code || drug.hcpcs_code;
      return code ? code.toString().split(':')[0].trim() : '';
    }).filter(Boolean))]
  };
};

export { allDrugData };
