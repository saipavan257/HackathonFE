Create a React TypeScript Insurer Details Component

Technical Requirements:
1. Component Structure
   - Create `InsurerDetailsPage.tsx` as the main container
   - Implement Material-UI Tabs for "Overview" and "Data Comparison" navigation
   - Configure default route to Overview tab
   - Link second tab to `insurerCompareView.tsx`

2. Data Interface & State Management
```typescript
interface InsurerData {
  companyBackground: {
    parentCompany: string;
    headquarters: string;
    coreBusiness: string[];
  };
  marketMetrics: {
    totalMembers: number;
    marketShare: number;
    coverageStates: string[];
  };
  benefitPrograms: {
    pharmacy: string[];
    medical: string[];
    drugManagement: string[];
  };
  businessDetails: {
    reimbursementModel: string;
    stateVariations: string[];
    keyStrengths: string[];
    limitations: string[];
  };
  recentInitiatives: {
    date: string;
    description: string;
  }[];
  externalLinks: {
    title: string;
    url: string;
  }[];
}
```

3. Layout Requirements
   - Implement responsive grid layout (25%/75% split for desktop)
   - Use CSS Grid or Flexbox for side-by-side content sections
   - Ensure mobile-first breakpoints
   - Include Material-UI Breadcrumbs for navigation hierarchy

4. Data Visualization
   - Use Recharts or Chart.js for membership statistics
   - Implement interactive tooltips for detailed metrics
   - Add color-coded indicators for market share comparison

5. Performance & Error Handling
   - Implement React.lazy() for tab components
   - Add React.Suspense with fallback loading states
   - Cache data using React Query or SWR
   - Create custom ErrorBoundary component
   - Add retry mechanism for failed data fetches

6. Accessibility
   - Ensure ARIA labels for interactive elements
   - Maintain proper heading hierarchy
   - Provide keyboard navigation support
   - Include screen reader considerations

Data Source: `insurer_description.json`
Design System: Material-UI v5
State Management: React Query/SWR
Error Monitoring: Sentry/LogRocket

Deliverables:
1. TypeScript component files
2. Responsive layout implementation
3. Data fetching and caching logic
4. Error boundary configuration
5. Unit tests for critical functionality