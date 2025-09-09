import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Business as BusinessIcon,
  Assessment as AssessmentIcon,
  Schedule as ScheduleIcon,
  LocalPharmacy as PharmacyIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import type { InsurerStats } from '../types';
import { parseInsurerData, getAllInsurerStats } from '../utils/insurerDataParser';

interface InsurerCompareViewProps {
  onBack: () => void;
}

const InsurerCompareView: React.FC<InsurerCompareViewProps> = ({ onBack }) => {
  const theme = useTheme();
  const [insurerStats, setInsurerStats] = useState<InsurerStats[]>([]);
  const [selectedInsurer, setSelectedInsurer] = useState<InsurerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const stats = await getAllInsurerStats();
        setInsurerStats(stats);
      } catch (err) {
        setError('Failed to load insurer data. Please try again.');
        console.error('Error loading insurer data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleInsurerClick = async (insurerName: string) => {
    try {
      const stats = await parseInsurerData(insurerName);
      setSelectedInsurer(stats);
    } catch (err) {
      setError(`Failed to load detailed data for ${insurerName}`);
    }
  };

  const formatDate = (dateString: string) => {
    if (dateString === 'Unknown') return dateString;
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInsurerColor = (name: string) => {
    const colors = {
      'Aetna': theme.palette.primary.main,
      'Anthem': theme.palette.secondary.main,
      'Humana': theme.palette.success.main,
    };
    return colors[name as keyof typeof colors] || theme.palette.grey[500];
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Loading insurer coverage data...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ mb: 2 }}
          variant="outlined"
        >
          Back
        </Button>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (selectedInsurer) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box mb={4}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => setSelectedInsurer(null)}
            sx={{ mb: 2 }}
            variant="outlined"
          >
            Back to Insurers
          </Button>
          
          <Typography variant="h4" component="h1" gutterBottom>
            {selectedInsurer.name} Coverage Analysis
          </Typography>
          
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)'
              },
              gap: 3,
              mb: 4
            }}
          >
            <Card sx={{ backgroundColor: theme.palette.primary.light, color: 'white' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1}>
                  <PharmacyIcon />
                  <Typography variant="h4">{selectedInsurer.totalBrands}</Typography>
                </Box>
                <Typography variant="body2">Total Brands</Typography>
              </CardContent>
            </Card>
            
            <Card sx={{ backgroundColor: theme.palette.secondary.light, color: 'white' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1}>
                  <AssessmentIcon />
                  <Typography variant="h4">{selectedInsurer.totalIndications}</Typography>
                </Box>
                <Typography variant="body2">Total Indications</Typography>
              </CardContent>
            </Card>
            
            <Card sx={{ backgroundColor: theme.palette.warning.light, color: 'white' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1}>
                  <SecurityIcon />
                  <Typography variant="h4">{selectedInsurer.priorAuthRequired}</Typography>
                </Box>
                <Typography variant="body2">Prior Auth Required</Typography>
              </CardContent>
            </Card>
            
            <Card sx={{ backgroundColor: theme.palette.success.light, color: 'white' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1}>
                  <ScheduleIcon />
                  <Typography variant="body2">Last Updated</Typography>
                </Box>
                <Typography variant="h6">{formatDate(selectedInsurer.lastUpdated)}</Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>

        <Paper elevation={2}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Brand Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Indication</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Population</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">Prior Auth</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">Step Therapy</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>HCPCS Code</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedInsurer.coverageData.map((item, index) => (
                  <TableRow key={index} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{item.brand_name}</TableCell>
                    <TableCell>{item.indication}</TableCell>
                    <TableCell sx={{ maxWidth: 300, wordBreak: 'break-word' }}>
                      {item.indicated_population}
                    </TableCell>
                    <TableCell align="center">
                      {item.prior_authorization_required?.toLowerCase() === 'yes' ? (
                        <CheckCircleIcon color="error" />
                      ) : (
                        <CancelIcon color="success" />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {item.step_therapy_required?.toLowerCase() === 'yes' ? (
                        <CheckCircleIcon color="warning" />
                      ) : (
                        <CancelIcon color="success" />
                      )}
                    </TableCell>
                    <TableCell>{item.hcpcs_code || item.hcpc_code || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ mb: 2 }}
          variant="outlined"
        >
          Back
        </Button>
        
        <Typography variant="h4" component="h1" gutterBottom>
          Insurer Coverage Comparison
        </Typography>
        
        <Typography variant="body1" color="text.secondary" mb={3}>
          Compare coverage data across different insurance providers
        </Typography>
      </Box>

      <Box 
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(3, 1fr)'
          },
          gap: 3
        }}
      >
        {insurerStats.map((stats) => (
          <Card 
            key={stats.name}
            sx={{ 
              height: '100%',
              cursor: 'pointer',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[8],
              },
              borderTop: `4px solid ${getInsurerColor(stats.name)}`
            }}
            onClick={() => handleInsurerClick(stats.name)}
          >
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <BusinessIcon 
                    sx={{ 
                      fontSize: 40, 
                      color: getInsurerColor(stats.name) 
                    }} 
                  />
                  <Typography variant="h5" component="h2">
                    {stats.name}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box display="flex" flexDirection="column" gap={1.5}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      Total Brands
                    </Typography>
                    <Chip 
                      label={stats.totalBrands} 
                      color="primary" 
                      size="small" 
                    />
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      Indications
                    </Typography>
                    <Chip 
                      label={stats.totalIndications} 
                      color="secondary" 
                      size="small" 
                    />
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      Prior Auth Required
                    </Typography>
                    <Chip 
                      label={stats.priorAuthRequired} 
                      color="warning" 
                      size="small" 
                    />
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      HCPCS Codes
                    </Typography>
                    <Chip 
                      label={stats.uniqueHCPCS} 
                      color="success" 
                      size="small" 
                    />
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                      Last Updated
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 500 }}>
                      {formatDate(stats.lastUpdated)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>

              <CardActions>
                <Button 
                  size="small" 
                  color="primary"
                  sx={{ ml: 'auto' }}
                >
                  View Details →
                </Button>
              </CardActions>
            </Card>
        ))}
      </Box>
      
      {insurerStats.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <BusinessIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No insurer data available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please check if the data files are properly configured
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default InsurerCompareView;
