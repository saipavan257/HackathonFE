# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Insurance Management Dashboard

A responsive React application built with Material UI for managing insurance companies and their associated brands. This application provides a comprehensive interface for exploring insurance data with sorting, filtering, and search capabilities.

## Features

### 🏠 Homepage
- **Responsive Grid Layout**: Two prominent navigation tiles
- **Modern Design**: Gradient cards with hover effects
- **Mobile-First**: Fully responsive design for all screen sizes

### 🏢 Insurer Management
- **Complete Insurer List**: Browse all insurance companies
- **Advanced Filtering**: Filter by insurer type (Life, General, Reinsurance)
- **Search Functionality**: Search by company name or location
- **Detailed Information**: Company type, location, establishment year, and brand count
- **Interactive Navigation**: Click to view associated brands

### 🏷️ Brand Management
- **Comprehensive Brand Overview**: View all brands across all insurers
- **Advanced DataGrid**: Built with MUI X DataGrid for professional data display
- **Multi-Column Sorting**: Sort by any column (market share, status, etc.)
- **Robust Filtering**: Column-level filtering and search
- **Pagination**: Handle large datasets efficiently
- **Export Functionality**: Export data to CSV/Excel
- **Row Selection**: Multi-row selection capabilities
- **Cross-Reference Data**: See insurer associations for each brand

### 🎨 Design & UX
- **Material Design 3**: Latest Material UI v5+ components
- **Consistent Theming**: Custom theme with primary/secondary colors
- **Loading States**: Smooth transitions between views
- **Error Handling**: Graceful error states (ready for real data)
- **Accessibility**: WCAG compliant with proper ARIA labels
- **Mobile Responsive**: Optimized for all device sizes

## Technical Stack

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite (faster than Create React App)
- **UI Library**: Material UI v5+
- **Data Grid**: MUI X DataGrid
- **Icons**: Material Icons
- **Styling**: Emotion (CSS-in-JS)
- **State Management**: React useState (ready for Redux/Context if needed)

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd HackathonFE
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/           # React components
│   ├── HomePage.tsx     # Landing page with navigation tiles
│   ├── InsurerList.tsx  # Insurer list with search/filter
│   ├── BrandDataGrid.tsx # Brand data table
│   ├── Navigation.tsx   # App navigation bar
│   ├── Loading.tsx      # Loading component
│   └── index.ts         # Component exports
├── data/
│   └── mockData.ts      # Sample data (ready for API integration)
├── theme/
│   └── theme.ts         # Material UI theme configuration
├── types/
│   └── index.ts         # TypeScript type definitions
├── App.tsx              # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## Data Models

### Insurer
```typescript
interface Insurer {
  id: number;
  name: string;
  type: string;              // "Life", "General", "Reinsurance"
  location: string;
  established: number;
  brands: number[];          // Array of associated brand IDs
}
```

### Brand
```typescript
interface Brand {
  id: number;
  name: string;
  category: string;          // Brand category
  insurerId: number;         // Associated insurer ID
  insurerName: string;       // Associated insurer name
  marketShare: number;       // Market share percentage
  status: 'Active' | 'Inactive';
  lastUpdated: string;       // ISO date string
}
```

## Features in Detail

### Navigation Flow

1. **Homepage → Insurers**
   - Click "Insurers" tile
   - View searchable/filterable list
   - Click insurer to see their brands

2. **Homepage → All Brands**
   - Click "Brands" tile
   - View comprehensive brand table
   - See all brands with insurer cross-reference

### DataGrid Capabilities

- **Sorting**: Click column headers to sort
- **Filtering**: Use toolbar filter button
- **Search**: Global search across all columns
- **Pagination**: Configurable page sizes (5, 10, 25, 50)
- **Export**: CSV/Excel export functionality
- **Density**: Adjustable row density
- **Selection**: Multi-row selection with checkboxes

### Responsive Design

- **Desktop**: Full-width layout with sidebar navigation
- **Tablet**: Collapsible navigation, optimized grid layouts
- **Mobile**: Stack layout, touch-friendly buttons, swipe gestures

## API Integration Ready

The application uses mock data but is structured for easy API integration:

```typescript
// Replace mockData imports with API calls
const fetchInsurers = async () => {
  const response = await fetch('/api/insurers');
  return response.json();
};

const fetchBrands = async () => {
  const response = await fetch('/api/brands');
  return response.json();
};
```

## Customization

### Theme
Modify `src/theme/theme.ts` to customize:
- Colors (primary, secondary)
- Typography
- Component styles
- Breakpoints

### Data Structure
Update `src/types/index.ts` to match your API schema

### Components
All components are modular and easily customizable

## Performance Considerations

- **Virtual Scrolling**: DataGrid handles large datasets efficiently
- **Lazy Loading**: Components load data on demand
- **Memoization**: Ready for React.memo optimization
- **Bundle Splitting**: Vite automatically optimizes bundles

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Material UI team for the excellent component library
- React team for the robust framework
- Vite team for the fast build tool

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
