import React, { useState, useEffect, useMemo } from 'react';
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
  CircularProgress,
  Alert,
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
  indication: string;
  indicated_population: string;
  uhc: string;
  aetna: string;
  anthem: string;
  centene: string;
  cigna: string;
  humana: string;
}

interface ProcessedBrandData {
  brand_name: string;
  indication: string;
  indicated_population: string;
  uhc: string;
  aetna: string;
  anthem: string;
  centene: string;
  cigna: string;
  humana: string;
  brandRowspan?: number;
  indicationRowspan?: number;
  isFirstBrandRow?: boolean;
  isFirstIndicationRow?: boolean;
  brandStartsBeforePage?: boolean;
  brandContinuesAfterPage?: boolean;
  indicationStartsBeforePage?: boolean;
  indicationContinuesAfterPage?: boolean;
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
  const [, setCoverageData] = useState<BrandCoverage[]>([]);
  const [processedData, setProcessedData] = useState<ProcessedBrandData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Process data without rowspan calculations (will be done per page)
  // This approach prevents rowspan calculations from breaking across page boundaries
  const processDataWithRowspan = (data: BrandCoverage[]): ProcessedBrandData[] => {
    return data.map(item => ({
      ...item,
      brandRowspan: undefined,
      indicationRowspan: undefined,
      isFirstBrandRow: false,
      isFirstIndicationRow: false,
    }));
  };

  useEffect(() => {
    if (showCoverageView) {
      setLoading(true);
      setError(null);
      // Load brand coverage data
      import('../data/brand_coverage_analysis.json')
        .then((data) => {
          const rawData = data.default as BrandCoverage[];
          setCoverageData(rawData);
          const processed = processDataWithRowspan(rawData);
          setProcessedData(processed);
        })
        .catch((error) => {
          console.error('Error loading brand coverage data:', error);
          setError('Failed to load brand coverage data');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [showCoverageView]);

  const insurerNames = ['UHC', 'Aetna', 'Anthem', 'Centene', 'Cigna', 'Humana'];
  const insurerKeys = ['uhc', 'aetna', 'anthem', 'centene', 'cigna', 'humana'];

  const filteredData = useMemo(() => 
    processedData.filter(item =>
      item.brand_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.indication.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.indicated_population.toLowerCase().includes(searchTerm.toLowerCase())
    ), [processedData, searchTerm]
  );

  // Process pagination-aware rowspans
  // This ensures that merged cells (rowspan) are calculated correctly for each page
  // instead of using global rowspans that break across page boundaries
  const processPaginationAwareRowspans = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const pageData = filteredData.slice(startIndex, endIndex);
    
    if (pageData.length === 0) return [];

    // Calculate rowspans for the current page only
    const processedPageData: ProcessedBrandData[] = [];
    const brandGroupsOnPage = new Map<string, { items: ProcessedBrandData[], startIndex: number }>();
    
    // Group items by brand on current page
    pageData.forEach((item, index) => {
      if (!brandGroupsOnPage.has(item.brand_name)) {
        brandGroupsOnPage.set(item.brand_name, { items: [], startIndex: index });
      }
      brandGroupsOnPage.get(item.brand_name)!.items.push({ ...item });
    });

    let currentIndex = 0;
    brandGroupsOnPage.forEach((brandGroup, brandName) => {
      // Check if this brand continues from previous pages or continues to next pages
      const brandStartsBeforePage = startIndex > 0 && filteredData.slice(0, startIndex).some(item => item.brand_name === brandName);
      const brandContinuesAfterPage = endIndex < filteredData.length && filteredData.slice(endIndex).some(item => item.brand_name === brandName);
      
      // Group by indication within each brand on current page
      const indicationGroups = new Map<string, { items: ProcessedBrandData[], startIndex: number }>();
      
      brandGroup.items.forEach((item, index) => {
        const key = item.indication;
        if (!indicationGroups.has(key)) {
          indicationGroups.set(key, { items: [], startIndex: currentIndex + index });
        }
        indicationGroups.get(key)!.items.push({
          ...item,
          brandStartsBeforePage,
          brandContinuesAfterPage,
        });
      });

      let brandRowIndex = 0;
      const totalBrandRowsOnPage = brandGroup.items.length;

      indicationGroups.forEach((indicationGroup, indicationName) => {
        // Check if this indication continues from previous pages or continues to next pages
        const indicationStartsBeforePage = startIndex > 0 && filteredData.slice(0, startIndex).some(item => 
          item.brand_name === brandName && item.indication === indicationName
        );
        const indicationContinuesAfterPage = endIndex < filteredData.length && filteredData.slice(endIndex).some(item => 
          item.brand_name === brandName && item.indication === indicationName
        );
        
        let indicationRowIndex = 0;
        const totalIndicationRowsOnPage = indicationGroup.items.length;

        indicationGroup.items.forEach((item) => {
          processedPageData.push({
            ...item,
            brandRowspan: brandRowIndex === 0 ? totalBrandRowsOnPage : undefined,
            indicationRowspan: indicationRowIndex === 0 ? totalIndicationRowsOnPage : undefined,
            isFirstBrandRow: brandRowIndex === 0,
            isFirstIndicationRow: indicationRowIndex === 0,
            indicationStartsBeforePage,
            indicationContinuesAfterPage,
          });
          brandRowIndex++;
          indicationRowIndex++;
        });
      });
      
      currentIndex += brandGroup.items.length;
    });

    return processedPageData;
  }, [filteredData, page, rowsPerPage]);

  const paginatedData = processPaginationAwareRowspans;

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
          minHeight: '48px',
          backgroundColor: isYes 
            ? 'rgba(76, 175, 80, 0.3)' 
            : 'rgba(244, 67, 54, 0.3)',
          '&:hover': {
            backgroundColor: isYes 
              ? 'rgba(76, 175, 80, 0.4)' 
              : 'rgba(244, 67, 54, 0.4)',
          },
          transition: 'background-color 0.2s ease-in-out',
          cursor: 'pointer',
        }}
        role="button"
        tabIndex={0}
        aria-label={`Coverage: ${value || 'No'}`}
      >
        <Chip
          label={value || 'No'}
          size="small"
          sx={{
            backgroundColor: isYes ? '#4CAF50' : '#F44336',
            color: 'white',
            fontWeight: 500,
            border: 'none',
            '&:hover': {
              backgroundColor: isYes ? '#45a049' : '#da190b',
            },
          }}
        />
      </Box>
    );
  };

  const toTitleCase = (str: string) => {
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
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

          <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search brands, indications, or populations..."
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
              sx={{ minWidth: 300, flexGrow: isMobile ? 1 : 0 }}
            />
            <Typography variant="body2" color="text.secondary">
              {filteredData.length} record{filteredData.length !== 1 ? 's' : ''} found
              {filteredData.length > rowsPerPage && (
                <> • Page {page + 1} of {Math.ceil(filteredData.length / rowsPerPage)}</>
              )}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}
        </Box>

        {!loading && !error && (
          <>
            <Paper elevation={2} sx={{ overflow: 'hidden' }}>
              <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader size={isMobile ? 'small' : 'medium'}>
                  <TableHead>
                    <TableRow>
                      <TableCell 
                        sx={{ 
                          backgroundColor: theme.palette.grey[50],
                          fontWeight: 600,
                          borderBottom: `2px solid ${theme.palette.primary.main}`,
                          minWidth: isMobile ? 120 : 180,
                          position: 'sticky',
                          left: 0,
                          zIndex: 10,
                        }}
                      >
                        Brand Name
                      </TableCell>
                      <TableCell
                        sx={{ 
                          backgroundColor: theme.palette.grey[50],
                          fontWeight: 600,
                          borderBottom: `2px solid ${theme.palette.primary.main}`,
                          minWidth: isMobile ? 120 : 160,
                          position: 'sticky',
                          left: isMobile ? 120 : 180,
                          zIndex: 10,
                        }}
                      >
                        Indication
                      </TableCell>
                      <TableCell
                        sx={{ 
                          backgroundColor: theme.palette.grey[50],
                          fontWeight: 600,
                          borderBottom: `2px solid ${theme.palette.primary.main}`,
                          minWidth: isMobile ? 200 : 300,
                        }}
                      >
                        Population
                      </TableCell>
                      {insurerNames.map((insurerName) => (
                        <TableCell
                          key={insurerName}
                          align="center"
                          sx={{ 
                            backgroundColor: theme.palette.grey[50],
                            fontWeight: 600,
                            borderBottom: `2px solid ${theme.palette.primary.main}`,
                            minWidth: 120,
                          }}
                        >
                          {insurerName}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedData.map((row, index) => (
                      <TableRow
                        key={`${row.brand_name}-${row.indication}-${row.indicated_population}-${index}`}
                        sx={{
                          '&:hover': {
                            backgroundColor: theme.palette.action.hover,
                          },
                          '&:nth-of-type(odd)': {
                            backgroundColor: theme.palette.action.hover + '10',
                          },
                        }}
                      >
                        {/* Brand Name Cell with rowspan */}
                        {row.isFirstBrandRow && (
                          <TableCell
                            rowSpan={row.brandRowspan}
                            sx={{
                              fontWeight: 500,
                              fontSize: isMobile ? '0.75rem' : '0.875rem',
                              verticalAlign: 'top',
                              borderRight: `1px solid ${theme.palette.divider}`,
                              position: 'sticky',
                              left: 0,
                              backgroundColor: 'white',
                              zIndex: 5,
                              // Add visual indicator for continued groups
                              borderTop: row.brandStartsBeforePage ? `3px solid ${theme.palette.primary.light}` : undefined,
                              borderBottom: row.brandContinuesAfterPage ? `3px solid ${theme.palette.primary.light}` : undefined,
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, py: 1 }}>
                              <BusinessIcon color="primary" fontSize="small" />
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {toTitleCase(row.brand_name)}
                                </Typography>
                                {(row.brandStartsBeforePage || row.brandContinuesAfterPage) && (
                                  <Typography 
                                    variant="caption" 
                                    sx={{ 
                                      color: theme.palette.primary.main,
                                      fontSize: '0.65rem',
                                      fontStyle: 'italic',
                                    }}
                                  >
                                    {row.brandStartsBeforePage && row.brandContinuesAfterPage 
                                      ? '...continued...'
                                      : row.brandStartsBeforePage 
                                        ? 'continued from prev'
                                        : 'continues on next'
                                    }
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </TableCell>
                        )}

                        {/* Indication Cell with rowspan */}
                        {row.isFirstIndicationRow && (
                          <TableCell
                            rowSpan={row.indicationRowspan}
                            sx={{
                              fontSize: isMobile ? '0.75rem' : '0.875rem',
                              verticalAlign: 'top',
                              borderRight: `1px solid ${theme.palette.divider}`,
                              position: 'sticky',
                              left: isMobile ? 120 : 180,
                              backgroundColor: 'white',
                              zIndex: 5,
                              // Add visual indicator for continued groups
                              borderTop: row.indicationStartsBeforePage ? `3px solid ${theme.palette.secondary.light}` : undefined,
                              borderBottom: row.indicationContinuesAfterPage ? `3px solid ${theme.palette.secondary.light}` : undefined,
                            }}
                          >
                            <Box sx={{ py: 1 }}>
                              <Typography variant="body2">
                                {toTitleCase(row.indication)}
                              </Typography>
                              {(row.indicationStartsBeforePage || row.indicationContinuesAfterPage) && (
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    color: theme.palette.secondary.main,
                                    fontSize: '0.65rem',
                                    fontStyle: 'italic',
                                    display: 'block',
                                    mt: 0.5,
                                  }}
                                >
                                  {row.indicationStartsBeforePage && row.indicationContinuesAfterPage 
                                    ? '...continued...'
                                    : row.indicationStartsBeforePage 
                                      ? 'cont. from prev'
                                      : 'cont. on next'
                                  }
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                        )}

                        {/* Population Cell */}
                        <TableCell
                          sx={{
                            fontSize: isMobile ? '0.75rem' : '0.875rem',
                            maxWidth: 300,
                            wordBreak: 'break-word',
                          }}
                        >
                          <Typography variant="body2" sx={{ py: 1 }}>
                            {row.indicated_population}
                          </Typography>
                        </TableCell>

                        {/* Coverage Cells */}
                        {insurerKeys.map((key) => (
                          <TableCell key={key} align="center" sx={{ p: 0 }}>
                            {renderCoverageBadge(row[key as keyof ProcessedBrandData] as string)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <TablePagination
                component="div"
                count={filteredData.length}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(event) => {
                  setRowsPerPage(parseInt(event.target.value, 10));
                  setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 25, 50]}
                labelRowsPerPage="Records per page:"
                labelDisplayedRows={({ from, to, count }) => 
                  `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`
                }
                sx={{
                  borderTop: `1px solid ${theme.palette.divider}`,
                  backgroundColor: theme.palette.grey[50],
                  '& .MuiTablePagination-selectLabel': {
                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                  },
                  '& .MuiTablePagination-displayedRows': {
                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                  },
                }}
              />
            </Paper>

            {filteredData.length === 0 && searchTerm && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <BusinessIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No records found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your search term
                </Typography>
              </Box>
            )}
          </>
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
