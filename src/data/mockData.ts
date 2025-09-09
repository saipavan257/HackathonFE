import type { Insurer, Brand } from '../types';

export const mockInsurers: Insurer[] = [
  {
    id: 1,
    name: 'Allianz Group',
    type: 'Life & General',
    location: 'Munich, Germany',
    established: 1890,
    brands: [1, 2, 3]
  },
  {
    id: 2,
    name: 'AXA Group',
    type: 'Life & General',
    location: 'Paris, France',
    established: 1816,
    brands: [4, 5]
  },
  {
    id: 3,
    name: 'Berkshire Hathaway',
    type: 'General',
    location: 'Omaha, USA',
    established: 1965,
    brands: [6, 7, 8]
  },
  {
    id: 4,
    name: 'Ping An Insurance',
    type: 'Life & General',
    location: 'Shenzhen, China',
    established: 1988,
    brands: [9, 10]
  },
  {
    id: 5,
    name: 'Munich Re',
    type: 'Reinsurance',
    location: 'Munich, Germany',
    established: 1880,
    brands: [11, 12]
  },
  {
    id: 6,
    name: 'Zurich Insurance',
    type: 'Life & General',
    location: 'Zurich, Switzerland',
    established: 1872,
    brands: [13, 14, 15]
  },
  {
    id: 7,
    name: 'Generali Group',
    type: 'Life & General',
    location: 'Trieste, Italy',
    established: 1831,
    brands: [16, 17]
  },
  {
    id: 8,
    name: 'Prudential plc',
    type: 'Life',
    location: 'London, UK',
    established: 1848,
    brands: [18, 19, 20]
  }
];

export const mockBrands: Brand[] = [
  {
    id: 1,
    name: 'Allianz Life',
    category: 'Life Insurance',
    insurerId: 1,
    insurerName: 'Allianz Group',
    marketShare: 8.5,
    status: 'Active',
    lastUpdated: '2024-01-15'
  },
  {
    id: 2,
    name: 'Allianz General',
    category: 'General Insurance',
    insurerId: 1,
    insurerName: 'Allianz Group',
    marketShare: 12.3,
    status: 'Active',
    lastUpdated: '2024-01-15'
  },
  {
    id: 3,
    name: 'Allianz Care',
    category: 'Health Insurance',
    insurerId: 1,
    insurerName: 'Allianz Group',
    marketShare: 6.7,
    status: 'Active',
    lastUpdated: '2024-01-10'
  },
  {
    id: 4,
    name: 'AXA Life',
    category: 'Life Insurance',
    insurerId: 2,
    insurerName: 'AXA Group',
    marketShare: 7.8,
    status: 'Active',
    lastUpdated: '2024-01-12'
  },
  {
    id: 5,
    name: 'AXA General',
    category: 'General Insurance',
    insurerId: 2,
    insurerName: 'AXA Group',
    marketShare: 9.4,
    status: 'Active',
    lastUpdated: '2024-01-08'
  },
  {
    id: 6,
    name: 'GEICO',
    category: 'Auto Insurance',
    insurerId: 3,
    insurerName: 'Berkshire Hathaway',
    marketShare: 15.2,
    status: 'Active',
    lastUpdated: '2024-01-20'
  },
  {
    id: 7,
    name: 'General Re',
    category: 'Reinsurance',
    insurerId: 3,
    insurerName: 'Berkshire Hathaway',
    marketShare: 11.8,
    status: 'Active',
    lastUpdated: '2024-01-18'
  },
  {
    id: 8,
    name: 'Berkshire Hathaway GUARD',
    category: 'Workers Compensation',
    insurerId: 3,
    insurerName: 'Berkshire Hathaway',
    marketShare: 4.5,
    status: 'Active',
    lastUpdated: '2024-01-16'
  },
  {
    id: 9,
    name: 'Ping An Life',
    category: 'Life Insurance',
    insurerId: 4,
    insurerName: 'Ping An Insurance',
    marketShare: 13.7,
    status: 'Active',
    lastUpdated: '2024-01-14'
  },
  {
    id: 10,
    name: 'Ping An Property',
    category: 'Property Insurance',
    insurerId: 4,
    insurerName: 'Ping An Insurance',
    marketShare: 10.9,
    status: 'Active',
    lastUpdated: '2024-01-11'
  },
  {
    id: 11,
    name: 'Munich Re Direct',
    category: 'Reinsurance',
    insurerId: 5,
    insurerName: 'Munich Re',
    marketShare: 18.4,
    status: 'Active',
    lastUpdated: '2024-01-13'
  },
  {
    id: 12,
    name: 'ERGO Group',
    category: 'General Insurance',
    insurerId: 5,
    insurerName: 'Munich Re',
    marketShare: 5.3,
    status: 'Active',
    lastUpdated: '2024-01-09'
  },
  {
    id: 13,
    name: 'Zurich Life',
    category: 'Life Insurance',
    insurerId: 6,
    insurerName: 'Zurich Insurance',
    marketShare: 6.8,
    status: 'Active',
    lastUpdated: '2024-01-17'
  },
  {
    id: 14,
    name: 'Zurich General',
    category: 'General Insurance',
    insurerId: 6,
    insurerName: 'Zurich Insurance',
    marketShare: 8.7,
    status: 'Active',
    lastUpdated: '2024-01-19'
  },
  {
    id: 15,
    name: 'Farmers Insurance',
    category: 'Auto Insurance',
    insurerId: 6,
    insurerName: 'Zurich Insurance',
    marketShare: 7.2,
    status: 'Active',
    lastUpdated: '2024-01-21'
  },
  {
    id: 16,
    name: 'Generali Life',
    category: 'Life Insurance',
    insurerId: 7,
    insurerName: 'Generali Group',
    marketShare: 9.1,
    status: 'Active',
    lastUpdated: '2024-01-05'
  },
  {
    id: 17,
    name: 'Generali Property',
    category: 'Property Insurance',
    insurerId: 7,
    insurerName: 'Generali Group',
    marketShare: 6.4,
    status: 'Inactive',
    lastUpdated: '2024-01-03'
  },
  {
    id: 18,
    name: 'Prudential Life',
    category: 'Life Insurance',
    insurerId: 8,
    insurerName: 'Prudential plc',
    marketShare: 11.5,
    status: 'Active',
    lastUpdated: '2024-01-22'
  },
  {
    id: 19,
    name: 'Prudential Annuities',
    category: 'Annuities',
    insurerId: 8,
    insurerName: 'Prudential plc',
    marketShare: 8.9,
    status: 'Active',
    lastUpdated: '2024-01-07'
  },
  {
    id: 20,
    name: 'M&G Prudential',
    category: 'Investment',
    insurerId: 8,
    insurerName: 'Prudential plc',
    marketShare: 5.6,
    status: 'Active',
    lastUpdated: '2024-01-06'
  }
];
