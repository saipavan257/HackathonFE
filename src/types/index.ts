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
