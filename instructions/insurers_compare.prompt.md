Parse JSON files (`aetna_nuro.json`, `anthem_nuro.json`, `humana_nuro.json`,`cigna_nuro.json`,`uhc_nuro.json`,`centene_nuro.json`) to extract insurance coverage data and create an interactive insurer dashboard with the following requirements:

Data Processing Requirements:
1. Parse JSON files from six insurance providers (Aetna, Anthem, Cigna, Humana, UHC, and Centene)
23. Apply insurer-specific data transformations:
   - Cigna:
     * Remove fields: `date`, `cpt_codes`, `diagnosis_codes`
     * Transform `doc_hcpcs_code`: split by ":" and retain first value
   - UHC:
     * Remove fields: `diagnosis_codes`, `hcpcs_codes`
     * Transform `state_policy_data`: split by newline, then by ":", retain first value, combine with commas
     * Display comma-separated values as badges
   - Anthem:
     * Remove `hcpcs_code` field
     * Transform `hcpc_code`: display comma-separated values as badges

Dashboard Interface Requirements:
1. Main Overview Panel:
   - Display insurer cards with:
     * Company name
     * Total covered medications count
     * Last data update timestamp
     * Company-specific metrics

2. Interactive Features:
   - Clickable insurer cards that expand to show detailed coverage data
   - Responsive layout with consistent formatting
   - Real-time data updates
   - Clear visual hierarchy for information display

Technical Requirements:
1. Error Handling:
   - Validate JSON file integrity
   - Handle missing or malformed data gracefully
   - Log processing errors appropriately

2. Performance Optimization:
   - Implement efficient data processing for large datasets
   - Optimize render performance for dynamic updates
   - Cache processed data when appropriate

3. Data Consistency:
   - Maintain data accuracy across all providers
   - Implement version control for data updates
   - Provide data validation checks

Deliverables:
1. Interactive dashboard interface
2. Data processing pipeline
3. Error handling system
4. Documentation for maintenance and updates