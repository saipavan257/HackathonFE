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
  Button
} from '@mui/material';
import {
  Business as BusinessIcon,
  People as PeopleIcon,
  LocalPharmacy as PharmacyIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon
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
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom noWrap>
                    {insurer.insurer}
                  </Typography>
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
    </Container>
  );
};

export default InsurerCharts;
