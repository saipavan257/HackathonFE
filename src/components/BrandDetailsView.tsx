import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  Breadcrumbs,
  Link,
  Alert,
  useTheme,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Launch as LaunchIcon,
  LocalPharmacy as PharmacyIcon,
} from '@mui/icons-material';

interface BrandDetailsProps {
  brandData: {
    brand_name: string;
    insurer: string;
    state_policy_data?: string; // UHC specific
    [key: string]: any;
  };
  onBack: () => void;
}

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, children }) => {
  return (
    <Card
      sx={{
        height: '100%', // Use full height of parent container
        minHeight: {
          xs: '280px',
          md: '400px'
        },
        minWidth: {
          xs: '280px',
          md: '300px'
        },
        flex: {
          xs: '0 0 280px', // Don't grow, don't shrink, fixed width on mobile
          md: 'none'
        },
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(26, 75, 140, 0.08)',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(26, 75, 140, 0.12)',
        },
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ p: 0, flex: 1 }}>
        <Box
          sx={{
            p: 3,
            pb: 2,
            borderBottom: '1px solid #E6F3FF',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: '#1A4B8C',
              fontWeight: 600,
              fontSize: '1.1rem',
            }}
          >
            {title}
          </Typography>
        </Box>
        <Box 
          sx={{ 
            p: 3, 
            pt: 2, 
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#F0F8FF',
              borderRadius: '3px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#2D6BB5',
              borderRadius: '3px',
              '&:hover': {
                backgroundColor: '#1A4B8C',
              },
            },
          }}
        >
          {children}
        </Box>
      </CardContent>
    </Card>
  );
};

const InfoField: React.FC<{ label: string; value: any; type?: 'text' | 'date' | 'boolean' | 'list' | 'link' }> = ({
  label,
  value,
  type = 'text'
}) => {
  const theme = useTheme();

  const formatValue = () => {
    if (!value || value === '' || value === 'N/A' || value === 'Not mentioned') {
      return (
        <Typography variant="body2" sx={{ color: theme.palette.grey[500], fontStyle: 'italic' }}>
          Not specified
        </Typography>
      );
    }

    switch (type) {
      case 'date':
        return new Date(value).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

      case 'boolean':
        return (
          <Chip
            icon={value?.toLowerCase() === 'yes' ? <CheckCircleIcon /> : <CancelIcon />}
            label={value}
            size="small"
            color={value?.toLowerCase() === 'yes' ? 'success' : 'error'}
            sx={{ fontWeight: 500 }}
          />
        );

      case 'list':
        return value.split('\n').map((item: string, index: number) => (
          <Typography key={index} variant="body2" sx={{ mb: 0.5, color: '#333333' }}>
            • {item.trim()}
          </Typography>
        ));

      case 'link':
        return (
          <Link
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: '#2D6BB5',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            View Document
            <LaunchIcon fontSize="small" />
          </Link>
        );

      default:
        return (
          <Typography
            variant="body2"
            sx={{
              color: '#333333',
              whiteSpace: 'pre-line',
              lineHeight: 1.5,
            }}
          >
            {value}
          </Typography>
        );
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        variant="subtitle2"
        sx={{
          color: '#2D6BB5',
          fontWeight: 600,
          mb: 1,
          fontSize: '0.85rem',
        }}
      >
        {label}
      </Typography>
      {formatValue()}
    </Box>
  );
};

// HCPCS Code parsing and display (imported from InsurerCompareView)
const parseHCPCSCodes = (hcpcsString: string): string[] => {
  if (!hcpcsString || hcpcsString === 'N/A' || hcpcsString.trim() === '') {
    return [];
  }

  if (hcpcsString.includes('\n')) {
    return hcpcsString
      .split('\n')
      .map(line => line.split(':')[0].trim())
      .filter(code => code && code !== '');
  }
  
  const beforeColon = hcpcsString.split(':')[0].trim();
  
  if (beforeColon.includes(',') || beforeColon.includes(';')) {
    return beforeColon
      .split(/[,;]/)
      .map(code => code.trim())
      .filter(code => code && code !== '');
  }
  
  return [beforeColon];
};

const HCPCSBadges: React.FC<{ hcpcsString: string }> = ({ hcpcsString }) => {
  const theme = useTheme();
  const codes = parseHCPCSCodes(hcpcsString);
  
  if (codes.length === 0) {
    return (
      <Typography variant="body2" sx={{ color: theme.palette.grey[500], fontStyle: 'italic' }}>
        Not specified
      </Typography>
    );
  }
  
  return (
    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
      {codes.map((code, index) => (
        <Chip
          key={index}
          label={code}
          size="small"
          sx={{
            backgroundColor: theme.palette.info.main,
            color: 'white',
            fontWeight: 600,
            fontSize: '0.75rem',
            fontFamily: 'monospace',
          }}
        />
      ))}
    </Stack>
  );
};

const BrandDetailsView: React.FC<BrandDetailsProps> = ({ brandData, onBack }) => {
  const isAetna = brandData.insurer === 'Aetna';
  const isAnthem = brandData.insurer === 'Anthem';
  const isUHC = brandData.insurer === 'UHC';
  const isCigna = brandData.insurer === 'Cigna';
  if (!brandData.brand_name) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Brand data is incomplete or missing. Please try again.
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ mt: 2 }}
        >
          Back to Insurers
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      <Container 
        maxWidth="xl" 
        sx={{ 
          py: 4,
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Breadcrumbs separator="›" sx={{ mb: 2 }}>
            <Link
              color="inherit"
              href="#"
              onClick={onBack}
              sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              Insurers
            </Link>
            <Typography color="textPrimary">{brandData.insurer}</Typography>
            <Typography color="textPrimary" sx={{ fontWeight: 500 }}>
              {brandData.brand_name}
            </Typography>
          </Breadcrumbs>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={onBack}
              sx={{
                borderColor: '#2D6BB5',
                color: '#2D6BB5',
                '&:hover': {
                  backgroundColor: '#F0F8FF',
                  borderColor: '#1A4B8C',
                },
              }}
            >
              Back to {brandData.insurer}
            </Button>
          </Box>

          <Box
            sx={{
              backgroundColor: 'linear-gradient(135deg, #F0F8FF 0%, #E6F3FF 100%)',
              borderRadius: 3,
              p: 4,
              border: '1px solid #E6F3FF',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <PharmacyIcon sx={{ fontSize: 32, color: '#1A4B8C' }} />
              <Typography
                variant="h4"
                sx={{
                  color: '#1A4B8C',
                  fontWeight: 700,
                  fontSize: '2rem',
                }}
              >
                {brandData.brand_name}
              </Typography>
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: '#2D6BB5',
                fontWeight: 500,
                mb: 1,
              }}
            >
              Coverage Details - {brandData.insurer}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              {brandData.indication && (
                <Chip
                  label={brandData.indication}
                  sx={{
                    backgroundColor: '#2D6BB5',
                    color: 'white',
                    fontWeight: 500,
                  }}
                />
              )}
              {(brandData.link || brandData.links || brandData.pdf_link) && (
                <Link
                  href={brandData.link || brandData.links}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: '#2D6BB5',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    backgroundColor: '#F0F8FF',
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: '#E6F3FF',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  <LaunchIcon fontSize="small" />
                  Policy Document
                </Link>
              )}
            </Box>
          </Box>
        </Box>

        {/* Content Sections - Custom Layout */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            minHeight: '500px',
          }}
        >
          {/* First Row: Clinical Info (75%) + Basic Info (25%) */}
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              minHeight: '400px',
              flexDirection: { xs: 'column', md: 'row' },
              overflowX: { xs: 'auto', md: 'visible' },
              pb: { xs: 1, md: 0 },
              '&::-webkit-scrollbar': {
                height: '8px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#F0F8FF',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#2D6BB5',
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: '#1A4B8C',
                },
              },
            }}
          >
            {/* Clinical Information - 75% width */}
            <Box sx={{ 
              flex: { xs: '0 0 280px', md: '0 0 75%' },
              minWidth: { xs: '280px', md: '0' }
            }}>
              <InfoCard title="Clinical Information">
                <InfoField label="Indication" value={brandData.indication} />
                <InfoField label="Target Population" value={brandData.indicated_population} />
                <InfoField label="Detailed Population Information" value={brandData.label_population} />
                <InfoField label="Clinical Criteria" value={brandData.clinical_criteria || brandData.clinical_evidence_summary} />
                {brandData.exclusion_criteria && (
                  <InfoField label="Exclusion Criteria" value={brandData.exclusion_criteria} />
                )}
                {brandData.continuation_of_therapy && (
                  <InfoField label="Continuation of Therapy" value={brandData.continuation_of_therapy} />
                )}
              </InfoCard>
            </Box>

            {/* Basic Information - 25% width */}
            <Box sx={{ 
              flex: { xs: '0 0 280px', md: '0 0 25%' },
              minWidth: { xs: '280px', md: '0' }
            }}>
              <InfoCard title="Basic Information">
                {isAnthem && brandData.inn_name && (
                  <InfoField label="Generic Name (INN)" value={brandData.inn_name} />
                )}
                <InfoField 
                  label="HCPCS Codes" 
                  value={<HCPCSBadges hcpcsString={brandData.hcpcs_code || brandData.hcpc_code  || brandData.doc_hcpcs_code || ''} />} 
                />
                <InfoField label="Prior Authorization Required" value={brandData.prior_authorization_required || (brandData.medication_sourcing_required) ? "Yes" : "No"} type="boolean" />
                {isUHC && (
                  <InfoField label="Site of Care" value={(brandData.site_of_core_medical_necessity ? "Yes" : "No")} type="boolean" />
                )}

                {isAetna && (
                  <InfoField label="Step Therapy Required" value={brandData.step_therapy_required} type="boolean" />
                )}
                {isAetna && brandData.plan_type && (
                  <InfoField label="Plan Type" value={brandData.plan_type} />
                )}
                {isAnthem && brandData.quantity_limits && (
                  <InfoField label="Quantity Limits" value={brandData.quantity_limits} />
                )}
                {isUHC && brandData.state_policy_data && (
                  <InfoField 
                    label="State Policy Data" 
                    value={
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1, color: '#333333', fontStyle: 'italic' }}>
                          This policy applies in all states except the following states:
                        </Typography>
                        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                          {brandData.state_policy_data
                            .toString()
                            .split('\n')
                            .map((line: string) => line.split(':')[0].trim())
                            .filter((item: string) => item)
                            .join(', ')
                            .split(',')
                            .map((state: string, index: number) => (
                              <Chip
                                key={index}
                                label={state.trim()}
                                size="small"
                                sx={{
                                  backgroundColor: '#FFF3CD',
                                  color: '#856404',
                                  border: '1px solid #FFEAA7',
                                  fontWeight: 500,
                                  fontSize: '0.75rem',
                                }}
                              />
                            ))
                          }
                        </Stack>
                      </Box>
                    } 
                  />
                )}
              </InfoCard>
            </Box>
          </Box>

          {/* Second Row: Policy & Authorization (30%) + Evidence & Documentation (70%) */}
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              minHeight: '400px',
              flexDirection: { xs: 'column', lg: 'row' },
              overflowX: { xs: 'auto', lg: 'visible' },
              pb: { xs: 1, lg: 0 },
              '&::-webkit-scrollbar': {
                height: '8px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#F0F8FF',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#2D6BB5',
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: '#1A4B8C',
                },
              },
            }}
          >
            {/* Policy & Authorization Details - 30% */}
            <Box sx={{ 
              flex: { xs: '0 0 280px', lg: '0 0 30%' },
              minWidth: { xs: '280px', lg: '0' }
            }}>
              <InfoCard title="Policy & Authorization Details">
                {brandData.prior_authorization_summary && (
                  <InfoField label="Prior Authorization Summary" value={brandData.prior_authorization_summary} />
                )}
                {(brandData.preferred_products || brandData.preferred_products_required) && (
                  <InfoField label="Preferred Products" value={brandData.preferred_products || brandData.preferred_products_required} />
                )}
                {(brandData.exception_criteria || brandData.exclusion_criteria) && (
                  <InfoField label="Exception Criteria" value={brandData.exception_criteria || brandData.exclusion_criteria} />
                )}
                {isAetna && brandData.policy_revised_date && (
                  <InfoField label="Policy Revised Date" value={brandData.policy_revised_date} type="date" />
                )}
                {(isAetna || isUHC) && (brandData.policy_effective_date || brandData.effective_date) && (
                  <InfoField label="Policy Effective Date" value={brandData.policy_effective_date || brandData.effective_date} type="date" />
                )}
                {isAetna && brandData.policy_approved_date && (
                  <InfoField label="Policy Approved Date" value={brandData.policy_approved_date} type="date" />
                )}
                {isAnthem && brandData.published_date && (
                  <InfoField label="Published Date" value={brandData.published_date} type="date" />
                )}
                {isAnthem && brandData.last_review_date && (
                  <InfoField label="Last Review Date" value={brandData.last_review_date} type="date" />
                )}
                {isAnthem && brandData.document_status && (
                  <InfoField label="Document Status" value={brandData.document_status} />
                )}
              </InfoCard>
            </Box>

            {/* Evidence & Documentation - 70% */}
            <Box sx={{ 
              flex: { xs: '0 0 280px', lg: '0 0 70%' },
              minWidth: { xs: '280px', lg: '0' }
            }}>
              <InfoCard title="Evidence & Documentation">
                {(brandData.evidence_rationale || brandData.rationale_for_use) && (
                  <InfoField label="Evidence & Rationale" value={brandData.evidence_rationale || brandData.rationale_for_use} />
                )}
                {(isAnthem || isUHC) && (brandData.document_history || brandData.policy_history_revision_info) && (
                  <InfoField label="Document History" value={brandData.document_history || brandData.policy_history_revision_info} />
                )}
                {(isAnthem || isUHC || isCigna) && (brandData.document_summary || brandData.summary) && (
                  <InfoField label="Document Summary" value={brandData.document_summary || brandData.summary} />
                )}
              </InfoCard>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default BrandDetailsView;
