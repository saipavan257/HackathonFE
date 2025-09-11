/**
 * HCPCS Utilities for processing and formatting HCPCS codes
 * Handles various input formats and provides consistent output for badges
 */

export interface HCPCSCode {
  code: string;
  description?: string;
}

/**
 * Extracts HCPCS codes from various input formats
 * Supports formats like:
 * - "J1234:Description"
 * - "J1234,J5678:Details" 
 * - "J1234;J5678:Notes"
 * - "J1234:Description\nJ5678:Another description"
 * - "J1234, J5678; J9012:Mixed separators"
 * 
 * @param input - The input string containing HCPCS codes
 * @returns Array of unique HCPCS codes
 */
export function extractHCPCSCodes(input: string | null | undefined): string[] {
  if (!input || typeof input !== 'string') {
    return [];
  }

  // Handle cases where multiple HCPCS entries are separated by newlines
  // Each line might have its own code:description format
  const lines = input.split('\n');
  const allCodes: string[] = [];

  for (const line of lines) {
    // Split by colon to separate codes from description
    const [codesSection] = line.split(':');
    
    if (!codesSection || codesSection.trim() === '') {
      continue;
    }

    // Split by comma and semicolon within the codes section
    const lineCodes = codesSection
      .split(/[,;]/)
      .map(code => code.trim())
      .filter(code => code && code !== '' && code !== 'N/A')
      .filter(code => /^[A-Z]\d{4}$/i.test(code)); // Basic HCPCS format validation

    allCodes.push(...lineCodes);
  }

  // Return unique codes
  return [...new Set(allCodes)];
}

/**
 * Parses HCPCS input and returns structured data with codes and description
 * 
 * @param input - The input string containing HCPCS codes and description
 * @returns Object with codes array and description
 */
export function parseHCPCSInput(input: string | null | undefined): {
  codes: string[];
  description?: string;
} {
  if (!input || typeof input !== 'string') {
    return { codes: [] };
  }

  const parts = input.split(':');
  const codesSection = parts[0] || '';
  const description = parts.length > 1 ? parts.slice(1).join(':').trim() : undefined;

  const codes = extractHCPCSCodes(codesSection);

  return {
    codes,
    description: description && description !== '' ? description : undefined
  };
}

/**
 * Formats HCPCS codes for display in badges
 * 
 * @param codes - Array of HCPCS codes
 * @param format - Display format ('simple' for "J1234" or 'brackets' for "[J1234]")
 * @returns Array of formatted code strings
 */
export function formatHCPCSCodesForBadges(
  codes: string[], 
  format: 'simple' | 'brackets' = 'simple'
): string[] {
  return codes.map(code => {
    const cleanCode = code.trim().toUpperCase();
    return format === 'brackets' ? `[${cleanCode}]` : cleanCode;
  });
}

/**
 * Extracts unique HCPCS codes from an array of data items
 * 
 * @param data - Array of data items with various HCPCS field names
 * @param fieldName - Primary field name to look for
 * @returns Array of unique HCPCS codes
 */
export function extractUniqueHCPCSFromData<T extends Record<string, any>>(
  data: T[], 
  fieldName: keyof T = 'hcpcs_code' as keyof T
): string[] {
  const allCodes = data
    .map(item => {
      // Support multiple field name variations
      const value = item[fieldName] || 
                   item['hcpcs_code'] || 
                   item['hcpc_code'] || 
                   item['HCPCS Code'] || 
                   item['hcpcsCode'] || 
                   '';
      return extractHCPCSCodes(value.toString());
    })
    .flat();

  return [...new Set(allCodes)].sort();
}

/**
 * Checks if a string matches HCPCS code format
 * 
 * @param code - String to validate
 * @returns Boolean indicating if the string is a valid HCPCS code format
 */
export function isValidHCPCSCode(code: string): boolean {
  if (!code || typeof code !== 'string') {
    return false;
  }
  
  const cleanCode = code.trim();
  // HCPCS codes are typically 5 characters: 1 letter followed by 4 digits
  return /^[A-Z]\d{4}$/i.test(cleanCode);
}

/**
 * Filters data based on HCPCS code matching
 * 
 * @param data - Array of data items
 * @param filterCode - HCPCS code to filter by
 * @param fieldName - Primary field name to look for
 * @returns Filtered array of data items
 */
export function filterByHCPCSCode<T extends Record<string, any>>(
  data: T[], 
  filterCode: string, 
  fieldName: keyof T = 'hcpcs_code' as keyof T
): T[] {
  if (!filterCode || !isValidHCPCSCode(filterCode)) {
    return data;
  }

  const upperFilterCode = filterCode.trim().toUpperCase();

  return data.filter(item => {
    // Support multiple field name variations
    const value = item[fieldName] || 
                 item['hcpcs_code'] || 
                 item['hcpc_code'] || 
                 item['HCPCS Code'] || 
                 item['hcpcsCode'] || 
                 '';
    const codes = extractHCPCSCodes(value.toString());
    return codes.some(code => code.toUpperCase() === upperFilterCode);
  });
}

/**
 * Creates display text for HCPCS codes with optional description
 * 
 * @param input - Raw HCPCS input string
 * @param showDescription - Whether to include description in output
 * @returns Formatted display string
 */
export function createHCPCSDisplayText(
  input: string | null | undefined, 
  showDescription: boolean = false
): string {
  if (!input) return '';

  const { codes, description } = parseHCPCSInput(input);
  
  if (codes.length === 0) return '';

  const codesText = codes.join(', ');
  
  if (showDescription && description) {
    return `${codesText}: ${description}`;
  }
  
  return codesText;
}

/**
 * Gets HCPCS value from an item supporting multiple field name variations
 * Used across different data sources (Aetna, Anthem, Humana use hcpcs_code/hcpc_code, 
 * while Cigna and UHC use "HCPCS Code")
 */
export function getHCPCSValueFromItem(item: Record<string, any>): string {
  return item['hcpcs_code'] || 
         item['hcpc_code'] || 
         item['HCPCS Code'] || 
         item['hcpcsCode'] || 
         '';
}

/**
 * Utility for CompetitorInsights component to get unique HCPCS codes
 * This function specifically handles the data structure used in CompetitorInsights
 */
export function getUniqueHCPCSCodesForCompetitorInsights(data: any[]): string[] {
  return extractUniqueHCPCSFromData(data, 'hcpcs_code');
}

/**
 * Utility for filtering CompetitorInsights data by HCPCS code
 */
export function filterCompetitorInsightsByHCPCS(data: any[], filterCode: string): any[] {
  return filterByHCPCSCode(data, filterCode, 'hcpcs_code');
}
