import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Business as BusinessIcon,
  LocalOffer as BrandIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import CustomIcon from './CustomIcon';

interface HomePageProps {
  onNavigateToInsurers: () => void;
  onNavigateToBrands: () => void;
  onNavigateToCompetitorInsights: () => void;
}

const HomePage: React.FC<HomePageProps> = ({
  onNavigateToInsurers,
  onNavigateToBrands,
  onNavigateToCompetitorInsights,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Container maxWidth="lg" sx={{ py: 6, px: { xs: 2, md: 4 } }}>
      <Box textAlign="center" mb={8}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            mr: 2,
            p: 1,
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <CustomIcon size={64} />
          </Box>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              fontWeight: 700,
            }}
          >
            <span style={{ color: '#1D4ED8' }}>Coverage</span>
            <span style={{ color: '#10B981' }}>Lens</span>
          </Typography>
        </Box>
        <Typography 
          variant="h6" 
          sx={{ 
            maxWidth: '700px', 
            mx: 'auto', 
            mb: 6,
            color: 'text.secondary',
            lineHeight: 1.6,
            fontWeight: 700,
          }}
        >
          “Bringing payer drug coverage into sharp focus.”
        </Typography>
      </Box>

      <Box 
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' },
          gap: 6,
          justifyItems: 'center'
        }}
      >
        {/* Insurers Card */}
        <Box sx={{ width: '100%', maxWidth: '520px' }}>
          <Card 
            sx={{ 
              height: '100%',
              minHeight: isMobile ? 280 : 320,
              background: 'linear-gradient(135deg, #EBF4FF 0%, #DBEAFE 100%)',
              border: '2px solid #3B82F6',
              color: '#1E293B',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 20px 40px rgba(59, 130, 246, 0.15)',
                background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
              }
            }}
          >
            <CardActionArea 
              onClick={onNavigateToInsurers}
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 4,
                position: 'relative',
                zIndex: 1,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: '#3B82F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                }}
              >
                <BusinessIcon sx={{ fontSize: 48, color: 'white' }} />
              </Box>
              <CardContent sx={{ textAlign: 'center', p: 0 }}>
                <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 700, mb: 2, color: '#1E293B' }}>
                  Insurers
                </Typography>
                <Typography variant="body1" sx={{ color: '#475569', fontSize: '1.1rem', lineHeight: 1.5 }}>
                  Browse and explore insurance companies with detailed brand information and coverage analysis
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Box>

        {/* Brands Card */}
        <Box sx={{ width: '100%', maxWidth: '520px' }}>
          <Card 
            sx={{ 
              height: '100%',
              minHeight: isMobile ? 280 : 320,
              background: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)',
              border: '2px solid #BE185D',
              color: '#1E293B',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 20px 40px rgba(190, 24, 93, 0.15)',
                background: 'linear-gradient(135deg, #FCE7F3 0%, #FBCFE8 100%)',
              }
            }}
          >
            <CardActionArea 
              onClick={onNavigateToBrands}
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 4,
                position: 'relative',
                zIndex: 1,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: '#BE185D',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  boxShadow: '0 4px 12px rgba(190, 24, 93, 0.3)',
                }}
              >
                <BrandIcon sx={{ fontSize: 48, color: 'white' }} />
              </Box>
              <CardContent sx={{ textAlign: 'center', p: 0 }}>
                <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 700, mb: 2, color: '#1E293B' }}>
                  Brands
                </Typography>
                <Typography variant="body1" sx={{ color: '#475569', fontSize: '1.1rem', lineHeight: 1.5 }}>
                  View all brands with cross-reference data and comprehensive insurer associations
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Box>

        {/* Competitor Insights Card */}
        <Box sx={{ width: '100%', maxWidth: '520px' }}>
          <Card 
            sx={{ 
              height: '100%',
              minHeight: isMobile ? 280 : 320,
              background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
              border: '2px solid #059669',
              color: '#1E293B',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 20px 40px rgba(5, 150, 105, 0.15)',
                background: 'linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 100%)',
              }
            }}
          >
            <CardActionArea 
              onClick={onNavigateToCompetitorInsights}
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 4,
                position: 'relative',
                zIndex: 1,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
                }}
              >
                <AnalyticsIcon sx={{ fontSize: 48, color: 'white' }} />
              </Box>
              <CardContent sx={{ textAlign: 'center', p: 0 }}>
                <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 700, mb: 2, color: '#1E293B' }}>
                  Competitor Insights
                </Typography>
                <Typography variant="body1" sx={{ color: '#475569', fontSize: '1.1rem', lineHeight: 1.5 }}>
                  Cross-comparison of drugs across insurers with comprehensive analytics and competitor insights
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default HomePage;
