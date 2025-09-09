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
  Business as BusinessIcon,
  LocalOffer as BrandIcon,
} from '@mui/icons-material';

interface NavigationProps {
  currentView: 'home' | 'insurers' | 'brands' | 'insurer-brands';
  onNavigateHome: () => void;
  onNavigateToInsurers: () => void;
  onNavigateToBrands: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onNavigateHome,
  onNavigateToInsurers,
  onNavigateToBrands,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar position="sticky" elevation={2}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <IconButton
            color="inherit"
            onClick={onNavigateHome}
            sx={{ mr: 1 }}
          >
            <HomeIcon />
          </IconButton>
          {!isMobile && (
            <Typography variant="h6" component="div" sx={{ mr: 4 }}>
              Insurance Dashboard
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            color={currentView === 'insurers' || currentView === 'insurer-brands' ? 'secondary' : 'inherit'}
            onClick={onNavigateToInsurers}
            title="View Insurers"
          >
            <BusinessIcon />
          </IconButton>
          <IconButton
            color={currentView === 'brands' ? 'secondary' : 'inherit'}
            onClick={onNavigateToBrands}
            title="View All Brands"
          >
            <BrandIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
