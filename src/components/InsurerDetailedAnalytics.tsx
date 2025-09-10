import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  useTheme,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
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
  ResponsiveContainer
} from 'recharts';
import {
  ArrowBack as ArrowBackIcon,
  ExpandMore as ExpandMoreIcon,
  LocalPharmacy as PharmacyIcon,
  Security as SecurityIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';

import { 
  getInsurerDrugStats, 
  allDrugData
} from '../utils/insurerDataProcessor';
import coverageData from '../data/insurers_coverage_data.json';

interface InsurerDetailedAnalyticsProps {
  insurerName: string;
  onBack: () => void;
  selectedFilters?: {
    indication?: string;
    brand?: string;
    hcpcsCode?: string;
  };
}

const InsurerDetailedAnalytics: React.FC<InsurerDetailedAnalyticsProps> = ({
  insurerName,
  onBack,
  selectedFilters = {}
}) => {
  const theme = useTheme();
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>('overview');

  // Get insurer basic info
  const insurerInfo = useMemo(() => 
    coverageData.find(item => item.insurer === insurerName), 
    [insurerName]
  );

  // Get insurer drug statistics
  const drugStats = useMemo(() => 
    getInsurerDrugStats(insurerName, selectedFilters), 
    [insurerName, selectedFilters]
  );

  // Get filtered drug data for this insurer
  const insurerDrugs = useMemo(() => {
    let drugs = allDrugData.filter(drug => drug.insurer === insurerName);
    
    if (selectedFilters.indication) {
      drugs = drugs.filter(drug => 
        drug.indication.toLowerCase().includes(selectedFilters.indication!.toLowerCase())
      );
    }
    
    if (selectedFilters.brand) {
      drugs = drugs.filter(drug => 
        drug.brand_name.toLowerCase().includes(selectedFilters.brand!.toLowerCase())
      );
    }
    
    if (selectedFilters.hcpcsCode) {
      drugs = drugs.filter(drug => 
        drug.hcpc_code?.toLowerCase().includes(selectedFilters.hcpcsCode!.toLowerCase())
      );
    }
    
    return drugs;
  }, [insurerName, selectedFilters]);

  // Group drugs by indication for chart
  const indicationData = useMemo(() => {
    const grouped = insurerDrugs.reduce((acc, drug) => {
      const indication = drug.indication;
      if (!acc[indication]) {
        acc[indication] = { indication, count: 0, withPA: 0 };
      }
      acc[indication].count++;
      if (drug.prior_authorization_required === 'Yes') {
        acc[indication].withPA++;
      }
      return acc;
    }, {} as Record<string, { indication: string; count: number; withPA: number }>);

    return Object.values(grouped).sort((a, b) => b.count - a.count);
  }, [insurerDrugs]);

  // Group drugs by brand for chart
  const brandData = useMemo(() => {
    const grouped = insurerDrugs.reduce((acc, drug) => {
      const brand = drug.brand_name;
      if (!acc[brand]) {
        acc[brand] = { brand, count: 0, withPA: 0 };
      }
      acc[brand].count++;
      if (drug.prior_authorization_required === 'Yes') {
        acc[brand].withPA++;
      }
      return acc;
    }, {} as Record<string, { brand: string; count: number; withPA: number }>);

    return Object.values(grouped)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 brands
  }, [insurerDrugs]);

  // Prior Authorization data for pie chart
  const paData = [
    { name: 'PA Required', value: drugStats.priorAuthRequired, color: theme.palette.error.main },
    { name: 'No PA Required', value: drugStats.totalDrugs - drugStats.priorAuthRequired, color: theme.palette.success.main }
  ];

  const handleAccordionChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  if (!insurerInfo) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4">Insurer not found</Typography>
        <Button onClick={onBack} startIcon={<ArrowBackIcon />}>
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ mb: 2 }}
          variant="outlined"
        >
          Back to Overview
        </Button>
        
        <Typography variant="h4" component="h1" gutterBottom>
          {insurerName} - Detailed Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Comprehensive coverage and formulary analysis
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1 1 250px', minWidth: 250 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <AssessmentIcon color="primary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" color="primary.main">
                    {insurerInfo.percentage_us_population}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    US Population Coverage
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
                <PharmacyIcon color="secondary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" color="secondary.main">
                    {drugStats.totalDrugs}
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
              <Box display="flex" alignItems="center" gap={2}>
                <SecurityIcon color="warning" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" color="warning.main">
                    {drugStats.priorAuthPercentage.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Prior Auth Required
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
                <TrendingUpIcon color="info" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" color="info.main">
                    {drugStats.uniqueBrands.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Unique Brands
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Accordion Sections */}
      <Box>
        {/* Overview Section */}
        <Accordion 
          expanded={expandedAccordion === 'overview'} 
          onChange={handleAccordionChange('overview')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Coverage Overview</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
              <Box sx={{ flex: '2 1 66%' }}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Prior Authorization Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={paData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry: any) => `${entry.name}: ${entry.value} (${((Number(entry.value || 0) / drugStats.totalDrugs) * 100).toFixed(1)}%)`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {paData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Box>
              <Box sx={{ flex: '1 1 33%' }}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Insurer Information
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Covered Lives" 
                        secondary={insurerInfo.approx_covered_lives} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="US Population %" 
                        secondary={insurerInfo.percentage_us_population} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Total Drugs" 
                        secondary={drugStats.totalDrugs} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Unique Indications" 
                        secondary={drugStats.uniqueIndications.length} 
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Drug Coverage by Indication */}
        <Accordion 
          expanded={expandedAccordion === 'indications'} 
          onChange={handleAccordionChange('indications')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Coverage by Indication</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Drug Count by Indication
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={indicationData} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="indication" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    fontSize={10}
                  />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="count" name="Total Drugs" fill={theme.palette.primary.main} />
                  <Bar dataKey="withPA" name="With Prior Auth" fill={theme.palette.warning.main} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </AccordionDetails>
        </Accordion>

        {/* Top Brands */}
        <Accordion 
          expanded={expandedAccordion === 'brands'} 
          onChange={handleAccordionChange('brands')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Top Brands Coverage</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Top 10 Brands by Coverage Count
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={brandData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="brand" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={10}
                  />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="count" name="Total Coverage" fill={theme.palette.secondary.main} />
                  <Bar dataKey="withPA" name="With Prior Auth" fill={theme.palette.error.main} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </AccordionDetails>
        </Accordion>

        {/* Drug Details Table */}
        <Accordion 
          expanded={expandedAccordion === 'details'} 
          onChange={handleAccordionChange('details')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Drug Coverage Details</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Brand Name</strong></TableCell>
                    <TableCell><strong>Generic Name</strong></TableCell>
                    <TableCell><strong>HCPCS Code</strong></TableCell>
                    <TableCell><strong>Indication</strong></TableCell>
                    <TableCell><strong>Prior Auth</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {insurerDrugs.slice(0, 50).map((drug, index) => (
                    <TableRow key={index}>
                      <TableCell>{drug.brand_name}</TableCell>
                      <TableCell>{drug.inn_name}</TableCell>
                      <TableCell>
                        <Chip 
                          label={drug.hcpc_code} 
                          size="small" 
                          variant="outlined" 
                        />
                      </TableCell>
                      <TableCell>{drug.indication}</TableCell>
                      <TableCell>
                        <Chip 
                          label={drug.prior_authorization_required} 
                          size="small"
                          color={drug.prior_authorization_required === 'Yes' ? 'error' : 'success'}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {insurerDrugs.length > 50 && (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Showing first 50 of {insurerDrugs.length} total drugs
                  </Typography>
                </Box>
              )}
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Container>
  );
};

export default InsurerDetailedAnalytics;
