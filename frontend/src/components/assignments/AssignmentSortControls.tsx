import React from 'react';
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Chip,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  SwapVert as SortIcon,
  ArrowUpward as AscIcon,
  ArrowDownward as DescIcon,
} from '@mui/icons-material';

export type SortOption = 'due_date' | 'title' | 'created_at';
export type SortOrder = 'asc' | 'desc';

interface AssignmentSortControlsProps {
  sortBy: SortOption;
  sortOrder: SortOrder;
  onSortChange: (sortBy: SortOption, sortOrder: SortOrder) => void;
}

/**
 * FRE-3.1 Sorting Controls Component
 * Provides sortable functionality by due date as required by PRD
 */
const AssignmentSortControls: React.FC<AssignmentSortControlsProps> = ({
  sortBy,
  sortOrder,
  onSortChange
}) => {
  const theme = useTheme();

  const handleSortByChange = (newSortBy: SortOption) => {
    onSortChange(newSortBy, sortOrder);
  };

  const handleOrderToggle = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    onSortChange(sortBy, newOrder);
  };

  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case 'due_date': return 'Due Date';
      case 'title': return 'Title';
      case 'created_at': return 'Created';
      default: return 'Due Date';
    }
  };

  return (
    <Box display="flex" alignItems="center" gap={2}>
      <Box display="flex" alignItems="center" gap={1}>
        <SortIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Sort by</InputLabel>
          <Select
            value={sortBy}
            onChange={(e) => handleSortByChange(e.target.value as SortOption)}
            label="Sort by"
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="due_date">Due Date</MenuItem>
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="created_at">Created</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box display="flex" alignItems="center" gap={1}>
        <Chip
          label={getSortLabel(sortBy)}
          size="small"
          variant="outlined"
          sx={{
            fontWeight: 500,
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
          }}
        />
        <IconButton
          size="small"
          onClick={handleOrderToggle}
          sx={{
            color: theme.palette.primary.main,
            '&:hover': {
              bgcolor: theme.palette.primary.main + '10',
            }
          }}
        >
          {sortOrder === 'asc' ? <AscIcon /> : <DescIcon />}
        </IconButton>
      </Box>
    </Box>
  );
};

/**
 * Utility function to sort assignments array
 * FRE-3.1 requirement for sortable assignments
 */
export const sortAssignments = <T extends { due_date: string; title: string; created_at: string }>(
  assignments: T[],
  sortBy: SortOption,
  sortOrder: SortOrder
): T[] => {
  return [...assignments].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'due_date':
        comparison = new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'created_at':
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        break;
      default:
        comparison = new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });
};

export default AssignmentSortControls;