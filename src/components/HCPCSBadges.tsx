import React from 'react';
import { Chip, Box } from '@mui/material';
import { extractHCPCSCodes, formatHCPCSCodesForBadges } from '../utils/hcpcsUtils';

interface HCPCSBadgesProps {
  /** Raw HCPCS input string (e.g., "J1234:Description" or "J1234,J5678:Details") */
  hcpcsInput: string | null | undefined;
  /** Display format: 'simple' for "J1234" or 'brackets' for "[J1234]" */
  format?: 'simple' | 'brackets';
  /** Custom styling for badges */
  variant?: 'filled' | 'outlined';
  /** Size of the badges */
  size?: 'small' | 'medium';
  /** Custom color for badges */
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  /** Maximum number of badges to display */
  maxDisplay?: number;
  /** Callback when a badge is clicked */
  onBadgeClick?: (code: string) => void;
  /** Whether badges are clickable */
  clickable?: boolean;
}

const HCPCSBadges: React.FC<HCPCSBadgesProps> = ({
  hcpcsInput,
  format = 'simple',
  variant = 'filled',
  size = 'small',
  color = 'primary',
  maxDisplay,
  onBadgeClick,
  clickable = false
}) => {
  // Extract unique HCPCS codes from input
  const codes = extractHCPCSCodes(hcpcsInput);
  
  // Apply max display limit if specified
  const displayCodes = maxDisplay && maxDisplay > 0 
    ? codes.slice(0, maxDisplay) 
    : codes;
  
  // Format codes for display
  const formattedCodes = formatHCPCSCodesForBadges(displayCodes, format);
  
  // Show remaining count if codes were truncated
  const remainingCount = codes.length - displayCodes.length;

  if (codes.length === 0) {
    return null;
  }

  const handleBadgeClick = (code: string) => {
    if (clickable && onBadgeClick) {
      // Extract the actual code without brackets for callback
      const cleanCode = code.replace(/^\[|\]$/g, '');
      onBadgeClick(cleanCode);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 0.5,
        alignItems: 'center'
      }}
    >
      {formattedCodes.map((formattedCode, index) => {
        const originalCode = displayCodes[index];
        
        return (
          <Chip
            key={`${originalCode}-${index}`}
            label={formattedCode}
            variant={variant}
            size={size}
            color={color}
            clickable={clickable}
            onClick={() => handleBadgeClick(formattedCode)}
            sx={{
              fontFamily: 'monospace',
              fontWeight: 'bold',
              fontSize: size === 'small' ? '0.75rem' : '0.875rem',
              cursor: clickable ? 'pointer' : 'default',
              '&:hover': clickable ? {
                backgroundColor: color === 'primary' ? 'primary.dark' : undefined
              } : {}
            }}
          />
        );
      })}
      
      {remainingCount > 0 && (
        <Chip
          label={`+${remainingCount} more`}
          variant="outlined"
          size={size}
          sx={{
            fontSize: size === 'small' ? '0.75rem' : '0.875rem',
            color: 'text.secondary'
          }}
        />
      )}
    </Box>
  );
};

export default HCPCSBadges;

// Additional specialized components for different use cases

/**
 * HCPCS Badges specifically for CompetitorInsights with brackets format
 */
export const CompetitorInsightsHCPCSBadges: React.FC<Omit<HCPCSBadgesProps, 'format'>> = (props) => {
  return <HCPCSBadges {...props} format="brackets" />;
};

/**
 * Simple HCPCS Badges without brackets
 */
export const SimpleHCPCSBadges: React.FC<Omit<HCPCSBadgesProps, 'format'>> = (props) => {
  return <HCPCSBadges {...props} format="simple" />;
};

/**
 * Clickable HCPCS Badges for filtering
 */
export const ClickableHCPCSBadges: React.FC<Omit<HCPCSBadgesProps, 'clickable'> & { 
  onCodeSelect: (code: string) => void 
}> = ({ onCodeSelect, ...props }) => {
  return (
    <HCPCSBadges 
      {...props} 
      clickable={true} 
      onBadgeClick={onCodeSelect}
      color="secondary"
      variant="outlined"
    />
  );
};
