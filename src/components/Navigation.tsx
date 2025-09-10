import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Home as HomeIcon,
  LocalOffer as BrandIcon,
  Compare as CompareIcon,
} from '@mui/icons-material';

interface NavigationProps {
  currentView: 'home' | 'insurers' | 'brands' | 'insurer-brands' | 'compare' | 'brand-details';
  onNavigateHome: () => void;
  onNavigateToInsurers: () => void;
  onNavigateToBrands: () => void;
  onNavigateToCompare: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onNavigateHome,
  onNavigateToBrands,
  onNavigateToCompare,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <Toolbar sx={{ minHeight: 64 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <IconButton
            color="inherit"
            onClick={onNavigateHome}
            sx={{ 
              mr: 2,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
              '&:focus': {
                outline: '2px solid #2563EB',
                outlineOffset: '2px',
              },
            }}
          >
            <HomeIcon />
          </IconButton>
          {!isMobile && (
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                mr: 4,
                fontWeight: 600,
                color: 'white',
              }}
            >
              Insurance Dashboard
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            color={currentView === 'brands' ? 'inherit' : 'inherit'}
            onClick={onNavigateToBrands}
            title="View All Brands"
            sx={{
              backgroundColor: currentView === 'brands' ? 'rgba(255,255,255,0.2)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.15)',
              },
              '&:focus': {
                outline: '2px solid #2563EB',
                outlineOffset: '2px',
              },
            }}
          >
            <BrandIcon />
          </IconButton>
          <IconButton
            color={currentView === 'compare' ? 'inherit' : 'inherit'}
            onClick={onNavigateToCompare}
            title="Compare Insurers"
            sx={{
              backgroundColor: currentView === 'compare' ? 'rgba(255,255,255,0.2)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.15)',
              },
              '&:focus': {
                outline: '2px solid #2563EB',
                outlineOffset: '2px',
              },
            }}
          >
            <CompareIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
