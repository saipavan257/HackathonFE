import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#3B82F6', // Lighter blue for headers
      light: '#60A5FA', // Light blue for navigation
      dark: '#1E40AF',
    },
    secondary: {
      main: '#BE185D', // Lighter maroon for brand tiles
      light: '#EC4899',
      dark: '#9D174D',
    },
    background: {
      default: '#F8FAFF', // Very light blue background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E293B', // Dark slate for headers
      secondary: '#475569', // Medium slate for body text
    },
    info: {
      main: '#3B82F6', // Call-to-action buttons blue
      light: '#60A5FA',
      dark: '#1D4ED8',
    },
  },
  typography: {
    h3: {
      fontWeight: 700,
      color: '#1E293B',
      marginBottom: '1rem',
    },
    h4: {
      fontWeight: 600,
      marginBottom: '1rem',
      color: '#1E293B',
    },
    h5: {
      fontWeight: 500,
      marginBottom: '0.5rem',
      color: '#1E293B',
    },
    h6: {
      fontWeight: 500,
      color: '#475569',
    },
    body1: {
      color: '#475569',
    },
    body2: {
      color: '#475569',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 16px rgba(30, 58, 138, 0.08)',
          transition: 'all 0.3s ease-in-out',
          padding: '16px',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(30, 58, 138, 0.12)',
            transform: 'translateY(-4px)',
          },
          '&:focus-within': {
            outline: '2px solid #2563EB',
            outlineOffset: '2px',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 24px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
          '&:focus': {
            outline: '2px solid #2563EB',
            outlineOffset: '2px',
          },
        },
        contained: {
          backgroundColor: '#2563EB',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#1D4ED8',
          },
          '&:active': {
            backgroundColor: '#1E40AF',
          },
        },
      },
    },
    MuiCardActionArea: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          '&:hover': {
            '& .MuiCardActionArea-focusHighlight': {
              opacity: 0.1,
            },
          },
          '&:focus': {
            outline: '2px solid #2563EB',
            outlineOffset: '2px',
          },
        },
      },
    },
  },
});
