import { useState } from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { theme } from './theme/theme';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import BrandDataGrid from './components/BrandDataGrid';
import InsurerCompareView from './components/InsurerCompareView';
import BrandDetailsView from './components/BrandDetailsView';
import Loading from './components/Loading';

type ViewType = 'home' | 'insurers' | 'brands' | 'insurer-brands' | 'compare' | 'brand-details';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBrandData, setSelectedBrandData] = useState<any>(null);

  const handleNavigation = async (view: ViewType) => {
    setIsLoading(true);
    
    // Simulate loading time for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setCurrentView(view);
    
    setIsLoading(false);
  };

  const handleBrandClick = async (brandData: any) => {
    setSelectedBrandData(brandData);
    await handleNavigation('brand-details');
  };

  const handleNavigateHome = () => handleNavigation('home');
  const handleNavigateToInsurers = () => handleNavigation('insurers');
  const handleNavigateToBrands = () => handleNavigation('brands');
  const handleNavigateToCompare = () => handleNavigation('compare');

  const renderCurrentView = () => {
    if (isLoading) {
      return <Loading message="Loading..." />;
    }

    switch (currentView) {
      case 'home':
        return (
          <HomePage
            onNavigateToInsurers={handleNavigateToInsurers}
            onNavigateToBrands={handleNavigateToBrands}
          />
        );
      
      case 'insurers':
        return (
          <InsurerCompareView
            onBack={handleNavigateHome}
            onBrandClick={handleBrandClick}
          />
        );
      
      case 'brands':
        return (
          <BrandDataGrid
            title="Brand Coverage Analysis"
            subtitle="Interactive coverage matrix showing brand availability across major insurers"
            onBack={handleNavigateHome}
            showCoverageView={true}
          />
        );
      
      case 'compare':
        return (
          <InsurerCompareView
            onBack={handleNavigateHome}
            onBrandClick={handleBrandClick}
          />
        );

      case 'brand-details':
        return selectedBrandData ? (
          <BrandDetailsView
            brandData={selectedBrandData}
            onBack={handleNavigateToInsurers}
          />
        ) : (
          <HomePage
            onNavigateToInsurers={handleNavigateToInsurers}
            onNavigateToBrands={handleNavigateToBrands}
          />
        );
      
      default:
        return (
          <HomePage
            onNavigateToInsurers={handleNavigateToInsurers}
            onNavigateToBrands={handleNavigateToBrands}
          />
        );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Navigation
          currentView={currentView}
          onNavigateHome={handleNavigateHome}
          onNavigateToInsurers={handleNavigateToInsurers}
          onNavigateToBrands={handleNavigateToBrands}
          onNavigateToCompare={handleNavigateToCompare}
        />
        
        <main>
          {renderCurrentView()}
        </main>
      </Box>
    </ThemeProvider>
  );
}

export default App;
