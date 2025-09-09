Create an Interactive Brand Coverage Analysis Table

Create a responsive table component that displays brand coverage data with the following specifications:

Data Source & Structure:
- Parse JSON data from 'data/brand_coverage_analysis.json'
- Data schema: brand_name, indication_name, indicated_population_name, insurer_coverage (boolean)
- Insurers: UHC, Aetna, Anthem, HCSC, Cigna, Humana

Table Layout:
- Implement vertical cell merging (rowspan) for:
  * Brand names with multiple indications
  * Indications with multiple indicated populations
- Display brand names in title case
- Trigger table visibility on "Brands" tile click

Visual Design:
1. Coverage Indicators:
   - Yes/Covered:
     * Badge color: #4CAF50 (green)
     * Cell background: rgba(76, 175, 80, 0.3)
   - No/Not Covered:
     * Badge color: #F44336 (red)
     * Cell background: rgba(244, 67, 54, 0.3)

2. Interactive Features:
   - Add hover states for cells
   - Implement smooth transitions
   - Ensure touch-friendly tap targets

Technical Requirements:
1. Accessibility:
   - Use WCAG 2.1 compliant contrast ratios
   - Include proper ARIA labels
   - Support keyboard navigation

2. Responsive Behavior:
   - Implement horizontal scrolling for mobile
   - Maintain header visibility
   - Optimize for all viewport sizes

3. Error Handling:
   - Display placeholder for missing/null values
   - Include loading states
   - Implement error boundaries

Reference Documentation:
- WCAG 2.1 Color Contrast Guidelines
- WAI-ARIA Table Patterns
- React Table Component Best Practices