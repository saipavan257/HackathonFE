import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  IconButton,
  Paper,
  useTheme,
  FormControlLabel,
  Switch,
  Tabs,
  Tab,
  Alert,
  AlertTitle,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import brandCoverageData from '../data/brand_coverage_analysis.json';
import aetnaData from '../data/aetna_nuro.json';
import anthemData from '../data/anthem_nuro.json';
import humanaData from '../data/humana_nuro.json';

interface CompetitorInsightsProps {
  onBack: () => void;
}

interface CoverageData {
  brand_name: string;
  indication: string;
  indicated_population: string;
  uhc: string;
  aetna: string;
  anthem: string;
  hcsc: string;
  cigna: string;
  humana: string;
  clinical_criteria?: string;
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

  // Debug logging
  console.log('🔍 Component rendering. Dialog state will be checked...');

  const [filters, setFilters] = useState<FilterState>({
    indication: '',
    brand: '',
    hcpcsCode: '',
    insurer: '',
  });

  const [tabValue, setTabValue] = useState(0);
  const [selectedIndication, setSelectedIndication] = useState<string>('');
  const [visibleInsurerColumns, setVisibleInsurerColumns] = useState({
    uhc: true,
    aetna: true,
    anthem: true,
    hcsc: true,
    cigna: true,
    humana: true,
  });
  
  // Clinical criteria popup state - SIMPLIFIED
  const [clinicalPopupOpen, setClinicalPopupOpen] = useState(false);
  const [selectedClinicalCriteria, setSelectedClinicalCriteria] = useState<{
    brand: string;
    indication: string;
    criteria: string;
  } | null>(null);

  // Simple test function
  const openTestPopup = () => {
    console.log('🔧 Opening test popup...');
    setSelectedClinicalCriteria({
      brand: 'Abecma',
      indication: 'Multiple myeloma',
      criteria: 'Authorization of 3 months may be granted for treatment of relapsed or refractory multiple myeloma in members 18 years of age and older when all of the following criteria are met: A. The member has received prior treatment with at least two lines of therapy...'
    });
    setClinicalPopupOpen(true);
    console.log('✅ Popup state set to true');
  };

  // Debug the current state
  console.log('🔍 Current popup state:', clinicalPopupOpen);
  console.log('🔍 Selected criteria:', selectedClinicalCriteria);

  // Process clinical data from insurer files
  const clinicalDataMap = useMemo(() => {
    const combinedData: Record<string, string> = {};
    
    // Process Aetna data
    (aetnaData as any[]).forEach(item => {
      const key = `${item.brand_name}-${item.indication}`;
      if (item.clinical_criteria) {
        combinedData[key] = item.clinical_criteria;
        console.log('Added Aetna clinical criteria for:', key); // Debug log
      }
    });
    
    // Process Anthem data
    (anthemData as any[]).forEach(item => {
      const key = `${item.brand_name}-${item.indication}`;
      if (item.clinical_criteria && !combinedData[key]) {
        combinedData[key] = item.clinical_criteria;
        console.log('Added Anthem clinical criteria for:', key); // Debug log
      }
    });
    
    // Process Humana data
    (humanaData as any[]).forEach(item => {
      const key = `${item.brand_name}-${item.indication}`;
      if (item.clinical_criteria && !combinedData[key]) {
        combinedData[key] = item.clinical_criteria;
        console.log('Added Humana clinical criteria for:', key); // Debug log
      }
    });
    
    console.log('Final clinical data map:', combinedData); // Debug log
    return combinedData;
  }, []);

  // Process the data
  const processedData = useMemo(() => {
    const data = (brandCoverageData as CoverageData[]).map((item, index) => {
      const key = `${item.brand_name}-${item.indication}`;
      const clinicalCriteria = clinicalDataMap[key] || '';
      
      console.log(`Processing ${key}: clinical criteria length = ${clinicalCriteria.length}`); // Debug log
      
      return {
        id: index,
        ...item,
        clinical_criteria: clinicalCriteria,
      };
    });
    
    console.log('Processed data sample:', data.slice(0, 3)); // Debug log
    return data;
  }, [clinicalDataMap]);

  // Get unique values for filters
  const uniqueIndications = useMemo(() => {
    const indications = [...new Set(processedData.map(item => item.indication))];
    return indications.sort();
  }, [processedData]);

  // Filter data based on current filters
  const filteredData = useMemo(() => {
    return processedData.filter(item => {
      const matchesIndication = !filters.indication || item.indication === filters.indication;
      const matchesBrand = !filters.brand || item.brand_name.toLowerCase().includes(filters.brand.toLowerCase());
      const matchesInsurer = !filters.insurer || 
        (item as any)[filters.insurer.toLowerCase()] === 'Yes';
      
      return matchesIndication && matchesBrand && matchesInsurer;
    });
  }, [processedData, filters]);

  // Calculate indication-level analytics
  const indicationAnalytics = useMemo(() => {
    if (!selectedIndication) return null;

    const indicationData = processedData.filter(item => item.indication === selectedIndication);
    const insurers = ['uhc', 'aetna', 'anthem', 'hcsc', 'cigna', 'humana'];
    
    // Coverage by insurer for the selected indication
    const coverageByInsurer = insurers.map(insurer => {
      const total = indicationData.length;
      const covered = indicationData.filter(item => (item as any)[insurer] === 'Yes').length;
      return {
        insurer: insurer.toUpperCase(),
        covered,
        total,
        coverage: total > 0 ? Math.round((covered / total) * 100) : 0,
      };
    });

    // Dominant brands for this indication
    const brandCoverage = indicationData.reduce((acc, item) => {
      if (!acc[item.brand_name]) {
        acc[item.brand_name] = { total: 0, covered: 0 };
      }
      acc[item.brand_name].total += 1;
      
      const coverageCount = insurers.reduce((count, insurer) => {
        return count + ((item as any)[insurer] === 'Yes' ? 1 : 0);
      }, 0);
      
      acc[item.brand_name].covered += coverageCount;
      return acc;
    }, {} as Record<string, { total: number; covered: number }>);

    const dominantBrands = Object.entries(brandCoverage)
      .map(([brand, data]) => ({
        brand,
        totalRecords: data.total,
        coverageScore: Math.round((data.covered / (data.total * insurers.length)) * 100),
      }))
      .sort((a, b) => b.coverageScore - a.coverageScore);

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

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    console.log(`Exporting data as ${format}`);
    // Implementation would go here
  };

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
      field: 'indicated_population',
      headerName: 'Population',
      width: 300,
      headerClassName: 'data-grid-header',
    },
    {
      field: 'clinical_criteria',
      headerName: 'Clinical Criteria (Rationale Use)',
      width: 350,
      headerClassName: 'data-grid-header',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => {
        const criteria = params.value || '';
        const truncatedText = criteria.length > 50 ? criteria.substring(0, 50) + '...' : criteria;
        
        if (!criteria) {
          return (
            <Typography variant="body2" color="text.secondary" sx={{ p: 1 }}>
              No criteria available
            </Typography>
          );
        }
        
        return (
          <Box sx={{ p: 1, width: '100%' }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: theme.palette.primary.main,
                cursor: 'pointer',
                textDecoration: 'underline',
                '&:hover': { fontWeight: 'bold' }
              }}
              onClick={() => openTestPopup()}
            >
              📋 {truncatedText}
            </Typography>
          </Box>
        );
      },
    },
    ...(Object.entries(visibleInsurerColumns)
      .filter(([_, visible]) => visible)
      .map(([insurer, _]) => ({
        field: insurer,
        headerName: insurer.toUpperCase(),
        width: 100,
        headerClassName: 'data-grid-header',
        renderCell: (params: any) => (
          <Chip
            label={params.value}
            color={params.value === 'Yes' ? 'success' : 'error'}
            size="small"
            variant="outlined"
          />
        ),
      }))),
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={4}>
        <IconButton onClick={onBack} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Competitor Insights Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Indication-level analysis with cross-comparison of drugs across insurers
          </Typography>
        </Box>
        
        {/* PROMINENT TEST BUTTON */}
        <Button
          variant="contained"
          color="error"
          size="large"
          onClick={openTestPopup}
          sx={{ 
            ml: 2, 
            fontWeight: 'bold',
            fontSize: '1.2rem',
            px: 3,
            py: 1.5,
            boxShadow: 4,
            '&:hover': {
              boxShadow: 8,
              transform: 'scale(1.05)',
            }
          }}
        >
          🚨 CLICK HERE TO TEST POPUP 🚨
        </Button>
      </Box>

      {/* Primary Filters */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Primary Filters (Indication → Drug → Insurer Hierarchy)
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={3} mt={2}>
            <FormControl sx={{ minWidth: 250 }}>
              <InputLabel>Indication (Disease/Condition)</InputLabel>
              <Select
                value={filters.indication}
                label="Indication (Disease/Condition)"
                onChange={(e) => handleFilterChange('indication', e.target.value)}
              >
                <MenuItem value="">All Indications</MenuItem>
                {uniqueIndications.map(indication => (
                  <MenuItem key={indication} value={indication}>
                    {indication}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              label="Brand Name"
              value={filters.brand}
              onChange={(e) => handleFilterChange('brand', e.target.value)}
              placeholder="Search brands..."
              sx={{ minWidth: 200 }}
            />
            
            <TextField
              label="HCPCS Code"
              value={filters.hcpcsCode}
              onChange={(e) => handleFilterChange('hcpcsCode', e.target.value)}
              placeholder="Enter HCPCS code..."
              sx={{ minWidth: 150 }}
            />
            
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Insurer Coverage</InputLabel>
              <Select
                value={filters.insurer}
                label="Insurer Coverage"
                onChange={(e) => handleFilterChange('insurer', e.target.value)}
              >
                <MenuItem value="">All Insurers</MenuItem>
                <MenuItem value="uhc">UHC</MenuItem>
                <MenuItem value="aetna">Aetna</MenuItem>
                <MenuItem value="anthem">Anthem</MenuItem>
                <MenuItem value="hcsc">HCSC</MenuItem>
                <MenuItem value="cigna">Cigna</MenuItem>
                <MenuItem value="humana">Humana</MenuItem>
              </Select>
            </FormControl>
            
            <Button
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={handleClearFilters}
              sx={{ height: 'fit-content', mt: 1 }}
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
              {selectedIndication} - Comparative Analytics
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
                    <RechartsTooltip />
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
          {/* Enhanced Insurer Column Toggle Controls */}
          <Card variant="outlined" sx={{ mb: 3, p: 2, backgroundColor: '#f8fafc' }}>
            <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
              Insurer Column Visibility
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Toggle individual insurer columns on/off to customize your view
            </Typography>
            
            {/* Debug info */}
            <Box sx={{ mb: 2, p: 2, backgroundColor: theme.palette.warning.light + '20', borderRadius: 1 }}>
              <Typography variant="caption" color="error" sx={{ display: 'block', fontWeight: 'bold' }}>
                🔧 DEBUG INFO: Popup State = {clinicalPopupOpen ? '🟢 OPEN' : '🔴 CLOSED'} | Selected = {selectedClinicalCriteria ? '✅ YES' : '❌ NO'}
              </Typography>
              {selectedClinicalCriteria && (
                <Typography variant="caption" color="success.main" sx={{ display: 'block' }}>
                  Selected: {selectedClinicalCriteria.brand} - {selectedClinicalCriteria.indication}
                </Typography>
              )}
              <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                <Button 
                  size="small" 
                  variant="contained" 
                  color="success"
                  onClick={() => setClinicalPopupOpen(true)}
                >
                  Force Open
                </Button>
                <Button 
                  size="small" 
                  variant="contained" 
                  color="error"
                  onClick={() => setClinicalPopupOpen(false)}
                >
                  Force Close
                </Button>
                <Button 
                  size="small" 
                  variant="outlined"
                  onClick={() => {
                    setSelectedClinicalCriteria({
                      brand: 'Debug Test',
                      indication: 'Debug Indication', 
                      criteria: 'This is a debug test criteria to verify the popup works.'
                    });
                    setClinicalPopupOpen(true);
                  }}
                >
                  Set Data & Open
                </Button>
              </Box>
            </Box>
            
            <Box display="flex" flexWrap="wrap" gap={2}>
              {Object.entries(visibleInsurerColumns).map(([insurer, visible]) => (
                <Card 
                  key={insurer}
                  variant="outlined" 
                  sx={{ 
                    p: 1.5, 
                    minWidth: 120,
                    backgroundColor: visible ? theme.palette.primary.light : theme.palette.grey[100],
                    borderColor: visible ? theme.palette.primary.main : theme.palette.grey[300],
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: theme.shadows[2],
                      transform: 'translateY(-1px)',
                    }
                  }}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={visible}
                        onChange={() => setVisibleInsurerColumns(prev => ({
                          ...prev,
                          [insurer]: !prev[insurer as keyof typeof prev],
                        }))}
                        size="small"
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: theme.palette.primary.main,
                          },
                        }}
                      />
                    }
                    label={
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 600,
                          color: visible ? theme.palette.primary.contrastText : theme.palette.text.primary
                        }}
                      >
                        {insurer.toUpperCase()}
                      </Typography>
                    }
                    sx={{ margin: 0 }}
                  />
                </Card>
              ))}
            </Box>
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => setVisibleInsurerColumns({
                  uhc: true, aetna: true, anthem: true, hcsc: true, cigna: true, humana: true
                })}
              >
                Show All
              </Button>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => setVisibleInsurerColumns({
                  uhc: false, aetna: false, anthem: false, hcsc: false, cigna: false, humana: false
                })}
              >
                Hide All
              </Button>
            </Box>
          </Card>

          {/* Data Table */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Drug Coverage Analysis ({filteredData.length} records)
            </Typography>
            <Box display="flex" gap={2}>
              <Button
                variant="contained"
                color="error"
                size="large"
                onClick={openTestPopup}
                sx={{ mr: 2, fontWeight: 'bold' }}
              >
                🚨 OPEN POPUP TEST
              </Button>
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
              checkboxSelection={false}
              disableRowSelectionOnClick={true}
              disableColumnSelector={true}
              pageSizeOptions={[25, 50, 100]}
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
                  '&:focus': {
                    outline: 'none',
                  },
                  '&:focus-within': {
                    outline: 'none',
                  },
                },
                '& .MuiDataGrid-row': {
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
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

      {/* Clinical Criteria Popup Dialog - SIMPLIFIED & ENHANCED */}
      <Dialog
        open={clinicalPopupOpen}
        onClose={() => {
          console.log('❌ Dialog closing via backdrop/ESC');
          setClinicalPopupOpen(false);
        }}
        maxWidth="lg"
        fullWidth
        disableEscapeKeyDown={false}
        PaperProps={{
          sx: { 
            maxHeight: '90vh',
            minHeight: '400px',
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[24],
            border: `3px solid ${theme.palette.primary.main}`,
          }
        }}
        sx={{
          zIndex: 9999,
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          }
        }}
      >
        <DialogTitle sx={{ 
          backgroundColor: theme.palette.error.main, 
          color: 'white',
          textAlign: 'center',
          py: 3
        }}>
          <Typography variant="h4" component="div" fontWeight="bold">
            🔬 CLINICAL CRITERIA POPUP
          </Typography>
          <Typography variant="h6" sx={{ mt: 1, opacity: 0.9 }}>
            This dialog is working! 🎉
          </Typography>
          {selectedClinicalCriteria && (
            <Typography variant="subtitle1" sx={{ mt: 2, opacity: 0.9, backgroundColor: 'rgba(255,255,255,0.2)', p: 1, borderRadius: 1 }}>
              📋 {selectedClinicalCriteria.brand} - {selectedClinicalCriteria.indication}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent dividers sx={{ p: 4, fontSize: '1.2rem' }}>
          <Typography variant="h6" color="success.main" sx={{ mb: 2 }}>
            ✅ SUCCESS: The popup dialog is functioning correctly!
          </Typography>
          <Typography variant="body1" sx={{ 
            whiteSpace: 'pre-line', 
            lineHeight: 1.8, 
            fontSize: '1.1rem',
            backgroundColor: theme.palette.grey[50],
            p: 2,
            borderRadius: 1,
            border: `1px solid ${theme.palette.grey[300]}`
          }}>
            {selectedClinicalCriteria?.criteria || 'No clinical criteria data available.'}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, backgroundColor: theme.palette.grey[50], justifyContent: 'center' }}>
          <Button 
            onClick={() => {
              console.log('✅ Close button clicked');
              setClinicalPopupOpen(false);
            }} 
            color="error"
            variant="contained"
            size="large"
            sx={{ px: 4, py: 1 }}
          >
            CLOSE POPUP
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CompetitorInsights;
