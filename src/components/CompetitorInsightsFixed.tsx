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
import brandCoverageData from '../data/brand_coverage_analysis.json';

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
  const [visibleInsurerColumns, setVisibleInsurerColumns] = useState({
    uhc: true,
    aetna: true,
    anthem: true,
    hcsc: true,
    cigna: true,
    humana: true,
  });

  // Process the data
  const processedData = useMemo(() => {
    return (brandCoverageData as CoverageData[]).map((item, index) => ({
      id: index,
      ...item,
    }));
  }, []);

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
              {selectedIndication} - Competitive Landscape
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
          {/* Enhanced Insurer Column Toggle Controls */}
          <Card variant="outlined" sx={{ mb: 3, p: 2, backgroundColor: '#f8fafc' }}>
            <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
              Insurer Column Visibility
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Toggle individual insurer columns on/off to customize your view
            </Typography>
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
    </Container>
  );
};

export default CompetitorInsights;
