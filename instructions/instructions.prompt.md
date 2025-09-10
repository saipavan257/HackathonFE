Create a responsive React application using Material UI with the following specifications:

Requirements:

1. Homepage Layout
   - Design a responsive grid layout with two prominent tiles:
     * Insurer Navigation Tile
     * Brands Overview Tile

2. Navigation Flow
   a. Insurer Tile Path:
      - On click: Display a list of all insurers
      - When insurer selected: Show a data table of associated brands
      - Include sorting, filtering, and pagination capabilities

   b. Brands Tile Path:
      - On click: Display a comprehensive data table showing all brands
      - Include cross-reference data for associated insurers
      - Implement robust filtering and sorting options

   c. Competitor Insight Tile Path (Indication Level):
      - On click: Display competitor insights dashboard
      - Filtering options:
        * Indication (disease/condition)
        * Brand
        * HCPCS code
        * Insurer
      - When indication selected:
        * Show table comparing all drugs approved/covered for that indication across insurers
        * Include brand–indication mapping, HCPCS codes, and insurer coverage rules
      - Capabilities:
        * Cross-comparison at indication → drug → insurer hierarchy
        * Filtering/sorting by insurer, brand, or HCPCS
        * Insights into competitor presence: which drugs are dominant for the indication, gaps in coverage, or restrictive policies
        * Visual dashboards (bar/pie charts for coverage % per indication, insurer-wise comparison, etc.)
        * Export functionality (Excel/CSV/PDF)

3. Technical Implementation
   - Use Material UI v5+ components for consistent styling
   - Implement responsive design patterns for all screen sizes
   - Follow Material Design guidelines for spacing and typography
   - Create reusable components for data tables and list views
   - Implement efficient state management
   - Add loading states and error handling
   - Ensure accessibility compliance

4. Data Display Requirements
   - Use MUI DataGrid for tabular data presentation
   - Include search functionality across all views
   - Implement column sorting and filtering
   - Add pagination for large datasets
   - Enable row selection where applicable
   
   5. Professional Chat Box
      - Integrate a chat box component styled with Material UI for a professional look
      - The chat box should read from a global JSON data source containing information about brands, coverage, drugs, and insurers
      - Users can ask questions such as:
        * "Which insurer covers Drug X?"
        * "What brands are associated with Indication Y?"
        * "Show all drugs covered by Insurer Z"
      - The chat box should provide concise, professional answers including all relevant details (brand, coverage, insurer, drug, indication, HCPCS code, etc.)
      - Support follow-up questions and context-aware responses
      - Ensure accessibility and responsive design
      - Include loading and error states for data fetching