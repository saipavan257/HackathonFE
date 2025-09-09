Parse JSON files (`aetna_nuro.json`, `anthem_nuro.json`, `humana_nuro.json`) to extract insurance coverage data and create an interactive insurer dashboard with the following requirements:

1. Read and analyze each insurer's JSON file to:
   - Extract common fields: brand_name, indication, indicated_population, hcpcs_code
   - Identify insurer-specific fields
   - Validate data integrity

2. Create an insurer overview display that shows:
   - Insurer name
   - Total number of covered brand medications
   - Last updated timestamp for the coverage data
   - Any insurer-specific coverage metrics

3. Implement interactive functionality:
   - Display a clickable tile/card for each insurer
   - On click, expand to show detailed coverage information
   - Present data in a structured, easily readable format

4. Data presentation requirements:
   - Group related information logically
   - Highlight key metrics prominently
   - Ensure consistent formatting across different insurers
   - Handle missing or incomplete data gracefully

5. Technical specifications:
   - Maintain data accuracy across files
   - Implement error handling for file reading
   - Update display dynamically when data changes
   - Optimize performance for large datasets

Note: Ensure all timestamps and coverage information are current and accurate.