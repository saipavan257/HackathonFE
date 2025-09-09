import { useState } from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { theme } from './theme/theme';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import InsurerList from './components/InsurerList';
import BrandDataGrid from './components/BrandDataGrid';
import Loading from './components/Loading';
import { mockInsurers, mockBrands } from './data/mockData';
import type { Insurer, Brand } from './types';

type ViewType = 'home' | 'insurers' | 'brands' | 'insurer-brands';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedInsurer, setSelectedInsurer] = useState<Insurer | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigation = async (view: ViewType, insurer?: Insurer) => {
    setIsLoading(true);
    
    // Simulate loading time for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setCurrentView(view);
    if (insurer) {
      setSelectedInsurer(insurer);
    } else if (view !== 'insurer-brands') {
      setSelectedInsurer(null);
    }
    
    setIsLoading(false);
  };

  const handleNavigateHome = () => handleNavigation('home');
  const handleNavigateToInsurers = () => handleNavigation('insurers');
  const handleNavigateToBrands = () => handleNavigation('brands');
  
  const handleInsurerSelect = (insurer: Insurer) => {
    handleNavigation('insurer-brands', insurer);
  };

  const getInsurerBrands = (insurer: Insurer): Brand[] => {
    return mockBrands.filter(brand => insurer.brands.includes(brand.id));
  };

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
          <InsurerList
            insurers={mockInsurers}
            onInsurerSelect={handleInsurerSelect}
            onBack={handleNavigateHome}
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
      
      case 'insurer-brands':
        if (!selectedInsurer) {
          handleNavigateHome();
          return null;
        }
        
        const insurerBrands = getInsurerBrands(selectedInsurer);
        return (
          <BrandDataGrid
            brands={insurerBrands}
            title={`${selectedInsurer.name} - Brands`}
            subtitle={`Brands associated with ${selectedInsurer.name}`}
            onBack={handleNavigateToInsurers}
            selectedInsurer={selectedInsurer}
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
        />
        
        <main>
          {renderCurrentView()}
        </main>
      </Box>
    </ThemeProvider>
  );
}

export default App;
