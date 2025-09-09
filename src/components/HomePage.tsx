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
} from '@mui/icons-material';

interface HomePageProps {
  onNavigateToInsurers: () => void;
  onNavigateToBrands: () => void;
}

const HomePage: React.FC<HomePageProps> = ({
  onNavigateToInsurers,
  onNavigateToBrands,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center" mb={6}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(45deg, #1976d2 30%, #9c27b0 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Insurance Management Dashboard
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary"
          sx={{ maxWidth: '600px', mx: 'auto', mb: 4 }}
        >
          Navigate through insurers and brands to explore comprehensive insurance data
        </Typography>
      </Box>

      <Box 
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 4,
          justifyItems: 'center'
        }}
      >
        <Box sx={{ width: '100%', maxWidth: '500px' }}>
          <Card 
            sx={{ 
              height: '100%',
              minHeight: isMobile ? 200 : 250,
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                zIndex: 0,
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
                p: 3,
                position: 'relative',
                zIndex: 1,
              }}
            >
              <BusinessIcon sx={{ fontSize: 64, mb: 2, opacity: 0.9 }} />
              <CardContent sx={{ textAlign: 'center', p: 0 }}>
                <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                  Insurers
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, fontSize: '1.1rem' }}>
                  Browse and explore insurance companies with detailed brand information
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Box>

        <Box sx={{ width: '100%', maxWidth: '500px' }}>
          <Card 
            sx={{ 
              height: '100%',
              minHeight: isMobile ? 200 : 250,
              background: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                zIndex: 0,
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
                p: 3,
                position: 'relative',
                zIndex: 1,
              }}
            >
              <BrandIcon sx={{ fontSize: 64, mb: 2, opacity: 0.9 }} />
              <CardContent sx={{ textAlign: 'center', p: 0 }}>
                <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                  Brands
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, fontSize: '1.1rem' }}>
                  View all brands with cross-reference data and insurer associations
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
