Load and parse the brand coverage data from 'data/brand_coverage_analysis.json' into a variable. Create an interactive table component with the following specifications:

1. Structure:
   - Display brand names in title case format as column headers
   - Show Yes/No values as visual badges
   - Make the table visible when the "Brands" tile is clicked

2. Visual Requirements:
   - For "Yes" values:
     - Display a green badge (#4CAF50)
     - Set cell background to rgba(76, 175, 80, 0.3)
   
   - For "No" values:
     - Display a red badge (#F44336)
     - Set cell background to rgba(244, 67, 54, 0.3)

3. Expected Brand Coverage:
   - UHC
   - Aetna
   - Anthem
   - HCSC
   - Cigna
   - Humana

4. Implementation Notes:
   - Handle missing data gracefully
   - Ensure responsive layout
   - Maintain accessibility standards with appropriate contrast ratios
   - Include hover states for better interactivity