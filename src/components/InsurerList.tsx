import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Paper,
  TextField,
  InputAdornment,
  Chip,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Business as BusinessIcon,
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import type { Insurer } from '../types';

interface InsurerListProps {
  insurers: Insurer[];
  onInsurerSelect: (insurer: Insurer) => void;
  onBack: () => void;
}

const InsurerList: React.FC<InsurerListProps> = ({
  insurers,
  onInsurerSelect,
  onBack,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const filteredInsurers = insurers.filter(insurer => {
    const matchesSearch = insurer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         insurer.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || insurer.type === filterType;
    return matchesSearch && matchesType;
  });

  const uniqueTypes = Array.from(new Set(insurers.map(insurer => insurer.type)));

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ mb: 2 }}
          variant="outlined"
        >
          Back to Home
        </Button>
        
        <Typography variant="h4" component="h1" gutterBottom>
          Insurance Companies
        </Typography>
        
        <Typography variant="body1" color="text.secondary" mb={3}>
          Select an insurer to view their associated brands
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2, mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search insurers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            <Chip
              label="All Types"
              variant={filterType === '' ? 'filled' : 'outlined'}
              onClick={() => setFilterType('')}
              color={filterType === '' ? 'primary' : 'default'}
            />
            {uniqueTypes.map((type) => (
              <Chip
                key={type}
                label={type}
                variant={filterType === type ? 'filled' : 'outlined'}
                onClick={() => setFilterType(type)}
                color={filterType === type ? 'primary' : 'default'}
              />
            ))}
          </Box>
        </Box>
      </Box>

      <Paper elevation={2}>
        <List sx={{ p: 0 }}>
          {filteredInsurers.map((insurer, index) => (
            <ListItem key={insurer.id} disablePadding>
              <ListItemButton
                onClick={() => onInsurerSelect(insurer)}
                sx={{
                  p: 3,
                  borderBottom: index < filteredInsurers.length - 1 ? '1px solid #e0e0e0' : 'none',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main + '08',
                  },
                }}
              >
                <ListItemIcon>
                  <BusinessIcon color="primary" sx={{ fontSize: 40 }} />
                </ListItemIcon>
                
                <ListItemText
                  primary={
                    <Typography variant="h6" component="div" gutterBottom>
                      {insurer.name}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <CategoryIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {insurer.type}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LocationIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {insurer.location}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <CalendarIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            Est. {insurer.established}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Typography variant="body2" color="primary.main" sx={{ fontWeight: 500 }}>
                        {insurer.brands.length} Brand{insurer.brands.length !== 1 ? 's' : ''}
                      </Typography>
                    </Box>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>

      {filteredInsurers.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <BusinessIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No insurers found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or filter criteria
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default InsurerList;
