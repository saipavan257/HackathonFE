import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  IconButton,
  Paper,
  useTheme,
  Tabs,
  Tab,
  Alert,
  AlertTitle,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  FormGroup,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Download as DownloadIcon,
  Clear as ClearIcon,
  BarChart as BarChartIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import aetnaNuroData from '../data/aetna_nuro.json';
import anthemNuroData from '../data/anthem_nuro.json';
import humanaNuroData from '../data/humana_nuro.json';
import cignaCompetitorData from '../data/Cigna_competitor.json';
import uhcCompetitorData from '../data/UHC_competitor.json';
import { 
  getUniqueHCPCSCodesForCompetitorInsights, 
  extractHCPCSCodes,
  getHCPCSValueFromItem
} from '../utils/hcpcsUtils';
import { CompetitorInsightsHCPCSBadges } from './HCPCSBadges';

interface CompetitorInsightsProps {
  onBack: () => void;
}

interface EnhancedCoverageData {
  id: string;
  brand_name: string;
  indication: string;
  indicated_population: string;
  clinical_criteria: string;
  prior_authorization: string;
  insurer: string;
  source_link: string;
  hcpc_code?: string;
  hcpcs_code?: string;
}

interface FilterState {
  indication: string;
  brand: string;
  hcpcsCode: string;
  insurer: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const CompetitorInsights: React.FC<CompetitorInsightsProps> = ({ onBack }) => {
  const theme = useTheme();

  const [filters, setFilters] = useState<FilterState>({
    indication: '',
    brand: '',
    hcpcsCode: '',
    insurer: '',
  });

  const [tabValue, setTabValue] = useState(0);
  const [selectedIndication, setSelectedIndication] = useState<string>('');

  // Insurer toggle state
  const [enabledInsurers, setEnabledInsurers] = useState<{
    aetna: boolean;
    anthem: boolean;
    humana: boolean;
    cigna: boolean;
    uhc: boolean;
  }>({
    aetna: true,
    anthem: true,
    humana: true,
    cigna: true,
    uhc: true,
  });

  // Clinical criteria popup state
  const [clinicalPopupOpen, setClinicalPopupOpen] = useState(false);
  const [selectedClinicalCriteria, setSelectedClinicalCriteria] = useState<{
    brand: string;
    indication: string;
    criteria: string;
  } | null>(null);

  // Process and merge data from all JSON files
  const processedData = useMemo(() => {
    const mergedData: EnhancedCoverageData[] = [];

    // Process Aetna data
    aetnaNuroData.forEach((item: any, index: number) => {
      mergedData.push({
        id: `aetna-${index}`,
        brand_name: item.brand_name,
        indication: item.indication,
        indicated_population: item.indicated_population,
        clinical_criteria: item.clinical_criteria || 'Not available',
        prior_authorization: item.prior_authorization_required === 'Yes' ? 'Prior Authorization' : 'Medical Necessity',
        insurer: 'Aetna',
        source_link: item.link || '',
        hcpcs_code: item.hcpcs_code || '',
      });
    });

    // Process Anthem data
    anthemNuroData.forEach((item: any, index: number) => {
      mergedData.push({
        id: `anthem-${index}`,
        brand_name: item.brand_name,
        indication: item.indication,
        indicated_population: item.indicated_population,
        clinical_criteria: item.clinical_criteria || 'Not available',
        prior_authorization: item.prior_authorization_required === 'Yes' ? 'Prior Authorization' : 'Medical Necessity',
        insurer: 'Anthem',
        source_link: item.links || '',
        hcpcs_code: item.hcpcs_code || item.hcpc_code || '',
      });
    });

    // Process Humana data
    humanaNuroData.forEach((item: any, index: number) => {
      mergedData.push({
        id: `humana-${index}`,
        brand_name: item.brand_name,
        indication: item.indication,
        indicated_population: item.indicated_population,
        clinical_criteria: item.clinical_criteria || 'Not available',
        prior_authorization: item.prior_authorization_required === 'Yes' ? 'Prior Authorization' : 'Medical Necessity',
        insurer: 'Humana',
        source_link: item.links || '',
        hcpcs_code: item.hcpcs_code || item.hcpc_code || '',
      });
    });

    // Process Cigna data
    cignaCompetitorData.forEach((item: any, index: number) => {
      mergedData.push({
        id: `cigna-${index}`,
        brand_name: item['Brand Name'] || '',
        indication: item.indication || '',
        indicated_population: item.indicated_population || '',
        clinical_criteria: item.clinical_criteria || 'Not available',
        prior_authorization: item['Prior Authorisation/Medical necessity/notification'] === 'Yes' ? 'Prior Authorization' : 'Medical Necessity',
        insurer: 'Cigna',
        source_link: item.link || '',
        hcpcs_code: item['HCPCS Code'] || '',
      });
    });

    // Process UHC data
    uhcCompetitorData.forEach((item: any, index: number) => {
      mergedData.push({
        id: `uhc-${index}`,
        brand_name: item['Brand Name'] || '',
        indication: item.indication || '',
        indicated_population: item.indicated_population || '',
        clinical_criteria: item.clinical_criteria || 'Not available',
        prior_authorization: item['Prior Authorisation/Medical necessity/notification'] === 'Yes' ? 'Prior Authorization' : 'Medical Necessity',
        insurer: 'UHC',
        source_link: item.link || '',
        hcpcs_code: item['HCPCS Code'] || '',
      });
    });

    return mergedData;
  }, []);

  // Get unique values for filters
  const uniqueIndications = useMemo(() => {
    const indications = [...new Set(processedData.map(item => item.indication))];
    return indications.sort();
  }, [processedData]);

  const uniqueBrands = useMemo(() => {
    const brands = [...new Set(processedData.map(item => item.brand_name))];
    return brands.sort();
  }, [processedData]);

  const uniqueHcpcsCodes = useMemo(() => {
    return getUniqueHCPCSCodesForCompetitorInsights(processedData);
  }, [processedData]);

  // Filter data based on current filters and enabled insurers
  const filteredData = useMemo(() => {
    return processedData.filter(item => {
      const matchesIndication = !filters.indication || item.indication === filters.indication;
      const matchesBrand = !filters.brand || item.brand_name === filters.brand;
      
      // Use the new HCPCS utility for better filtering support
      const matchesHcpcsCode = !filters.hcpcsCode || (() => {
        const hcpcsValue = getHCPCSValueFromItem(item);
        const codes = extractHCPCSCodes(hcpcsValue);
        return codes.includes(filters.hcpcsCode.toUpperCase());
      })();
      
      const matchesInsurer = !filters.insurer || item.insurer.toLowerCase() === filters.insurer.toLowerCase();
      
      // Filter by enabled insurers
      const insurerEnabled = enabledInsurers[item.insurer.toLowerCase() as keyof typeof enabledInsurers];
      
      return matchesIndication && matchesBrand && matchesHcpcsCode && matchesInsurer && insurerEnabled;
    });
  }, [processedData, filters, enabledInsurers]);

  // Calculate indication-level analytics
  const indicationAnalytics = useMemo(() => {
    if (!selectedIndication) return null;

    const indicationData = processedData.filter(item => item.indication === selectedIndication);
    const insurers = ['Aetna', 'Anthem', 'Humana'];
    
    // Coverage by insurer for the selected indication
    const coverageByInsurer = insurers.map(insurer => {
      const total = indicationData.filter(item => item.insurer === insurer).length;
      const covered = total; // Since we only have data for drugs that are covered
      return {
        insurer: insurer.toUpperCase(),
        covered,
        total,
        coverage: total > 0 ? 100 : 0, // 100% since we only show covered drugs
      };
    });

    // Dominant brands for this indication
    const brandCoverage = indicationData.reduce((acc, item) => {
      if (!acc[item.brand_name]) {
        acc[item.brand_name] = { total: 0, covered: 0 };
      }
      acc[item.brand_name].total += 1;
      acc[item.brand_name].covered += 1; // Since we only have covered drugs
      return acc;
    }, {} as Record<string, { total: number; covered: number }>);

    const dominantBrands = Object.entries(brandCoverage)
      .map(([brand, data]) => ({
        brand,
        totalRecords: data.total,
        coverageScore: 100, // 100% since we only show covered drugs
      }))
      .sort((a, b) => b.totalRecords - a.totalRecords);

    return {
      coverageByInsurer,
      dominantBrands,
      totalDrugs: indicationData.length,
      uniqueBrands: [...new Set(indicationData.map(item => item.brand_name))].length,
    };
  }, [selectedIndication, processedData]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    if (field === 'indication') {
      setSelectedIndication(value);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      indication: '',
      brand: '',
      hcpcsCode: '',
      insurer: '',
    });
    setSelectedIndication('');
  };

  const handleInsurerToggle = (insurer: keyof typeof enabledInsurers) => {
    setEnabledInsurers(prev => ({
      ...prev,
      [insurer]: !prev[insurer],
    }));
  };

  const handleExport = (format: 'csv' | 'excel') => {
    console.log(`Exporting data as ${format}`);
    
    if (format === 'csv') {
      exportToCSV();
    } else if (format === 'excel') {
      exportToExcel();
    }
  };

  const exportToCSV = () => {
    try {
      // Prepare data for export
      const dataToExport = filteredData.map(row => ({
        'Brand Name': row.brand_name,
        'Indication': row.indication,
        'Indicated Population': row.indicated_population,
        'Clinical Criteria': row.clinical_criteria || 'Not available',
        'Prior Authorization': row.prior_authorization,
        'Insurer': row.insurer,
        'Source Link': row.source_link
      }));

      // Create CSV content
      const headers = Object.keys(dataToExport[0]);
      const csvContent = [
        headers.join(','),
        ...dataToExport.map(row => 
          headers.map(header => {
            const value = row[header as keyof typeof row] || '';
            // Escape quotes and wrap in quotes if contains comma or newline
            if (typeof value === 'string' && (value.includes(',') || value.includes('\n') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          }).join(',')
        )
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `competitor_insights_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('✅ CSV export completed');
    } catch (error) {
      console.error('❌ CSV export failed:', error);
      alert('Failed to export CSV. Please try again.');
    }
  };

  const exportToExcel = () => {
    try {
      // Prepare data for export
      const dataToExport = filteredData.map(row => ({
        'Brand Name': row.brand_name,
        'Indication': row.indication,
        'Indicated Population': row.indicated_population,
        'Clinical Criteria': row.clinical_criteria || 'Not available',
        'Prior Authorization': row.prior_authorization,
        'Insurer': row.insurer,
        'Source Link': row.source_link
      }));

      // Create HTML table for Excel
      const headers = Object.keys(dataToExport[0]);
      const htmlTable = `
        <table border="1">
          <thead>
            <tr>
              ${headers.map(header => `<th style="background-color: #4285f4; color: white; font-weight: bold;">${header}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${dataToExport.map(row => 
              `<tr>${headers.map(header => `<td>${row[header as keyof typeof row] || ''}</td>`).join('')}</tr>`
            ).join('')}
          </tbody>
        </table>
      `;

      // Create and download file
      const blob = new Blob([htmlTable], { type: 'application/vnd.ms-excel' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `competitor_insights_${new Date().toISOString().split('T')[0]}.xls`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('✅ Excel export completed');
    } catch (error) {
      console.error('❌ Excel export failed:', error);
      alert('Failed to export Excel. Please try again.');
    }
  };

  // Chart colors for consistent theming (will be used in future chart implementations)
  // const chartColors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

  // Define columns for DataGrid
  const columns: GridColDef[] = [
    {
      field: 'brand_name',
      headerName: 'Brand Name',
      width: 150,
      headerClassName: 'data-grid-header',
    },
    {
      field: 'indication',
      headerName: 'Indication',
      width: 160,
      headerClassName: 'data-grid-header',
    },
    {
      field: 'hcpcs_code',
      headerName: 'HCPCS Code',
      width: 160,
      headerClassName: 'data-grid-header',
      renderCell: (params: any) => {
        // Use utility function to get HCPCS value supporting multiple field formats
        const hcpcsValue = getHCPCSValueFromItem(params.row);
        return (
          <CompetitorInsightsHCPCSBadges 
            hcpcsInput={hcpcsValue} 
            size="small"
            maxDisplay={3}
          />
        );
      },
    },
    {
      field: 'indicated_population',
      headerName: 'Indicated Population',
      width: 300,
      headerClassName: 'data-grid-header',
    },
    {
      field: 'clinical_criteria',
      headerName: 'Clinical Criteria (Rationale Use)',
      width: 400,
      headerClassName: 'data-grid-header',
      renderCell: (params: any) => {
        const criteria = params.value;
        const hasContent = criteria && criteria !== 'Not available';
        const truncatedText = hasContent && criteria.length > 100 ? 
          `${criteria.substring(0, 100)}...` : criteria;

        const handleClick = () => {
          if (hasContent) {
            setSelectedClinicalCriteria({
              brand: params.row.brand_name,
              indication: params.row.indication,
              criteria: criteria,
            });
            setClinicalPopupOpen(true);
          }
        };

        return (
          <Box sx={{ whiteSpace: 'normal', wordWrap: 'break-word', py: 1 }}>
            {hasContent ? (
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  color: theme.palette.primary.main,
                  textDecoration: 'underline',
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                    borderRadius: 1,
                    padding: '2px 4px',
                    fontWeight: 'bold',
                  },
                  transition: 'all 0.2s ease',
                }}
                onClick={handleClick}
                title="Click to view full criteria"
              >
                📋 {truncatedText}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                Not available
              </Typography>
            )}
          </Box>
        );
      },
    },
    {
      field: 'prior_authorization',
      headerName: 'Medical Necessity / Prior Authorization',
      width: 200,
      headerClassName: 'data-grid-header',
      renderCell: (params: any) => (
        <Chip
          label={params.value}
          color={params.value === 'Prior Authorization' ? 'warning' : 'info'}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: 'insurer',
      headerName: 'Insurer',
      width: 120,
      headerClassName: 'data-grid-header',
      renderCell: (params: any) => (
        <Chip
          label={params.value}
          color="primary"
          size="small"
          variant="filled"
        />
      ),
    },
    {
      field: 'source_link',
      headerName: 'Source Link',
      width: 120,
      headerClassName: 'data-grid-header',
      renderCell: (params: any) => (
        params.value && params.value !== '' ? (
          <Link
            href={params.value}
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
            sx={{ textDecoration: 'none' }}
          >
            View Policy
          </Link>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            No link
          </Typography>
        )
      ),
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={4}>
        <IconButton onClick={onBack} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Competitor Insights Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Indication-level analysis with cross-comparison of drugs across insurers
          </Typography>
        </Box>
      </Box>

      {/* Primary Filters */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Primary Filters (Indication → Drug → Insurer Hierarchy)
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={3} mt={2} alignItems="start">
            <FormControl sx={{ minWidth: 280 }}>
              <InputLabel>Indication (Disease/Condition)</InputLabel>
              <Select
                value={filters.indication}
                label="Indication (Disease/Condition)"
                onChange={(e) => handleFilterChange('indication', e.target.value)}
                sx={{
                  '& .MuiSelect-icon': {
                    visibility: 'visible',
                    opacity: 1,
                    color: 'rgba(0, 0, 0, 0.54)',
                    right: '12px',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 0, 0, 0.87)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                }}
              >
                <MenuItem value="">All Indications</MenuItem>
                {uniqueIndications.map(indication => (
                  <MenuItem key={indication} value={indication}>
                    {indication}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl sx={{ minWidth: 220 }}>
              <InputLabel>Brand Name</InputLabel>
              <Select
                value={filters.brand}
                label="Brand Name"
                onChange={(e) => handleFilterChange('brand', e.target.value)}
                sx={{
                  '& .MuiSelect-icon': {
                    visibility: 'visible',
                    opacity: 1,
                    color: 'rgba(0, 0, 0, 0.54)',
                    right: '12px',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 0, 0, 0.87)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                }}
              >
                <MenuItem value="">All Brands</MenuItem>
                {uniqueBrands.map(brand => (
                  <MenuItem key={brand} value={brand}>
                    {brand}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel>HCPCS Code</InputLabel>
              <Select
                value={filters.hcpcsCode}
                label="HCPCS Code"
                onChange={(e) => handleFilterChange('hcpcsCode', e.target.value)}
                sx={{
                  '& .MuiSelect-icon': {
                    visibility: 'visible',
                    opacity: 1,
                    color: 'rgba(0, 0, 0, 0.54)',
                    right: '12px',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 0, 0, 0.87)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                }}
              >
                <MenuItem value="">All HCPCS Codes</MenuItem>
                {uniqueHcpcsCodes.map(code => (
                  <MenuItem key={code} value={code}>
                    {code}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Insurer Coverage</InputLabel>
              <Select
                value={filters.insurer}
                label="Insurer Coverage"
                onChange={(e) => handleFilterChange('insurer', e.target.value)}
                sx={{
                  '& .MuiSelect-icon': {
                    visibility: 'visible',
                    opacity: 1,
                    color: 'rgba(0, 0, 0, 0.54)',
                    right: '12px',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 0, 0, 0.87)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                }}
              >
                <MenuItem value="">All Insurers</MenuItem>
                <MenuItem value="aetna">Aetna</MenuItem>
                <MenuItem value="anthem">Anthem</MenuItem>
                <MenuItem value="humana">Humana</MenuItem>
                <MenuItem value="cigna">Cigna</MenuItem>
                <MenuItem value="uhc">UHC</MenuItem>
              </Select>
            </FormControl>            <Button
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={handleClearFilters}
              sx={{ 
                height: '56px', // Match the height of TextField/Select components
                minWidth: '120px',
                alignSelf: 'stretch', // Ensure it stretches to match container height
              }}
            >
              Clear All
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Indication-Level Insights */}
      {selectedIndication && indicationAnalytics && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
                          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
              {selectedIndication} - Comparative Analytics
            </Typography>
            </Typography>
            
            <Box display="flex" flexWrap="wrap" gap={3} mb={3}>
              <Paper sx={{ p: 2, minWidth: 120, textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {indicationAnalytics.totalDrugs}
                </Typography>
                <Typography variant="caption">
                  Total Drug Records
                </Typography>
              </Paper>
              
              <Paper sx={{ p: 2, minWidth: 120, textAlign: 'center' }}>
                <Typography variant="h4" color="secondary">
                  {indicationAnalytics.uniqueBrands}
                </Typography>
                <Typography variant="caption">
                  Unique Brands
                </Typography>
              </Paper>
            </Box>

            {/* Coverage Chart */}
            <Box display="flex" flexWrap="wrap" gap={4}>
              <Box sx={{ flex: 1, minWidth: 400 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Coverage by Insurer (%)
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={indicationAnalytics.coverageByInsurer}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="insurer" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="coverage" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>

              <Box sx={{ flex: 1, minWidth: 300 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Dominant Brands (Coverage Score)
                </Typography>
                <Box>
                  {indicationAnalytics.dominantBrands.slice(0, 5).map((brand, index) => (
                    <Box key={brand.brand} display="flex" justifyContent="space-between" alignItems="center" py={1}>
                      <Typography variant="body2" sx={{ fontWeight: index === 0 ? 'bold' : 'normal' }}>
                        {brand.brand}
                      </Typography>
                      <Chip 
                        label={`${brand.coverageScore}%`}
                        color={brand.coverageScore > 50 ? 'success' : brand.coverageScore > 25 ? 'warning' : 'error'}
                        size="small"
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Tabs for different views */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Data Table" icon={<AssessmentIcon />} />
            <Tab label="Visual Analytics" icon={<BarChartIcon />} />
            <Tab label="Competitor Insights" icon={<TrendingUpIcon />} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {/* Insurer Toggle Controls */}
          <Card sx={{ mb: 3, backgroundColor: '#f8f9fa' }}>
            <CardContent sx={{ py: 2 }}>
              {/* <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                🏥 Filter by Insurer
              </Typography> */}
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Switch
                      checked={enabledInsurers.aetna}
                      onChange={() => handleInsurerToggle('aetna')}
                      color="primary"
                    />
                  }
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip 
                        label="Aetna" 
                        color="primary" 
                        size="small" 
                        variant={enabledInsurers.aetna ? "filled" : "outlined"}
                      />
                      <Typography variant="body2" color="text.secondary">
                        ({processedData.filter(item => item.insurer === 'Aetna').length} records)
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={enabledInsurers.anthem}
                      onChange={() => handleInsurerToggle('anthem')}
                      color="primary"
                    />
                  }
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip 
                        label="Anthem" 
                        color="primary" 
                        size="small" 
                        variant={enabledInsurers.anthem ? "filled" : "outlined"}
                      />
                      <Typography variant="body2" color="text.secondary">
                        ({processedData.filter(item => item.insurer === 'Anthem').length} records)
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={enabledInsurers.humana}
                      onChange={() => handleInsurerToggle('humana')}
                      color="primary"
                    />
                  }
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip 
                        label="Humana" 
                        color="primary" 
                        size="small" 
                        variant={enabledInsurers.humana ? "filled" : "outlined"}
                      />
                      <Typography variant="body2" color="text.secondary">
                        ({processedData.filter(item => item.insurer === 'Humana').length} records)
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={enabledInsurers.cigna}
                      onChange={() => handleInsurerToggle('cigna')}
                      color="primary"
                    />
                  }
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip 
                        label="Cigna" 
                        color="primary" 
                        size="small" 
                        variant={enabledInsurers.cigna ? "filled" : "outlined"}
                      />
                      <Typography variant="body2" color="text.secondary">
                        ({processedData.filter(item => item.insurer === 'Cigna').length} records)
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={enabledInsurers.uhc}
                      onChange={() => handleInsurerToggle('uhc')}
                      color="primary"
                    />
                  }
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip 
                        label="UHC" 
                        color="primary" 
                        size="small" 
                        variant={enabledInsurers.uhc ? "filled" : "outlined"}
                      />
                      <Typography variant="body2" color="text.secondary">
                        ({processedData.filter(item => item.insurer === 'UHC').length} records)
                      </Typography>
                    </Box>
                  }
                />
              </FormGroup>
              {/* <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Toggle insurers on/off to filter the data table below. Active filters: {Object.values(enabledInsurers).filter(Boolean).length}/5 insurers
              </Typography> */}
            </CardContent>
          </Card>

          {/* Data Table */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Drug Coverage Analysis ({filteredData.length} records)
            </Typography>
            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => handleExport('csv')}
                size="small"
              >
                Export CSV
              </Button>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => handleExport('excel')}
                size="small"
              >
                Export Excel
              </Button>
            </Box>
          </Box>
          
          <Box height={500}>
            <DataGrid
              rows={filteredData}
              columns={columns}
              checkboxSelection
              disableRowSelectionOnClick
              pageSizeOptions={[25, 50, 100]}
              getRowHeight={() => 'auto'}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 25, page: 0 },
                },
              }}
              sx={{
                '& .data-grid-header': {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  fontWeight: 'bold',
                },
                '& .MuiDataGrid-cell': {
                  borderRight: `1px solid ${theme.palette.divider}`,
                  padding: '8px',
                },
                '& .MuiDataGrid-row': {
                  minHeight: '60px !important',
                },
              }}
            />
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {/* Visual Analytics */}
          <Typography variant="h6" gutterBottom>
            Visual Analytics Dashboard
          </Typography>
          
          {!selectedIndication ? (
            <Alert severity="info">
              <AlertTitle>Select an Indication</AlertTitle>
              Choose an indication from the filters above to see detailed visual analytics and competitor insights.
            </Alert>
          ) : (
            <Box>
              <Typography variant="body1" color="text.secondary">
                Advanced charts and visual analytics for {selectedIndication} will be displayed here.
                This would include pie charts for market share, trend analyses, and comparative visualizations.
              </Typography>
            </Box>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {/* Competitor Insights */}
          <Typography variant="h6" gutterBottom>
            Competitor Intelligence
          </Typography>
          
          {!selectedIndication ? (
            <Alert severity="info">
              <AlertTitle>Select an Indication</AlertTitle>
              Choose an indication to analyze competitor presence, market gaps, and coverage restrictions.
            </Alert>
          ) : (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Competitive Analysis for {selectedIndication}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                This section would provide insights into:
                • Which drugs are dominant for this indication
                • Coverage gaps across insurers
                • Restrictive policies and prior authorization requirements
                • Market opportunities and competitive threats
              </Typography>
            </Box>
          )}
        </TabPanel>
      </Card>

      {/* Clinical Criteria Popup Dialog */}
      <Dialog
        open={clinicalPopupOpen}
        onClose={() => setClinicalPopupOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { 
            maxHeight: '80vh',
            minHeight: '300px',
          }
        }}
      >
        <DialogTitle sx={{ backgroundColor: theme.palette.primary.main, color: 'white' }}>
          <Typography variant="h6" component="div" fontWeight="bold">
            📋 Clinical Criteria (Rationale Use)
          </Typography>
          {selectedClinicalCriteria && (
            <Typography variant="subtitle1" sx={{ mt: 1, opacity: 0.9 }}>
              {selectedClinicalCriteria.brand} - {selectedClinicalCriteria.indication}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>
            {selectedClinicalCriteria?.criteria || 'No clinical criteria available.'}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setClinicalPopupOpen(false)} 
            color="primary"
            variant="contained"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CompetitorInsights;
