Create a React component to display detailed brand information with the following specifications:

1. Component Structure:
```typescript
interface BrandDetailsProps {
  brandData: {
    brand_name: string;
    insurer: string;
    [key: string]: any; // Additional fields based on insurer
  }
}
```

2. Layout Requirements:
- Create a responsive page layout with a max-width of 1200px and centered content
- Use a white background (#FFFFFF) with light blue accents (#F0F8FF, #E6F3FF)
- Implement a header section displaying the brand name and insurer
- Organize data into distinct card sections based on logical groupings:
  - Basic Information (brand name, codes, authorization requirements)
  - Clinical Information (indications, populations, criteria)
  - Policy Details (dates, document history)
  - Additional Resources (links, documentation)

3. Styling Guidelines:
- Use a clean, professional font (system-ui or similar)
- Implement consistent padding (16px-24px)
- Add subtle shadows and rounded corners (4px-8px) for cards
- Use hierarchy in typography:
  - Headers: #1A4B8C (dark blue)
  - Subheaders: #2D6BB5 (medium blue)
  - Body text: #333333 (dark gray)

4. Data Display Rules:
- Group related information into collapsible sections
- Format dates in a consistent manner (YYYY-MM-DD)
- Handle empty/null values gracefully
- Display lists with appropriate bullet points or numbering
- Include clear labels for all data fields

5. Navigation:
- Add a back button to return to the previous page
- Include breadcrumb navigation showing current location

6. Error Handling:
- Display appropriate messages for missing data
- Include loading states while fetching data
- Handle different data structures based on insurer type

7. Accessibility:
- Implement proper ARIA labels
- Ensure sufficient color contrast
- Support keyboard navigation
- Add hover states for interactive elements

The component should adapt its display based on whether the data is from Aetna or Anthem, showing the appropriate fields for each insurer while maintaining a consistent layout and user experience.