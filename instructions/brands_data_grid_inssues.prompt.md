Implement pagination-aware cell merging for data tables where:

1. Brand names and indications span multiple rows through cell merging
2. Each page displays 10 records
3. Some brands have more than 10 rows (exceeding single page length)

Requirements:
- Reset cell merging at page boundaries
- Display brand names and indications correctly on each page, even if the group starts on a previous page
- Maintain proper row alignment and visual consistency across pages
- Handle cases where merged cell groups are split across page breaks
- Ensure merged cell groups render completely within their respective pages

Expected behavior:
- Brand names should appear on every page where their records exist
- Row alignment should be consistent across all pages
- Visual hierarchy should be maintained regardless of pagination
- No orphaned or incomplete merged cell groups

Please provide a solution that addresses these pagination and cell merging requirements while maintaining data integrity and visual consistency.