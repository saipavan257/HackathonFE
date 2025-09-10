import React, { useState, useMemo, Suspense, lazy } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Breadcrumbs,
  Link,
  Paper,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import {
  Home as HomeIcon,
  Business as BusinessIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  LocalPharmacy as PharmacyIcon,
  Security as SecurityIcon,
  People as PeopleIcon,
  OpenInNew as OpenInNewIcon
} from '@mui/icons-material';

// Lazy load the comparison view
const InsurerCompareView = lazy(() => import('./InsurerCompareView'));

// Import insurer description data
import insurerDescriptions from '../data/insurer_description.json';

// TypeScript interfaces for comprehensive insurer data
interface CoreBusinessArea {
  [key: string]: string;
}

interface MembershipMix {
  commercialEmployerSponsored?: string;
  medicareAdvantage?: string;
  medicaid?: string;
  medicaidManagedCare?: string;
  acaMarketplace?: string;
  globalCustomerRelationships?: string;
  marketShareUS?: string;
}

interface BenefitType {
  managedBy?: string;
  coverage?: string | string[];
  billingCodes?: string;
}

interface DrugManagementProgram {
  name: string;
  description?: string;
  link?: string;
  criteria?: string[];
}

interface MedicalBenefitDrugManagement {
  programs?: DrugManagementProgram[];
}

interface ReimbursementApproach {
  billing?: string;
  method?: string;
  note?: string;
}

interface StateAndPlanVariation {
  medicaid?: string;
  commercialMedicareAdvantage?: string;
}

interface RecentChangesAndInitiatives {
  [key: string]: string;
}

interface KeyLinks {
  [key: string]: string;
}

interface InsurerOverview {
  companyBackground?: {
    parentCompany?: string;
    headquarters?: string;
    coreBusinessAreas?: CoreBusinessArea;
    scale?: string;
  };
  membershipAndMarketShare?: {
    usMedicalMembers?: string;
    globalCustomerRelationships?: string;
    marketShare?: string;
    marketShareUS?: string;
    membershipMix?: MembershipMix;
  };
  benefitTypes?: {
    pharmacyBenefit?: BenefitType;
    medicalBenefit?: BenefitType;
  };
  medicalBenefitDrugManagement?: MedicalBenefitDrugManagement;
  reimbursementApproach?: ReimbursementApproach;
  stateAndPlanVariation?: StateAndPlanVariation;
  strengths?: string[];
  limitations?: string[];
  recentChangesAndInitiatives?: RecentChangesAndInitiatives;
  keyLinks?: KeyLinks;
  companyDescription?: string;
}

interface InsurerData {
  insurer: string;
  overview?: InsurerOverview;
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
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

interface InsurerDetailsPageProps {
  insurerKey?: string;
  onBack?: () => void;
}

const InsurerDetailsPage: React.FC<InsurerDetailsPageProps> = ({ 
  insurerKey = 'uhc', 
  onBack 
}) => {
  const [tabValue, setTabValue] = useState(0);

  // Get comprehensive insurer data
  const insurerData = useMemo((): InsurerData | null => {
    const data = (insurerDescriptions as any)[insurerKey];
    if (!data) return null;
    
    // Return the complete data structure as is, matching the JSON format
    return {
      insurer: data.insurer || 'Unknown Insurer',
      overview: data.overview || {}
    } as InsurerData;
  }, [insurerKey]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (!insurerData) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Insurer data not found for key: {insurerKey}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link
          color="inherit"
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onBack && onBack();
          }}
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}
        >
          <HomeIcon fontSize="small" />
          Home
        </Link>
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <BusinessIcon fontSize="small" />
          {insurerData.insurer}
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {insurerData.insurer}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
          Comprehensive insurer analysis and market data
        </Typography>
      </Box>

      {/* Tabs */}
      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="insurer details tabs"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              minWidth: 120,
              fontWeight: 600,
              textTransform: 'none',
            },
          }}
        >
          <Tab 
            label="Overview" 
            icon={<AssessmentIcon />} 
            iconPosition="start"
            {...a11yProps(0)} 
          />
          <Tab 
            label="Data Comparison" 
            icon={<TrendingUpIcon />} 
            iconPosition="start"
            {...a11yProps(1)} 
          />
        </Tabs>

        {/* Tab Panels */}
        <TabPanel value={tabValue} index={0}>
          {/* Overview Tab Content */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            
            {/* Company Overview at the top */}
            {insurerData.overview?.companyDescription && (
              <Card elevation={3} sx={{ backgroundColor: '#F8FAFC', border: '2px solid #3B82F6' }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <BusinessIcon sx={{ fontSize: 32 }} />
                    Company Overview
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1.1rem' }}>
                    {insurerData.overview.companyDescription}
                  </Typography>
                </CardContent>
              </Card>
            )}

            {/* Main Content Layout - 25%/75% split */}
            <Box 
              sx={{
                display: 'flex',
                gap: 4,
                flexDirection: { xs: 'column', lg: 'row' },
                minHeight: '60vh'
              }}
            >
              {/* Sidebar - 25% */}
              <Box sx={{ flex: { xs: '1', lg: '0 0 25%' } }}>
                <Stack spacing={3}>
                  {/* Company Background Card */}
                  <Card elevation={2}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BusinessIcon />
                        Company Background
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Stack spacing={2}>
                        {insurerData.overview?.companyBackground?.parentCompany && (
                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                              Parent Company
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                              {insurerData.overview.companyBackground.parentCompany}
                            </Typography>
                          </Box>
                        )}
                        {insurerData.overview?.companyBackground?.headquarters && (
                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                              Headquarters
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                              {insurerData.overview.companyBackground.headquarters}
                            </Typography>
                          </Box>
                        )}
                        {insurerData.overview?.companyBackground?.scale && (
                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                              Market Scale
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                              {insurerData.overview.companyBackground.scale}
                            </Typography>
                          </Box>
                        )}
                        {insurerData.overview?.companyBackground?.coreBusinessAreas && Object.keys(insurerData.overview.companyBackground.coreBusinessAreas).length > 0 && (
                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                              Core Business Areas
                            </Typography>
                            <Stack spacing={1} sx={{ mt: 1 }}>
                              {Object.entries(insurerData.overview.companyBackground.coreBusinessAreas).map(([key, value]) => (
                                <Box key={key}>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{key}:</Typography>
                                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>{String(value)}</Typography>
                                </Box>
                              ))}
                            </Stack>
                          </Box>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>

                  {/* Market Metrics Card */}
                  <Card elevation={2}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PeopleIcon />
                        Market Position
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Stack spacing={2}>
                        {insurerData.overview?.membershipAndMarketShare?.usMedicalMembers && (
                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                              US Medical Members
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 600, color: 'primary.main' }}>
                              {insurerData.overview.membershipAndMarketShare.usMedicalMembers}
                            </Typography>
                          </Box>
                        )}
                        {(insurerData.overview?.membershipAndMarketShare?.marketShare || insurerData.overview?.membershipAndMarketShare?.marketShareUS) && (
                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                              Market Share
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 600, color: 'secondary.main' }}>
                              {insurerData.overview.membershipAndMarketShare.marketShare || insurerData.overview.membershipAndMarketShare.marketShareUS}
                            </Typography>
                          </Box>
                        )}
                        {insurerData.overview?.membershipAndMarketShare?.globalCustomerRelationships && (
                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                              Global Customer Relationships
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 600, color: 'info.main' }}>
                              {insurerData.overview.membershipAndMarketShare.globalCustomerRelationships}
                            </Typography>
                          </Box>
                        )}
                        {insurerData.overview?.membershipAndMarketShare?.membershipMix && Object.keys(insurerData.overview.membershipAndMarketShare.membershipMix).length > 0 && (
                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                              Membership Mix
                            </Typography>
                            <Stack spacing={0.5} sx={{ mt: 1 }}>
                              {Object.entries(insurerData.overview.membershipAndMarketShare.membershipMix).map(([key, value]) => (
                                <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                                  </Typography>
                                  <Typography variant="body2" sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                                    {String(value)}
                                  </Typography>
                                </Box>
                              ))}
                            </Stack>
                          </Box>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </Stack>
              </Box>

              {/* Main Content - 75% */}
              <Box sx={{ flex: { xs: '1', lg: '0 0 75%' } }}>
                <Stack spacing={3}>
                  {/* Business Details Grid */}
                  <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                    {/* Strengths */}
                    {insurerData.overview?.strengths && insurerData.overview.strengths.length > 0 && (
                      <Card elevation={2} sx={{ flex: 1, border: '1px solid #10B981' }}>
                        <CardContent>
                          <Typography variant="h6" gutterBottom color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SecurityIcon />
                            Key Strengths
                          </Typography>
                          <Divider sx={{ mb: 2 }} />
                          <List dense>
                            {insurerData.overview.strengths.map((strength: string, index: number) => (
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
                    )}

                    {/* Limitations */}
                    {insurerData.overview?.limitations && insurerData.overview.limitations.length > 0 && (
                      <Card elevation={2} sx={{ flex: 1, border: '1px solid #F59E0B' }}>
                        <CardContent>
                          <Typography variant="h6" gutterBottom color="warning.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AssessmentIcon />
                            Limitations
                          </Typography>
                          <Divider sx={{ mb: 2 }} />
                          <List dense>
                            {insurerData.overview.limitations.map((limitation: string, index: number) => (
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
                    )}
                  </Box>

                  {/* Benefits and Programs */}
                  <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                    {/* Pharmacy Benefits */}
                    {insurerData.overview?.benefitTypes?.pharmacyBenefit && (
                      <Card elevation={2} sx={{ flex: 1 }}>
                        <CardContent>
                          <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PharmacyIcon />
                            Pharmacy Benefits
                          </Typography>
                          <Divider sx={{ mb: 2 }} />
                          <Stack spacing={2}>
                            {insurerData.overview.benefitTypes.pharmacyBenefit.managedBy && (
                              <Box>
                                <Typography variant="subtitle2" color="primary">Managed By:</Typography>
                                <Typography variant="body2">{insurerData.overview.benefitTypes.pharmacyBenefit.managedBy}</Typography>
                              </Box>
                            )}
                            {insurerData.overview.benefitTypes.pharmacyBenefit.coverage && (
                              <Box>
                                <Typography variant="subtitle2" color="primary">Coverage:</Typography>
                                <Typography variant="body2">{insurerData.overview.benefitTypes.pharmacyBenefit.coverage}</Typography>
                              </Box>
                            )}
                          </Stack>
                        </CardContent>
                      </Card>
                    )}

                    {/* Medical Benefits */}
                    {insurerData.overview?.benefitTypes?.medicalBenefit && (
                      <Card elevation={2} sx={{ flex: 1 }}>
                        <CardContent>
                          <Typography variant="h6" gutterBottom color="secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AssessmentIcon />
                            Medical Benefits
                          </Typography>
                          <Divider sx={{ mb: 2 }} />
                          <Stack spacing={2}>
                            {insurerData.overview.benefitTypes.medicalBenefit.coverage && Array.isArray(insurerData.overview.benefitTypes.medicalBenefit.coverage) && (
                              <Box>
                                <Typography variant="subtitle2" color="secondary">Coverage:</Typography>
                                <List dense sx={{ pl: 1 }}>
                                  {insurerData.overview.benefitTypes.medicalBenefit.coverage.map((item: string, index: number) => (
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
                            {insurerData.overview.benefitTypes.medicalBenefit.billingCodes && (
                              <Box>
                                <Typography variant="subtitle2" color="secondary">Billing Codes:</Typography>
                                <Typography variant="body2">{insurerData.overview.benefitTypes.medicalBenefit.billingCodes}</Typography>
                              </Box>
                            )}
                          </Stack>
                        </CardContent>
                      </Card>
                    )}
                  </Box>

                  {/* Drug Management Programs */}
                  {insurerData.overview?.medicalBenefitDrugManagement?.programs && insurerData.overview.medicalBenefitDrugManagement.programs.length > 0 && (
                    <Card elevation={2}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PharmacyIcon />
                          Drug Management Programs
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                          {insurerData.overview.medicalBenefitDrugManagement.programs.map((program: DrugManagementProgram, index: number) => (
                            <Paper key={index} elevation={1} sx={{ p: 2, backgroundColor: '#F8F9FA' }}>
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
                                    {program.criteria.map((criterion, idx) => (
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
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  )}

                  {/* Reimbursement Approach */}
                  {insurerData.overview?.reimbursementApproach && (
                    <Card elevation={2}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom color="primary">
                          Reimbursement Approach
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Stack spacing={2}>
                          {insurerData.overview.reimbursementApproach.billing && (
                            <Box>
                              <Typography variant="subtitle2" color="primary">Billing:</Typography>
                              <Typography variant="body2">{insurerData.overview.reimbursementApproach.billing}</Typography>
                            </Box>
                          )}
                          {insurerData.overview.reimbursementApproach.method && (
                            <Box>
                              <Typography variant="subtitle2" color="primary">Method:</Typography>
                              <Typography variant="body2">{insurerData.overview.reimbursementApproach.method}</Typography>
                            </Box>
                          )}
                          {insurerData.overview.reimbursementApproach.note && (
                            <Box>
                              <Typography variant="subtitle2" color="warning.main">Note:</Typography>
                              <Typography variant="body2">{insurerData.overview.reimbursementApproach.note}</Typography>
                            </Box>
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  )}

                  {/* State and Plan Variation */}
                  {insurerData.overview?.stateAndPlanVariation && (
                    <Card elevation={2}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom color="info.main">
                          State & Plan Variations
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Stack spacing={2}>
                          {insurerData.overview.stateAndPlanVariation.medicaid && (
                            <Box>
                              <Typography variant="subtitle2" color="info.main">Medicaid:</Typography>
                              <Typography variant="body2">{insurerData.overview.stateAndPlanVariation.medicaid}</Typography>
                            </Box>
                          )}
                          {insurerData.overview.stateAndPlanVariation.commercialMedicareAdvantage && (
                            <Box>
                              <Typography variant="subtitle2" color="info.main">Commercial Medicare Advantage:</Typography>
                              <Typography variant="body2">{insurerData.overview.stateAndPlanVariation.commercialMedicareAdvantage}</Typography>
                            </Box>
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  )}

                  {/* Recent Initiatives */}
                  {insurerData.overview?.recentChangesAndInitiatives && Object.keys(insurerData.overview.recentChangesAndInitiatives).length > 0 && (
                    <Card elevation={2}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom color="info.main">
                          Recent Changes & Initiatives
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Stack spacing={2}>
                          {Object.entries(insurerData.overview.recentChangesAndInitiatives).map(([key, value]) => (
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
                  )}

                  {/* External Links */}
                  {insurerData.overview?.keyLinks && Object.keys(insurerData.overview.keyLinks).length > 0 && (
                    <Card elevation={2}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom color="primary">
                          External Resources
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Stack spacing={1}>
                          {Object.entries(insurerData.overview.keyLinks).map(([key, url]) => (
                            <Link
                              key={key}
                              href={url}
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
                  )}
                </Stack>
              </Box>
            </Box>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {/* Data Comparison Tab Content */}
          <Suspense 
            fallback={
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress size={60} />
                <Typography variant="h6" sx={{ ml: 2 }}>
                  Loading comparison data...
                </Typography>
              </Box>
            }
          >
            <InsurerCompareView onBack={() => setTabValue(0)} />
          </Suspense>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default InsurerDetailsPage;
