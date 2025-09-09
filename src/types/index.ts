export interface Insurer {
  id: number;
  name: string;
  type: string;
  location: string;
  established: number;
  brands: number[];
}

export interface Brand {
  id: number;
  name: string;
  category: string;
  insurerId: number;
  insurerName: string;
  marketShare: number;
  status: 'Active' | 'Inactive';
  lastUpdated: string;
}

export interface InsurerCoverageData {
  brand_name: string;
  hcpcs_code?: string;
  hcpc_code?: string;
  prior_authorization_required?: string;
  step_therapy_required?: string;
  indication: string;
  indicated_population: string;
  label_population?: string;
  clinical_criteria?: string;
  exclusion_criteria?: string;
  quantity_limits?: string;
  document_history?: string;
  policy_revised_date?: string;
  policy_effective_date?: string;
  policy_approved_date?: string;
  published_date?: string;
  last_review_date?: string;
  insurer?: string;
  inn_name?: string;
  [key: string]: any;
}

export interface InsurerStats {
  name: string;
  totalBrands: number;
  totalIndications: number;
  priorAuthRequired: number;
  stepTherapyRequired: number;
  lastUpdated: string;
  uniqueHCPCS: number;
  coverageData: InsurerCoverageData[];
}
