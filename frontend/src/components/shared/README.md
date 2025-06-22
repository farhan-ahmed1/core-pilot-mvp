# Shared Component Library Documentation

The Core Pilot shared component library provides a comprehensive set of reusable components that extract common patterns found throughout the application. This library ensures consistency, reduces code duplication, and accelerates development.

## Overview

The library is organized into logical categories:

- **Cards** - Various card patterns for content containers
- **Buttons** - Standardized button components with consistent styling
- **Forms** - Form components with built-in validation and styling
- **Layout** - Page layout and container components
- **Status & Display** - Components for showing status, progress, and metrics
- **Navigation** - Navigation-related components
- **Feedback** - User feedback components (alerts, loading states, etc.)

## Quick Start

```tsx
import { 
  CoreCard, 
  PrimaryButton, 
  CoreTextField,
  PageHeader,
  StatusChip,
  LoadingState 
} from '../components/shared';

// Use components with consistent styling
<CoreCard>
  <PageHeader 
    title="My Page" 
    subtitle="Page description"
    actions={<PrimaryButton>Create New</PrimaryButton>}
  />
  <CoreTextField label="Email" type="email" />
  <StatusChip status="success" label="Active" />
</CoreCard>
```

## Component Categories

### Cards

#### CoreCard
Base card component with consistent styling patterns:

```tsx
<CoreCard variant="outlined" hover bordered>
  Content here
</CoreCard>
```

- **Props**: `hover`, `bordered`, `padding`, `variant` ('elevated' | 'outlined' | 'flat')
- **Use cases**: Any content container, base for other card components

#### ContentCard
Card with standardized header pattern:

```tsx
<ContentCard
  title="Course Title"
  subtitle="Fall 2024"
  overline="Computer Science"
  headerAction={<Button>Edit</Button>}
  onMenuClick={handleMenu}
>
  Card content
</ContentCard>
```

- **Use cases**: Course cards, assignment cards, any content with headers

#### ActionCard
Card with built-in action buttons:

```tsx
<ActionCard
  primaryAction={{
    label: "Save",
    onClick: handleSave,
    loading: saving
  }}
  secondaryAction={{
    label: "Cancel",
    onClick: handleCancel
  }}
>
  Form content
</ActionCard>
```

- **Use cases**: Forms, dialogs, any content requiring actions

### Buttons

#### PrimaryButton
Main action button with consistent styling:

```tsx
<PrimaryButton 
  loading={saving}
  gradient
  startIcon={<SaveIcon />}
  onClick={handleSave}
>
  Save Changes
</PrimaryButton>
```

#### GradientButton
Prominent call-to-action button:

```tsx
<GradientButton 
  colorScheme="primary"
  loading={loading}
>
  Get Started
</GradientButton>
```

#### IconActionButton
Consistent icon button styling:

```tsx
<IconActionButton 
  variant="contained"
  colorScheme="primary"
  onClick={handleAction}
>
  <EditIcon />
</IconActionButton>
```

### Forms

#### CoreTextField
Enhanced text field with common patterns:

```tsx
<CoreTextField
  label="Password"
  type="password"
  showPasswordToggle
  icon={<LockIcon />}
  clearable
  onClear={() => setValue('')}
/>
```

#### CoreSelect
Rich select component with icon support:

```tsx
<CoreSelect
  label="Course"
  options={[
    { 
      value: 1, 
      label: "Computer Science", 
      subtitle: "Fall 2024",
      icon: <SchoolIcon />
    }
  ]}
  loading={loading}
/>
```

### Layout

#### PageHeader
Standardized page header with breadcrumbs:

```tsx
<PageHeader
  title="Assignment Details"
  subtitle="CS 101 - Homework 1"
  overline="Course Assignment"
  showBackButton
  breadcrumbs={[
    { label: "Dashboard", path: "/dashboard" },
    { label: "Courses", path: "/courses" },
    { label: "CS 101", path: "/courses/1" }
  ]}
  actions={
    <PrimaryButton startIcon={<EditIcon />}>
      Edit
    </PrimaryButton>
  }
/>
```

#### ContentContainer
Consistent content wrapper:

```tsx
<ContentContainer 
  maxWidth="lg"
  padding
  fadeIn
>
  Page content
</ContentContainer>
```

### Status & Display

#### StatusChip
Consistent status indicators:

```tsx
<StatusChip 
  status="success" 
  variant="soft"
  label="Completed"
/>
<StatusChip 
  status="warning" 
  variant="outlined"
  label="Due Soon"
/>
```

#### ProgressIndicator
Standardized progress bars:

```tsx
<ProgressIndicator 
  value={65}
  label="Course Progress"
  variant="detailed"
  color="primary"
/>
```

#### MetricDisplay
Display metrics and statistics:

```tsx
<MetricDisplay
  value={42}
  label="Assignments"
  icon={<AssignmentIcon />}
  variant="card"
  color="primary"
  trend={{ value: 12, direction: "up" }}
/>
```

### Navigation

#### BreadcrumbNav
Standardized breadcrumb navigation:

```tsx
<BreadcrumbNav
  items={[
    { label: "Home", path: "/", icon: <HomeIcon /> },
    { label: "Courses", path: "/courses" },
    { label: "CS 101" }
  ]}
  showHomeIcon
/>
```

#### TabPanel
Reusable tab panel:

```tsx
<TabPanel value={activeTab} index={0}>
  Tab content here
</TabPanel>
```

### Feedback

#### LoadingState
Consistent loading indicators:

```tsx
<LoadingState 
  message="Loading courses..."
  size="large"
  fullScreen
/>
```

#### EmptyState
Standardized empty states:

```tsx
<EmptyState
  icon={<SchoolIcon />}
  title="No courses yet"
  description="Create your first course to get started"
  action={{
    label: "Create Course",
    onClick: handleCreate,
    icon: <AddIcon />
  }}
/>
```

#### CoreAlert & CoreSnackbar
User feedback components:

```tsx
<CoreAlert 
  severity="success"
  dismissible
  onDismiss={handleDismiss}
>
  Changes saved successfully!
</CoreAlert>

<CoreSnackbar
  open={snackbarOpen}
  message="Course created successfully"
  severity="success"
  onClose={handleSnackbarClose}
/>
```

## Design Principles

### Consistency
All components follow the same design patterns:
- Border radius: 3 for cards, 2 for buttons/inputs
- Consistent spacing using theme spacing units
- Unified color palette and typography

### Flexibility
Components are designed to be flexible while maintaining consistency:
- Extensive prop support for customization
- Support for sx prop for Material-UI styling
- Composable design for complex layouts

### Accessibility
All components include proper accessibility features:
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Proper focus management

## Best Practices

### When to Use Shared Components

✅ **Use shared components when:**
- Building standard UI patterns (cards, forms, buttons)
- You need consistent styling across the app
- The component will be used in multiple places
- You want built-in accessibility features

❌ **Don't use shared components when:**
- You need highly specialized, one-off functionality
- The component requirements don't match any shared patterns
- Customization needs exceed what props provide

### Customization Guidelines

1. **Use props first** - Most customization should be achieved through component props
2. **Use sx prop sparingly** - Only for minor styling adjustments
3. **Extend components** - For major modifications, create a new component that wraps the shared one
4. **Follow the design system** - Stay within the established color, spacing, and typography patterns

### Migration Strategy

When migrating existing components to use the shared library:

1. **Identify patterns** - Look for repeated UI patterns in your code
2. **Start with high-impact areas** - Focus on components used frequently
3. **Gradual migration** - Replace components incrementally
4. **Test thoroughly** - Ensure shared components work in all contexts

## Examples

See the `/components/examples/` directory for complete implementation examples showing how to use the shared component library in real-world scenarios.

## Contributing

When adding new shared components:

1. **Follow the established patterns** - Look at existing components for guidance
2. **Keep files under 500 lines** - Break complex components into smaller pieces
3. **Document thoroughly** - Include JSDoc comments and prop descriptions
4. **Test extensively** - Ensure components work in various scenarios
5. **Update this documentation** - Add examples and usage guidance