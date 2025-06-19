# v0.dev Integration Guide for Core Pilot

## Design System Specifications

### Brand Colors
- Primary: #1976d2 (Blue)
- Secondary: #dc004e (Pink/Red)
- Success: #2e7d32 (Green)
- Warning: #ed6c02 (Orange)
- Error: #d32f2f (Red)
- Grey Scale: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900

### Typography
- Font Family: Inter, Roboto, Helvetica, Arial, sans-serif
- Headings: 600-700 font weight
- Body: 400-500 font weight
- Button text: 500 font weight, no text transform

### Spacing
- Base unit: 8px
- Common spacing: 8px, 16px, 24px, 32px, 48px

### Border Radius
- Small: 4px
- Medium: 8px
- Large: 12px
- XL: 16px

## v0.dev Prompt Templates

### Template 1: Educational Dashboard Component
```
Create a modern educational dashboard component for Core Pilot using React and Material UI styling patterns. 

Design Requirements:
- Clean, academic interface with card-based layout
- Color scheme: Primary blue (#1976d2), secondary pink (#dc004e)
- Include course cards with progress indicators
- Assignment status badges (overdue: red, due soon: orange, upcoming: green)
- Use Inter font family
- 8px border radius for cards, 12px for elevated cards
- Subtle shadows and hover effects

Component should include:
- Header with title and action button
- Grid of course/assignment cards
- Status indicators and progress bars
- Responsive design for mobile and desktop

Style with className using Tailwind-like classes that map to Material UI:
- bg-white, bg-gray-50, bg-blue-500
- p-4, p-6, m-4, mb-4
- rounded-lg, shadow-md
- flex, grid, items-center, justify-between

Export as React functional component with TypeScript.
```

### Template 2: Form Component
```
Create a modern form component for Core Pilot educational platform.

Requirements:
- Material UI design language
- Primary color: #1976d2
- Input fields with outlined variant
- Form validation states
- Clean, accessible design
- Responsive layout

Include:
- Text inputs with proper labels
- Select dropdowns
- Date pickers
- Submit button with loading state
- Error handling display

Use className approach compatible with Material UI conversion.
Export as TypeScript React component.
```

### Template 3: Assignment Card Component
```
Design an assignment card component for Core Pilot LMS.

Specifications:
- Card-based design with hover effects
- Status indicators (overdue, due soon, upcoming)
- Course information display
- Due date with countdown
- Progress indicators
- Action buttons (view, edit, delete)

Colors:
- Primary: #1976d2
- Error: #d32f2f (overdue)
- Warning: #ed6c02 (due soon)
- Success: #2e7d32 (upcoming)

Typography: Inter font family
Spacing: 8px base unit
Border radius: 12px for cards

Export as reusable TypeScript component.
```

## Conversion Workflow

### Step 1: Generate with v0.dev
Use the prompt templates above to generate components in v0.dev.

### Step 2: Adapt to Material UI
```tsx
// Original v0.dev component
<div className="p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-semibold text-gray-900">Title</h2>
</div>

// Converted to Material UI
import { V0Adapter } from '../components/V0Adapter';

<V0Adapter 
  componentType="card"
  v0Props={{ className: "p-4 bg-white rounded-lg shadow-md" }}
>
  <Typography variant="h5" fontWeight="600">Title</Typography>
</V0Adapter>
```

### Step 3: Integrate with Core Pilot APIs
```tsx
// Add Core Pilot specific functionality
import { getCourses } from '../services/courseService';
import { useEffect, useState } from 'react';

const [courses, setCourses] = useState([]);

useEffect(() => {
  const loadCourses = async () => {
    const data = await getCourses();
    setCourses(data);
  };
  loadCourses();
}, []);
```

## Best Practices

### Do's:
- Use v0.dev for rapid prototyping and initial design
- Always convert Tailwind classes to Material UI equivalents
- Follow Core Pilot's existing component patterns
- Maintain accessibility with proper ARIA labels
- Test responsive behavior on mobile and desktop

### Don'ts:
- Don't mix Tailwind CSS directly with Material UI
- Don't ignore existing theme configuration
- Don't skip TypeScript typing for props
- Don't forget to integrate with Core Pilot's API services

## Common Conversion Patterns

### Cards
```tsx
// v0.dev style
<div className="bg-white p-6 rounded-lg shadow-md">

// Material UI equivalent
<Card sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
```

### Buttons
```tsx
// v0.dev style
<button className="bg-blue-500 text-white px-4 py-2 rounded">

// Material UI equivalent
<Button variant="contained" sx={{ px: 2, py: 1, borderRadius: 1 }}>
```

### Grids
```tsx
// v0.dev style
<div className="grid grid-cols-3 gap-4">

// Material UI equivalent
<Grid container spacing={2}>
  <Grid item xs={4}>
```

## Integration Checklist

- [ ] Component follows Core Pilot design system
- [ ] Proper TypeScript interfaces defined
- [ ] Material UI components used correctly
- [ ] Responsive design implemented
- [ ] Accessibility features included
- [ ] API integration completed
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Component tested on mobile and desktop