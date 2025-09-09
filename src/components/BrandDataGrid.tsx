import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  useTheme,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  TablePagination,
} from '@mui/material';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
} from '@mui/x-data-grid';
import type {
  GridColDef,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import {
  ArrowBack as ArrowBackIcon,
  Business as BusinessIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import type { Brand, Insurer } from '../types';

interface BrandCoverage {
  brand_name: string;
  uhc: string;
  aetna: string;
  anthem: string;
  hcsc: string;
  cigna: string;
  humana: string;
}

interface BrandDataGridProps {
  brands?: Brand[];
  title: string;
  subtitle?: string;
  onBack: () => void;
  selectedInsurer?: Insurer;
  showCoverageView?: boolean;
}

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

const BrandDataGrid: React.FC<BrandDataGridProps> = ({
  brands = [],
  title,
  subtitle,
  onBack,
  selectedInsurer,
  showCoverageView = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [coverageData, setCoverageData] = useState<BrandCoverage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    if (showCoverageView) {
      // Load brand coverage data
      import('../data/brand_coverage_analysis.json')
        .then((data) => {
          setCoverageData(data.default as BrandCoverage[]);
        })
        .catch((error) => {
          console.error('Error loading brand coverage data:', error);
        });
    }
  }, [showCoverageView]);

  const brandNames = ['UHC', 'Aetna', 'Anthem', 'HCSC', 'Cigna', 'Humana'];

  const filteredCoverageData = coverageData.filter(item =>
    item.brand_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedData = filteredCoverageData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const renderCoverageBadge = (value: string) => {
    const isYes = value?.toLowerCase() === 'yes';
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: isYes 
            ? 'rgba(76, 175, 80, 0.3)' 
            : 'rgba(244, 67, 54, 0.3)',
          '&:hover': {
            backgroundColor: isYes 
              ? 'rgba(76, 175, 80, 0.4)' 
              : 'rgba(244, 67, 54, 0.4)',
          },
          transition: 'background-color 0.2s ease-in-out',
        }}
      >
        <Chip
          label={value || 'No'}
          size="small"
          sx={{
            backgroundColor: isYes ? '#4CAF50' : '#F44336',
            color: 'white',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: isYes ? '#45a049' : '#da190b',
            },
          }}
        />
      </Box>
    );
  };

  if (showCoverageView) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
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
            {title}
          </Typography>
          
          {subtitle && (
            <Typography variant="body1" color="text.secondary" mb={2}>
              {subtitle}
            </Typography>
          )}

          <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              placeholder="Search brands..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0); // Reset to first page when searching
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 300 }}
            />
            <Typography variant="body2" color="text.secondary">
              {filteredCoverageData.length} brand{filteredCoverageData.length !== 1 ? 's' : ''} found
            </Typography>
          </Box>
        </Box>

        <Paper elevation={2} sx={{ overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell 
                    sx={{ 
                      backgroundColor: theme.palette.grey[50],
                      fontWeight: 600,
                      borderBottom: `2px solid ${theme.palette.primary.main}`,
                      minWidth: 200,
                    }}
                  >
                    Brand Name
                  </TableCell>
                  {brandNames.map((brandName) => (
                    <TableCell
                      key={brandName}
                      align="center"
                      sx={{ 
                        backgroundColor: theme.palette.grey[50],
                        fontWeight: 600,
                        borderBottom: `2px solid ${theme.palette.primary.main}`,
                        minWidth: 120,
                      }}
                    >
                      {brandName}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((row) => (
                  <TableRow
                    key={row.brand_name}
                    sx={{
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                      '&:nth-of-type(odd)': {
                        backgroundColor: theme.palette.action.hover + '20',
                      },
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 500,
                        fontSize: isMobile ? '0.75rem' : '0.875rem',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BusinessIcon color="primary" fontSize="small" />
                        {row.brand_name}
                      </Box>
                    </TableCell>
                    <TableCell align="center" sx={{ p: 0 }}>
                      {renderCoverageBadge(row.uhc)}
                    </TableCell>
                    <TableCell align="center" sx={{ p: 0 }}>
                      {renderCoverageBadge(row.aetna)}
                    </TableCell>
                    <TableCell align="center" sx={{ p: 0 }}>
                      {renderCoverageBadge(row.anthem)}
                    </TableCell>
                    <TableCell align="center" sx={{ p: 0 }}>
                      {renderCoverageBadge(row.hcsc)}
                    </TableCell>
                    <TableCell align="center" sx={{ p: 0 }}>
                      {renderCoverageBadge(row.cigna)}
                    </TableCell>
                    <TableCell align="center" sx={{ p: 0 }}>
                      {renderCoverageBadge(row.humana)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            component="div"
            count={filteredCoverageData.length}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
            sx={{
              borderTop: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.grey[50],
            }}
          />
        </Paper>

        {filteredCoverageData.length === 0 && searchTerm && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <BusinessIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No brands found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search term
            </Typography>
          </Box>
        )}
      </Container>
    );
  }

  // Original DataGrid view for regular brand display
  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Brand Name',
      flex: 1.5,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BusinessIcon color="primary" fontSize="small" />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'insurerName',
      headerName: 'Insurer',
      flex: 1.2,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" color="primary.main">
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'marketShare',
      headerName: 'Market Share (%)',
      type: 'number',
      flex: 0.8,
      minWidth: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {params.value}%
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.7,
      minWidth: 100,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value}
          color={params.value === 'Active' ? 'success' : 'default'}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: 'lastUpdated',
      headerName: 'Last Updated',
      type: 'date',
      flex: 1,
      minWidth: 120,
      valueGetter: (params) => new Date(params),
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" color="text.secondary">
          {new Date(params.value).toLocaleDateString()}
        </Typography>
      ),
    },
  ];

  // Hide insurer column if showing brands for a specific insurer
  const visibleColumns = selectedInsurer 
    ? columns.filter(col => col.field !== 'insurerName')
    : columns;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
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
          {title}
        </Typography>
        
        {subtitle && (
          <Typography variant="body1" color="text.secondary" mb={2}>
            {subtitle}
          </Typography>
        )}

        {selectedInsurer && (
          <Box sx={{ mb: 3, p: 2, bgcolor: 'primary.main', borderRadius: 2, color: 'white' }}>
            <Typography variant="h6" gutterBottom>
              {selectedInsurer.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <Typography variant="body2">
                Type: {selectedInsurer.type}
              </Typography>
              <Typography variant="body2">
                Location: {selectedInsurer.location}
              </Typography>
              <Typography variant="body2">
                Established: {selectedInsurer.established}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={brands}
          columns={visibleColumns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
            sorting: {
              sortModel: [{ field: 'marketShare', sort: 'desc' }],
            },
          }}
          pageSizeOptions={[5, 10, 25, 50]}
          checkboxSelection
          disableRowSelectionOnClick
          slots={{
            toolbar: CustomToolbar,
          }}
          sx={{
            '& .MuiDataGrid-root': {
              border: 'none',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #f0f0f0',
              fontSize: isMobile ? '0.75rem' : '0.875rem',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: theme.palette.grey[50],
              borderBottom: `2px solid ${theme.palette.primary.main}`,
              fontSize: isMobile ? '0.75rem' : '0.875rem',
              fontWeight: 600,
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 600,
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: theme.palette.primary.main + '08',
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.grey[50],
            },
          }}
        />
      </Box>

      {brands.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <BusinessIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No brands found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            There are no brands associated with the selected criteria
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default BrandDataGrid;
