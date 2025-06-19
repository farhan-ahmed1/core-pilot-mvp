#!/usr/bin/env node

/**
 * v0.dev to Material UI Conversion Script
 * 
 * This script helps convert v0.dev generated components to Material UI
 * Usage: node scripts/v0-convert.js <input-file> <output-file>
 */

const fs = require('fs');
const path = require('path');

// Conversion mappings
const tailwindToMuiMap = {
  // Spacing
  'p-1': 'p: 0.5',
  'p-2': 'p: 1',
  'p-3': 'p: 1.5',
  'p-4': 'p: 2',
  'p-6': 'p: 3',
  'p-8': 'p: 4',
  'px-2': 'px: 1',
  'px-4': 'px: 2',
  'px-6': 'px: 3',
  'py-2': 'py: 1',
  'py-4': 'py: 2',
  'm-2': 'm: 1',
  'm-4': 'm: 2',
  'mb-2': 'mb: 1',
  'mb-4': 'mb: 2',
  'mt-2': 'mt: 1',
  'mt-4': 'mt: 2',
  'gap-2': 'gap: 1',
  'gap-4': 'gap: 2',
  
  // Colors
  'bg-white': 'bgcolor: "background.paper"',
  'bg-gray-50': 'bgcolor: "grey.50"',
  'bg-gray-100': 'bgcolor: "grey.100"',
  'bg-gray-200': 'bgcolor: "grey.200"',
  'bg-blue-500': 'bgcolor: "primary.main"',
  'bg-blue-600': 'bgcolor: "primary.dark"',
  'text-gray-600': 'color: "text.secondary"',
  'text-gray-900': 'color: "text.primary"',
  'text-white': 'color: "white"',
  
  // Border radius
  'rounded': 'borderRadius: 1',
  'rounded-md': 'borderRadius: 1.5',
  'rounded-lg': 'borderRadius: 2',
  'rounded-xl': 'borderRadius: 3',
  
  // Shadows
  'shadow': 'boxShadow: 1',
  'shadow-sm': 'boxShadow: 1',
  'shadow-md': 'boxShadow: 2',
  'shadow-lg': 'boxShadow: 4',
  
  // Display & Layout
  'flex': 'display: "flex"',
  'flex-col': 'flexDirection: "column"',
  'flex-row': 'flexDirection: "row"',
  'items-center': 'alignItems: "center"',
  'items-start': 'alignItems: "flex-start"',
  'justify-center': 'justifyContent: "center"',
  'justify-between': 'justifyContent: "space-between"',
  'justify-end': 'justifyContent: "flex-end"',
  'grid': 'display: "grid"',
  'hidden': 'display: "none"',
  
  // Sizing
  'w-full': 'width: "100%"',
  'h-full': 'height: "100%"',
  'min-h-screen': 'minHeight: "100vh"',
  
  // Text
  'text-sm': 'fontSize: "0.875rem"',
  'text-base': 'fontSize: "1rem"',
  'text-lg': 'fontSize: "1.125rem"',
  'text-xl': 'fontSize: "1.25rem"',
  'text-2xl': 'fontSize: "1.5rem"',
  'font-medium': 'fontWeight: 500',
  'font-semibold': 'fontWeight: 600',
  'font-bold': 'fontWeight: 700',
};

// Component mappings
const componentMap = {
  'button': 'Button',
  'input': 'TextField',
  'textarea': 'TextField',
  'select': 'Select',
  'label': 'Typography',
  'h1': 'Typography',
  'h2': 'Typography',
  'h3': 'Typography',
  'h4': 'Typography',
  'h5': 'Typography',
  'h6': 'Typography',
  'p': 'Typography',
  'span': 'Typography',
  'div': 'Box',
  'section': 'Box',
  'article': 'Paper',
  'main': 'Container',
};

function convertTailwindToSx(className) {
  const classes = className.split(' ').filter(cls => cls.trim());
  const sxProps = [];
  
  classes.forEach(cls => {
    if (tailwindToMuiMap[cls]) {
      sxProps.push(tailwindToMuiMap[cls]);
    }
  });
  
  return sxProps.length > 0 ? `sx={{ ${sxProps.join(', ')} }}` : '';
}

function convertComponent(content) {
  // Add Material UI imports at the top
  const muiImports = `import {
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Grid,
  Chip,
  Avatar,
  IconButton,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
`;

  // Convert className attributes to sx props
  content = content.replace(/className="([^"]+)"/g, (match, className) => {
    const sxProp = convertTailwindToSx(className);
    return sxProp || '';
  });

  // Convert basic HTML elements to Material UI components
  Object.entries(componentMap).forEach(([html, mui]) => {
    const regex = new RegExp(`<${html}([^>]*)>`, 'g');
    content = content.replace(regex, `<${mui}$1>`);
    
    const closingRegex = new RegExp(`</${html}>`, 'g');
    content = content.replace(closingRegex, `</${mui}>`);
  });

  // Add variant props for Typography components
  content = content.replace(/<Typography([^>]*?)>/g, (match, attrs) => {
    if (!attrs.includes('variant=')) {
      // Determine variant based on original tag or content
      if (match.includes('h1')) return `<Typography variant="h1"${attrs}>`;
      if (match.includes('h2')) return `<Typography variant="h2"${attrs}>`;
      if (match.includes('h3')) return `<Typography variant="h3"${attrs}>`;
      if (match.includes('h4')) return `<Typography variant="h4"${attrs}>`;
      if (match.includes('h5')) return `<Typography variant="h5"${attrs}>`;
      if (match.includes('h6')) return `<Typography variant="h6"${attrs}>`;
      return `<Typography variant="body1"${attrs}>`;
    }
    return match;
  });

  // Add imports and wrap in proper component structure
  const componentTemplate = `${muiImports}

interface ComponentProps {
  // Add your prop types here
}

const V0Component: React.FC<ComponentProps> = () => {
  const theme = useTheme();
  
  return (
${content.split('\n').map(line => '    ' + line).join('\n')}
  );
};

export default V0Component;`;

  return componentTemplate;
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: node v0-convert.js <input-file> <output-file>');
    console.log('Example: node v0-convert.js v0-component.jsx converted-component.tsx');
    process.exit(1);
  }

  const [inputFile, outputFile] = args;
  const inputPath = path.resolve(inputFile);
  const outputPath = path.resolve(outputFile);

  if (!fs.existsSync(inputPath)) {
    console.error(`Error: Input file ${inputPath} does not exist`);
    process.exit(1);
  }

  try {
    const content = fs.readFileSync(inputPath, 'utf8');
    const convertedContent = convertComponent(content);
    
    fs.writeFileSync(outputPath, convertedContent);
    
    console.log(`✅ Successfully converted ${inputFile} to ${outputFile}`);
    console.log(`📝 Next steps:`);
    console.log(`   1. Review the converted component`);
    console.log(`   2. Add proper TypeScript interfaces`);
    console.log(`   3. Integrate with Core Pilot API services`);
    console.log(`   4. Test responsive behavior`);
    
  } catch (error) {
    console.error(`Error converting file: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { convertComponent, convertTailwindToSx };