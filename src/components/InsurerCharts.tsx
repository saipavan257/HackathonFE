import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Card,
  CardContent,
  useTheme,
  Stack,
  Divider,
  TextField,
  Autocomplete,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link,
  IconButton,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import {
  Business as BusinessIcon,
  People as PeopleIcon,
  LocalPharmacy as PharmacyIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Close as CloseIcon,
  OpenInNew as OpenInNewIcon,
  Security as SecurityIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  ComposedChart
} from 'recharts';

// Import enhanced data processing utilities
import { 
  getProcessedInsurerData, 
  getFilterOptions, 
  type InsurerCoverageInfo 
} from '../utils/insurerDataProcessor';

// Import insurer description data
import insurerDescriptions from '../data/insurer_description.json';

interface InsurerChartsProps {
  selectedFilters?: {
    indication?: string;
    brand?: string;
    hcpcsCode?: string;
  };
}

const InsurerCharts: React.FC<InsurerChartsProps> = ({ selectedFilters = {} }) => {
  const theme = useTheme();
  const [chartType, setChartType] = useState<'bar' | 'pie' | 'line' | 'composed'>('bar');
  const [sortBy, setSortBy] = useState<'lives' | 'percentage' | 'name' | 'drugCount'>('lives');
  const [localFilters, setLocalFilters] = useState(selectedFilters);
  const [selectedInsurerPopup, setSelectedInsurerPopup] = useState<string | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);

  // Get filter options
  const filterOptions = useMemo(() => getFilterOptions(), []);

  // Combine external and local filters
  const activeFilters = { ...selectedFilters, ...localFilters };

  // Color palette for charts
  const colors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    '#8884d8',
    '#82ca9d',
    '#ffc658',
    '#ff7300',
    '#00ff88',
    '#ff0088'
  ];

  // Process coverage data with filters
  const processedData: InsurerCoverageInfo[] = useMemo(() => {
    return getProcessedInsurerData(activeFilters);
  }, [activeFilters]);

  // Sort data based on selection
  const sortedData = useMemo(() => {
    const sorted = [...processedData];
    switch (sortBy) {
      case 'lives':
        return sorted.sort((a, b) => b.numericLives - a.numericLives);
      case 'percentage':
        return sorted.sort((a, b) => b.numericPercentage - a.numericPercentage);
      case 'drugCount':
        return sorted.sort((a, b) => b.drugCount - a.drugCount);
      case 'name':
        return sorted.sort((a, b) => a.insurer.localeCompare(b.insurer));
      default:
        return sorted;
    }
  }, [processedData, sortBy]);

  // Calculate totals
  const totalCoverage = processedData.reduce((sum, item) => sum + item.numericLives, 0);
  const totalDrugs = processedData.reduce((sum, item) => sum + item.drugCount, 0);

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Paper sx={{ p: 2, maxWidth: 300 }}>
          <Typography variant="subtitle2" gutterBottom>
            {data.insurer}
          </Typography>
          <Typography variant="body2">
            Covered Lives: {data.approx_covered_lives}
          </Typography>
          <Typography variant="body2">
            US Population: {data.percentage_us_population}
          </Typography>
          <Typography variant="body2">
            Drug Coverage: {data.drugCount} drugs
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {data.notes.split('.')[0]}...
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  // Clear all filters
  const clearFilters = () => {
    setLocalFilters({});
  };

  // Update local filter
  const updateFilter = (filterType: 'indication' | 'brand' | 'hcpcsCode', value: string | null) => {
    setLocalFilters(prev => ({
      ...prev,
      [filterType]: value || undefined
    }));
  };

  // Handle insurer card click to show popup
  const handleInsurerClick = (insurerName: string) => {
    // Map display names to insurer keys
    const insurerKeyMap: Record<string, string> = {
      'UnitedHealthcare': 'uhc',
      'Cigna Healthcare': 'cigna', 
      'Aetna': 'aetna',
      'Anthem': 'anthem',
      'Centene': 'centene',
      'Humana': 'humana'
    };

    const key = insurerKeyMap[insurerName] || insurerName.toLowerCase().replace(/\s+/g, '');
    setSelectedInsurerPopup(key);
    setPopupOpen(true);
  };

  // Close popup
  const handleClosePopup = () => {
    setPopupOpen(false);
    setSelectedInsurerPopup(null);
  };

  // Get insurer data for popup
  const getInsurerData = (key: string) => {
    return (insurerDescriptions as any)[key] || null;
  };

  // Render bar chart
  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={sortedData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="shortName" 
          angle={-45}
          textAnchor="end"
          height={80}
          fontSize={12}
        />
        <YAxis 
          label={{ value: 'Covered Lives (Millions)', angle: -90, position: 'insideLeft' }}
          fontSize={12}
        />
        <RechartsTooltip content={<CustomTooltip />} />
        <Legend />
        <Bar 
          dataKey="numericLives" 
          name="Covered Lives (Millions)"
          fill={theme.palette.primary.main}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );

  // Render pie chart
  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={sortedData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={(entry: any) => `${entry.shortName} (${entry.numericPercentage}%)`}
          outerRadius={120}
          fill="#8884d8"
          dataKey="numericLives"
        >
          {sortedData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <RechartsTooltip content={<CustomTooltip />} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );

  // Render line chart
  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={sortedData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="shortName" 
          angle={-45}
          textAnchor="end"
          height={80}
          fontSize={12}
        />
        <YAxis 
          label={{ value: 'US Population %', angle: -90, position: 'insideLeft' }}
          fontSize={12}
        />
        <RechartsTooltip content={<CustomTooltip />} />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="numericPercentage" 
          name="US Population %"
          stroke={theme.palette.primary.main}
          strokeWidth={3}
          dot={{ fill: theme.palette.primary.main, strokeWidth: 2, r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  // Render composed chart
  const renderComposedChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={sortedData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="shortName" 
          angle={-45}
          textAnchor="end"
          height={80}
          fontSize={12}
        />
        <YAxis yAxisId="left" label={{ value: 'Covered Lives (M)', angle: -90, position: 'insideLeft' }} />
        <YAxis yAxisId="right" orientation="right" label={{ value: 'Drug Count', angle: 90, position: 'insideRight' }} />
        <RechartsTooltip content={<CustomTooltip />} />
        <Legend />
        <Bar yAxisId="left" dataKey="numericLives" name="Covered Lives (M)" fill={theme.palette.primary.main} />
        <Line yAxisId="right" type="monotone" dataKey="drugCount" name="Drug Count" stroke={theme.palette.secondary.main} strokeWidth={3} />
      </ComposedChart>
    </ResponsiveContainer>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box mb={4}>
        {/* <Typography variant="h4" component="h1" gutterBottom>
          Insurance Coverage Analytics
        </Typography> */}
        <Typography variant="body1" color="text.secondary" mb={3}>
          Visualize insurer market coverage and drug formulary data across the United States
        </Typography>

        {/* Filters Section */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterIcon />
              Data Filters
            </Typography>
            {(activeFilters.indication || activeFilters.brand || activeFilters.hcpcsCode) && (
              <Button
                startIcon={<ClearIcon />}
                onClick={clearFilters}
                variant="outlined"
                size="small"
              >
                Clear Filters
              </Button>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Autocomplete
                value={activeFilters.indication || null}
                onChange={(_, value) => updateFilter('indication', value)}
                options={filterOptions.indications}
                renderInput={(params) => (
                  <TextField {...params} label="Indication" placeholder="Select indication" />
                )}
                size="small"
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Autocomplete
                value={activeFilters.brand || null}
                onChange={(_, value) => updateFilter('brand', value)}
                options={filterOptions.brands}
                renderInput={(params) => (
                  <TextField {...params} label="Brand" placeholder="Select brand" />
                )}
                size="small"
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Autocomplete
                value={activeFilters.hcpcsCode || null}
                onChange={(_, value) => updateFilter('hcpcsCode', value || null)}
                options={filterOptions.hcpcsCodes}
                renderInput={(params) => (
                  <TextField {...params} label="HCPCS Code" placeholder="Select HCPCS code" />
                )}
                size="small"
              />
            </Box>
          </Box>

          {/* Active Filters Display */}
          {(activeFilters.indication || activeFilters.brand || activeFilters.hcpcsCode) && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Active Filters:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {activeFilters.indication && (
                  <Chip 
                    label={`Indication: ${activeFilters.indication}`} 
                    color="primary" 
                    size="small" 
                    onDelete={() => updateFilter('indication', null)}
                  />
                )}
                {activeFilters.brand && (
                  <Chip 
                    label={`Brand: ${activeFilters.brand}`} 
                    color="secondary" 
                    size="small" 
                    onDelete={() => updateFilter('brand', null)}
                  />
                )}
                {activeFilters.hcpcsCode && (
                  <Chip 
                    label={`HCPCS: ${activeFilters.hcpcsCode}`} 
                    color="info" 
                    size="small" 
                    onDelete={() => updateFilter('hcpcsCode', null)}
                  />
                )}
              </Stack>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1 1 250px', minWidth: 250 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <BusinessIcon color="primary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" color="primary.main">
                    {processedData.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Insurers
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 250px', minWidth: 250 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <PeopleIcon color="secondary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" color="secondary.main">
                    {totalCoverage.toFixed(1)}M
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Coverage
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 250px', minWidth: 250 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <PharmacyIcon color="info" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" color="info.main">
                    {totalDrugs}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Drug Coverage
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 250px', minWidth: 250 }}>
          <Card>
            <CardContent>
              <Box>
                <Typography variant="h4" color="warning.main">
                  {Math.max(...processedData.map(d => d.numericPercentage)).toFixed(1)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Highest Coverage
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Chart Controls */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'center' }}>
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <FormControl fullWidth>
              <InputLabel>Chart Type</InputLabel>
              <Select
                value={chartType}
                label="Chart Type"
                onChange={(e) => setChartType(e.target.value as 'bar' | 'pie' | 'line' | 'composed')}
              >
                <MenuItem value="bar">Bar Chart</MenuItem>
                <MenuItem value="pie">Pie Chart</MenuItem>
                <MenuItem value="line">Line Chart</MenuItem>
                <MenuItem value="composed">Combined Chart</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ flex: 1, minWidth: 200 }}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value as 'lives' | 'percentage' | 'name' | 'drugCount')}
              >
                <MenuItem value="lives">Covered Lives</MenuItem>
                <MenuItem value="percentage">US Population %</MenuItem>
                <MenuItem value="drugCount">Drug Count</MenuItem>
                <MenuItem value="name">Insurer Name</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Paper>

      {/* Chart Display */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {chartType === 'bar' && 'Coverage by Insurer (Bar Chart)'}
          {chartType === 'pie' && 'Market Share Distribution (Pie Chart)'}
          {chartType === 'line' && 'Population Coverage Trend (Line Chart)'}
          {chartType === 'composed' && 'Coverage vs Drug Count Analysis (Combined Chart)'}
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        {chartType === 'bar' && renderBarChart()}
        {chartType === 'pie' && renderPieChart()}
        {chartType === 'line' && renderLineChart()}
        {chartType === 'composed' && renderComposedChart()}
      </Paper>

      {/* Data Summary Grid */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Coverage Data Summary
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {sortedData.map((insurer) => (
            <Box sx={{ flex: '1 1 300px', minWidth: 300 }} key={insurer.insurer}>
              <Card 
                variant="outlined"
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[6],
                    backgroundColor: theme.palette.action.hover,
                  }
                }}
                onClick={() => handleInsurerClick(insurer.insurer)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="subtitle1" gutterBottom noWrap sx={{ flex: 1 }}>
                      {insurer.insurer}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color="primary" 
                      sx={{ 
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        whiteSpace: 'nowrap',
                        ml: 1
                      }}
                    >
                      Click to view more
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Lives: {insurer.approx_covered_lives}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Coverage: {insurer.percentage_us_population}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Drugs: {insurer.drugCount} covered
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Brands: {insurer.uniqueBrands.length} unique
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Insurer Details Popup */}
      <Dialog
        open={popupOpen}
        onClose={handleClosePopup}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxHeight: '90vh',
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" component="div">
              {selectedInsurerPopup && getInsurerData(selectedInsurerPopup)?.insurer}
            </Typography>
            <IconButton onClick={handleClosePopup} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedInsurerPopup && getInsurerData(selectedInsurerPopup) && (() => {
            const data = getInsurerData(selectedInsurerPopup);
            const overview = data?.overview;
            if (!overview) return null;

            return (
              <Box sx={{ py: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                              
                              {/* Company Overview at the top */}
                              {overview.companyDescription && (
                                <Card elevation={3} sx={{ backgroundColor: '#F8FAFC', border: '2px solid #3B82F6' }}>
                                  <CardContent sx={{ p: 4 }}>
                                    <Typography variant="h5" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                      <BusinessIcon sx={{ fontSize: 32 }} />
                                      Company Overview
                                    </Typography>
                                    <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1.1rem', whiteSpace: 'pre-line' }}>
                                      {overview.companyDescription}
                                    </Typography>
                                  </CardContent>
                                </Card>
                              )}
                  
                              {/* Company Background and Market Position - Side by Side */}
                              {(overview.companyBackground || overview.membershipAndMarketShare) && (
                                <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' }, mb: 3 }}>
                                  {/* Company Background Card - 50% */}
                                  {overview.companyBackground && (
                                    <Box sx={{ flex: '1 1 50%' }}>
                                      <Card elevation={2} sx={{ height: '100%' }}>
                                    <CardContent>
                                      <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <BusinessIcon />
                                        Company Background
                                      </Typography>
                                      <Divider sx={{ mb: 2 }} />
                                      <Stack spacing={2}>
                                        {overview.companyBackground?.parentCompany && (
                                          <Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                                              Parent Company
                                            </Typography>
                                            <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: 'pre-line' }}>
                                              {overview.companyBackground.parentCompany}
                                            </Typography>
                                          </Box>
                                        )}
                                        {overview.companyBackground?.headquarters && (
                                          <Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                                              Headquarters
                                            </Typography>
                                            <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: 'pre-line' }}>
                                              {overview.companyBackground.headquarters}
                                            </Typography>
                                          </Box>
                                        )}
                                        {overview.companyBackground?.scale && (
                                          <Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                                              Market Scale
                                            </Typography>
                                            <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: 'pre-line' }}>
                                              {overview.companyBackground.scale}
                                            </Typography>
                                          </Box>
                                        )}
                                        {overview.companyBackground?.coreBusinessAreas && Object.keys(overview.companyBackground.coreBusinessAreas).length > 0 && (
                                          <Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                                              Core Business Areas
                                            </Typography>
                                            <Stack spacing={1.5} sx={{ mt: 1 }}>
                                              {Object.entries(overview.companyBackground.coreBusinessAreas).map(([key, value]) => (
                                                <Paper key={key} variant="outlined" sx={{ p: 2, backgroundColor: '#FAFBFC' }}>
                                                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
                                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                                  </Typography>
                                                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                                                    {String(value)}
                                                  </Typography>
                                                </Paper>
                                              ))}
                                            </Stack>
                                          </Box>
                                        )}
                                      </Stack>
                                    </CardContent>
                                  </Card>
                                </Box>
                                )}

                                {/* Market Position Card - 50% */}
                                {overview.membershipAndMarketShare && (
                                  <Box sx={{ flex: '1 1 50%' }}>
                                  <Card elevation={2} sx={{ height: '100%' }}>
                                    <CardContent>
                                      <Typography variant="h6" gutterBottom color="secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <PeopleIcon />
                                        Market Position
                                      </Typography>
                                      <Divider sx={{ mb: 2 }} />
                                      <Stack spacing={2}>
                                        {overview.membershipAndMarketShare?.usMedicalMembers && (
                                          <Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                                              US Medical Members
                                            </Typography>
                                            <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 600, color: 'primary.main' }}>
                                              {overview.membershipAndMarketShare.usMedicalMembers}
                                            </Typography>
                                          </Box>
                                        )}
                                        {(overview.membershipAndMarketShare?.marketShare || overview.membershipAndMarketShare?.marketShareUS) && (
                                          <Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                                              Market Share
                                            </Typography>
                                            <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 600, color: 'secondary.main' }}>
                                              {overview.membershipAndMarketShare.marketShare || overview.membershipAndMarketShare.marketShareUS}
                                            </Typography>
                                          </Box>
                                        )}
                                        {overview.membershipAndMarketShare?.globalCustomerRelationships && (
                                          <Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                                              Global Customer Relationships
                                            </Typography>
                                            <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 600, color: 'info.main' }}>
                                              {overview.membershipAndMarketShare.globalCustomerRelationships}
                                            </Typography>
                                          </Box>
                                        )}
                                        {overview.membershipAndMarketShare?.membershipMix && Object.keys(overview.membershipAndMarketShare.membershipMix).length > 0 && (
                                          <Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                                              Membership Mix
                                            </Typography>
                                            <Paper variant="outlined" sx={{ mt: 1, p: 2, backgroundColor: '#FAFBFC' }}>
                                              <Stack spacing={1}>
                                                {Object.entries(overview.membershipAndMarketShare.membershipMix).map(([key, value]) => (
                                                  <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', py: 0.5 }}>
                                                    <Typography variant="body2" sx={{ fontSize: '0.9rem', flex: 1, mr: 2 }}>
                                                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ fontSize: '0.9rem', fontWeight: 600, color: 'secondary.main', textAlign: 'right', whiteSpace: 'pre-line' }}>
                                                      {String(value)}
                                                    </Typography>
                                                  </Box>
                                                ))}
                                              </Stack>
                                            </Paper>
                                          </Box>
                                        )}
                                      </Stack>
                                    </CardContent>
                                  </Card>
                                  </Box>
                                )}
                                </Box>
                              )}
                  
                              {/* Strengths and Limitations - Side by Side 50% each */}
                              {((overview.strengths && overview.strengths.length > 0) || (overview.limitations && overview.limitations.length > 0)) && (
                                <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' }, mb: 3 }}>
                                {/* Strengths - 50% */}
                                {overview.strengths && overview.strengths.length > 0 && (
                                  <Box sx={{ flex: '1 1 50%' }}>
                                    <Card elevation={2} sx={{ border: '1px solid #10B981', height: '100%' }}>
                                      <CardContent>
                                        <Typography variant="h6" gutterBottom color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                          <SecurityIcon />
                                          Key Strengths
                                        </Typography>
                                        <Divider sx={{ mb: 2 }} />
                                        <List dense>
                                          {overview.strengths.map((strength: string, index: number) => (
                                            <ListItem key={index} sx={{ pl: 0 }}>
                                              <ListItemText 
                                                primary={`• ${strength}`} 
                                                slotProps={{
                                                  primary: { variant: 'body2', sx: { lineHeight: 1.6 } }
                                                }}
                                              />
                                            </ListItem>
                                          ))}
                                        </List>
                                      </CardContent>
                                    </Card>
                                  </Box>
                                )}

                                {/* Limitations - 50% */}
                                {overview.limitations && overview.limitations.length > 0 && (
                                  <Box sx={{ flex: '1 1 50%' }}>
                                    <Card elevation={2} sx={{ border: '1px solid #F59E0B', height: '100%' }}>
                                      <CardContent>
                                        <Typography variant="h6" gutterBottom color="warning.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                          <AssessmentIcon />
                                          Limitations
                                        </Typography>
                                        <Divider sx={{ mb: 2 }} />
                                        <List dense>
                                          {overview.limitations.map((limitation: string, index: number) => (
                                            <ListItem key={index} sx={{ pl: 0 }}>
                                              <ListItemText 
                                                primary={`• ${limitation}`} 
                                                slotProps={{
                                                  primary: { variant: 'body2', sx: { lineHeight: 1.6 } }
                                                }}
                                              />
                                            </ListItem>
                                          ))}
                                        </List>
                                      </CardContent>
                                    </Card>
                                  </Box>
                                )}
                                </Box>
                              )}

                              {/* Pharmacy and Medical Benefits - Side by Side 50% each */}
                              {(overview.benefitTypes?.pharmacyBenefit || overview.benefitTypes?.medicalBenefit) && (
                                <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' }, mb: 3 }}>
                                {/* Pharmacy Benefits - 50% */}
                                {overview.benefitTypes?.pharmacyBenefit && (
                                  <Box sx={{ flex: '1 1 50%' }}>
                                    <Card elevation={2} sx={{ height: '100%' }}>
                                      <CardContent>
                                        <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                          <PharmacyIcon />
                                          Pharmacy Benefits
                                        </Typography>
                                        <Divider sx={{ mb: 2 }} />
                                        <Stack spacing={2}>
                                          {overview.benefitTypes.pharmacyBenefit.managedBy && (
                                            <Box>
                                              <Typography variant="subtitle2" color="primary">Managed By:</Typography>
                                              <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{overview.benefitTypes.pharmacyBenefit.managedBy}</Typography>
                                            </Box>
                                          )}
                                          {overview.benefitTypes.pharmacyBenefit.coverage && (
                                            <Box>
                                              <Typography variant="subtitle2" color="primary">Coverage:</Typography>
                                              <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{overview.benefitTypes.pharmacyBenefit.coverage}</Typography>
                                            </Box>
                                          )}
                                        </Stack>
                                      </CardContent>
                                    </Card>
                                  </Box>
                                )}

                                {/* Medical Benefits - 50% */}
                                {overview.benefitTypes?.medicalBenefit && (
                                  <Box sx={{ flex: '1 1 50%' }}>
                                    <Card elevation={2} sx={{ height: '100%' }}>
                                      <CardContent>
                                        <Typography variant="h6" gutterBottom color="secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                          <AssessmentIcon />
                                          Medical Benefits
                                        </Typography>
                                        <Divider sx={{ mb: 2 }} />
                                        <Stack spacing={2}>
                                          {overview.benefitTypes.medicalBenefit.coverage && Array.isArray(overview.benefitTypes.medicalBenefit.coverage) && (
                                            <Box>
                                              <Typography variant="subtitle2" color="secondary">Coverage:</Typography>
                                              <List dense sx={{ pl: 1 }}>
                                                {overview.benefitTypes.medicalBenefit.coverage.map((item: string, index: number) => (
                                                  <ListItem key={index} sx={{ pl: 0, py: 0.25 }}>
                                                    <ListItemText 
                                                      primary={`• ${item}`} 
                                                      slotProps={{
                                                        primary: { variant: 'body2', sx: { fontSize: '0.9rem' } }
                                                      }}
                                                    />
                                                  </ListItem>
                                                ))}
                                              </List>
                                            </Box>
                                          )}
                                          {overview.benefitTypes.medicalBenefit.billingCodes && (
                                            <Box>
                                              <Typography variant="subtitle2" color="secondary">Billing Codes:</Typography>
                                              <Typography variant="body2">{overview.benefitTypes.medicalBenefit.billingCodes}</Typography>
                                            </Box>
                                          )}
                                        </Stack>
                                      </CardContent>
                                    </Card>
                                  </Box>
                                )}
                                </Box>
                              )}
                  
                              {/* Drug Management Programs - 100% width with child divs at 50% each */}
                              {overview.medicalBenefitDrugManagement?.programs && overview.medicalBenefitDrugManagement.programs.length > 0 && (
                                <Card elevation={2} sx={{ mb: 3 }}>
                                  <CardContent>
                                    <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <PharmacyIcon />
                                      Drug Management Programs
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Box sx={{ 
                                      display: 'flex', 
                                      flexDirection: { xs: 'column', md: 'row' }, 
                                      flexWrap: 'wrap',
                                      gap: 3 
                                    }}>
                                      {overview.medicalBenefitDrugManagement.programs.map((program: any, index: number) => (
                                        <Box key={index} sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                                          <Paper elevation={1} sx={{ p: 2, backgroundColor: '#F8F9FA', height: '100%' }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
                                              {program.name}
                                            </Typography>
                                            {program.description && (
                                              <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                                                {program.description}
                                              </Typography>
                                            )}
                                            {program.criteria && program.criteria.length > 0 && (
                                              <Box sx={{ mt: 1 }}>
                                                <Typography variant="caption" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                                                  Criteria:
                                                </Typography>
                                                <Box sx={{ ml: 2, mt: 0.5 }}>
                                                  {program.criteria.map((criterion: string, idx: number) => (
                                                    <Typography key={idx} variant="body2" sx={{ fontSize: '0.85rem' }}>
                                                      • {criterion}
                                                    </Typography>
                                                  ))}
                                                </Box>
                                              </Box>
                                            )}
                                            {program.link && (
                                              <Link
                                                href={program.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                sx={{ 
                                                  display: 'inline-flex', 
                                                  alignItems: 'center', 
                                                  gap: 0.5,
                                                  mt: 1,
                                                  fontSize: '0.85rem',
                                                  textDecoration: 'none',
                                                  '&:hover': { textDecoration: 'underline' }
                                                }}
                                              >
                                                View Details
                                                <OpenInNewIcon fontSize="small" />
                                              </Link>
                                            )}
                                          </Paper>
                                        </Box>
                                      ))}
                                    </Box>
                                  </CardContent>
                                </Card>
                              )}
                  
                              {/* Bottom Row - Reimbursement, State Plans, Recent Changes, External Links - 50% width each in 2x2 grid */}
                              {(overview.reimbursementApproach || overview.stateAndPlanVariation || (overview.recentChangesAndInitiatives && Object.keys(overview.recentChangesAndInitiatives).length > 0) || (overview.keyLinks && Object.keys(overview.keyLinks).length > 0)) && (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                {/* First Row - Reimbursement & State Plans */}
                                {(overview.reimbursementApproach || overview.stateAndPlanVariation) && (
                                  <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                                  {/* Reimbursement Approach - 50% */}
                                  {overview.reimbursementApproach && (
                                    <Box sx={{ flex: '1 1 50%' }}>
                                      <Card elevation={2} sx={{ height: '100%' }}>
                                        <CardContent>
                                          <Typography variant="h6" gutterBottom color="primary">
                                            Reimbursement Approach
                                          </Typography>
                                          <Divider sx={{ mb: 2 }} />
                                          <Stack spacing={2}>
                                            {overview.reimbursementApproach.billing && (
                                              <Box>
                                                <Typography variant="subtitle2" color="primary">Billing:</Typography>
                                                <Typography variant="body2">{overview.reimbursementApproach.billing}</Typography>
                                              </Box>
                                            )}
                                            {overview.reimbursementApproach.method && (
                                              <Box>
                                                <Typography variant="subtitle2" color="primary">Method:</Typography>
                                                <Typography variant="body2">{overview.reimbursementApproach.method}</Typography>
                                              </Box>
                                            )}
                                            {overview.reimbursementApproach.note && (
                                              <Box>
                                                <Typography variant="subtitle2" color="warning.main">Note:</Typography>
                                                <Typography variant="body2">{overview.reimbursementApproach.note}</Typography>
                                              </Box>
                                            )}
                                          </Stack>
                                        </CardContent>
                                      </Card>
                                    </Box>
                                  )}

                                  {/* State and Plan Variation - 50% */}
                                  {overview.stateAndPlanVariation && (
                                    <Box sx={{ flex: '1 1 50%' }}>
                                      <Card elevation={2} sx={{ height: '100%' }}>
                                        <CardContent>
                                          <Typography variant="h6" gutterBottom color="info.main">
                                            State & Plan Variations
                                          </Typography>
                                          <Divider sx={{ mb: 2 }} />
                                          <Stack spacing={2}>
                                            {overview.stateAndPlanVariation.medicaid && (
                                              <Box>
                                                <Typography variant="subtitle2" color="info.main">Medicaid:</Typography>
                                                <Typography variant="body2">{overview.stateAndPlanVariation.medicaid}</Typography>
                                              </Box>
                                            )}
                                            {overview.stateAndPlanVariation.commercialMedicareAdvantage && (
                                              <Box>
                                                <Typography variant="subtitle2" color="info.main">Commercial Medicare Advantage:</Typography>
                                                <Typography variant="body2">{overview.stateAndPlanVariation.commercialMedicareAdvantage}</Typography>
                                              </Box>
                                            )}
                                          </Stack>
                                        </CardContent>
                                      </Card>
                                    </Box>
                                  )}
                                  </Box>
                                )}

                                {/* Second Row - Recent Changes & External Links */}
                                {((overview.recentChangesAndInitiatives && Object.keys(overview.recentChangesAndInitiatives).length > 0) || (overview.keyLinks && Object.keys(overview.keyLinks).length > 0)) && (
                                  <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                                  {/* Recent Initiatives - 50% */}
                                  {overview.recentChangesAndInitiatives && Object.keys(overview.recentChangesAndInitiatives).length > 0 && (
                                    <Box sx={{ flex: '1 1 50%' }}>
                                      <Card elevation={2} sx={{ height: '100%' }}>
                                        <CardContent>
                                          <Typography variant="h6" gutterBottom color="info.main">
                                            Recent Changes & Initiatives
                                          </Typography>
                                          <Divider sx={{ mb: 2 }} />
                                          <Stack spacing={2}>
                                            {Object.entries(overview.recentChangesAndInitiatives).map(([key, value]) => (
                                              <Box key={key}>
                                                <Typography variant="subtitle2" color="info.main" sx={{ textTransform: 'capitalize' }}>
                                                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                                                </Typography>
                                                <Typography variant="body2" sx={{ mt: 0.5 }}>{String(value)}</Typography>
                                              </Box>
                                            ))}
                                          </Stack>
                                        </CardContent>
                                      </Card>
                                    </Box>
                                  )}

                                  {/* External Links - 50% */}
                                  {overview.keyLinks && Object.keys(overview.keyLinks).length > 0 && (
                                    <Box sx={{ flex: '1 1 50%' }}>
                                      <Card elevation={2} sx={{ height: '100%' }}>
                                        <CardContent>
                                          <Typography variant="h6" gutterBottom color="primary">
                                            External Resources
                                          </Typography>
                                          <Divider sx={{ mb: 2 }} />
                                          <Stack spacing={1}>
                                            {Object.entries(overview.keyLinks).map(([key, url]) => (
                                              <Link
                                                key={key}
                                                href={url as string}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                sx={{ 
                                                  display: 'flex', 
                                                  alignItems: 'center', 
                                                  gap: 0.5,
                                                  textDecoration: 'none',
                                                  p: 1,
                                                  borderRadius: 1,
                                                  '&:hover': { 
                                                    backgroundColor: 'action.hover',
                                                    textDecoration: 'underline'
                                                  }
                                                }}
                                              >
                                                <Typography variant="body2">
                                                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                                </Typography>
                                                <OpenInNewIcon fontSize="small" />
                                              </Link>
                                            ))}
                                          </Stack>
                                        </CardContent>
                                      </Card>
                                    </Box>
                                  )}
                                  </Box>
                                )}
                                </Box>
                              )}
                            </Box>
                            </Box>
                    );
                  })()}
              );
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default InsurerCharts;
