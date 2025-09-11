/**
 * Test file to demonstrate HCPCS utilities working with different data formats
 * This showcases how the utilities handle various input formats from different insurers
 */

import { 
  extractHCPCSCodes, 
  parseHCPCSInput, 
  formatHCPCSCodesForBadges,
  getHCPCSValueFromItem,
  extractUniqueHCPCSFromData 
} from './hcpcsUtils';

// Test data representing different insurer formats
const testData = [
  // Aetna format
  { hcpcs_code: "Q2055" },
  
  // Anthem format with description
  { hcpcs_code: "J0791: Injection, crizanlizumab-tmca, 5 mg [Adakveo]" },
  
  // Anthem format with multiple codes (newline separated)
  { 
    hcpcs_code: "J3590: Unclassified biologics (when specified as [Adbry] (tralokinumab)\nC9399: Unclassified drugs or biologicals (when specified as Adbry] (tralokinumab)"
  },
  
  // Humana format
  { hcpc_code: "J7171" },
  
  // Cigna format (new field name)
  { "HCPCS Code": "Q2055" },
  
  // UHC format (new field name)  
  { "HCPCS Code": "J0791" },
  
  // Test comma-separated format
  { hcpcs_code: "J1234,J5678:Multiple codes separated by comma" },
  
  // Test semicolon-separated format
  { hcpcs_code: "J1234;J5678:Multiple codes separated by semicolon" }
];

console.log('=== HCPCS Utilities Test Results ===\n');

// Test 1: Extract codes from various formats
console.log('1. Testing extractHCPCSCodes with different formats:');
testData.forEach((item, index) => {
  const hcpcsValue = getHCPCSValueFromItem(item);
  const codes = extractHCPCSCodes(hcpcsValue);
  console.log(`   Item ${index + 1}: "${hcpcsValue}" => [${codes.join(', ')}]`);
});

console.log('\n2. Testing parseHCPCSInput:');
const testInputs = [
  "J1234:Description",
  "J1234,J5678:Details", 
  "J1234;J5678:Notes",
  "J1234:Description\nJ5678:Another description"
];

testInputs.forEach(input => {
  const result = parseHCPCSInput(input);
  console.log(`   "${input}" => codes: [${result.codes.join(', ')}], description: "${result.description || 'N/A'}"`);
});

console.log('\n3. Testing formatHCPCSCodesForBadges:');
const sampleCodes = ['J1234', 'J5678', 'Q2055'];
console.log(`   Simple format: [${formatHCPCSCodesForBadges(sampleCodes, 'simple').join(', ')}]`);
console.log(`   Brackets format: [${formatHCPCSCodesForBadges(sampleCodes, 'brackets').join(', ')}]`);

console.log('\n4. Testing extractUniqueHCPCSFromData:');
const uniqueCodes = extractUniqueHCPCSFromData(testData);
console.log(`   Unique codes from test data: [${uniqueCodes.join(', ')}]`);

console.log('\n5. Testing getHCPCSValueFromItem with different field names:');
testData.forEach((item, index) => {
  const value = getHCPCSValueFromItem(item);
  console.log(`   Item ${index + 1}: ${JSON.stringify(item)} => "${value}"`);
});

console.log('\n=== Test Complete ===');

export { };
