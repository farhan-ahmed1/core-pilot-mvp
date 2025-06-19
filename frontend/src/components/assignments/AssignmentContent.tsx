import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Paper,
  Box,
  Divider
} from '@mui/material';
import {
  Description as DescriptionIcon,
  AutoStories as BookIcon
} from '@mui/icons-material';

interface AssignmentContentProps {
  assignment: any;
  editMode: boolean;
  editForm: {
    title: string;
    description: string;
    prompt: string;
    due_date: string;
  };
  onEditFormChange: (field: string, value: string) => void;
}

const AssignmentContent: React.FC<AssignmentContentProps> = ({
  assignment,
  editMode,
  editForm,
  onEditFormChange
}) => {
  return (
    <Card elevation={0} sx={{ border: 1, borderColor: 'grey.200', borderRadius: 3 }}>
      <CardContent sx={{ p: 4 }}>
        {/* Description Section */}
        {(assignment.description || editMode) && (
          <>
            <Box mb={4}>
              <Typography variant="h6" fontWeight="700" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DescriptionIcon sx={{ fontSize: 20 }} />
                Description
              </Typography>
              {editMode ? (
                <TextField
                  value={editForm.description}
                  onChange={(e) => onEditFormChange('description', e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                  placeholder="Assignment description..."
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              ) : (
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                  {assignment.description || 'No description provided.'}
                </Typography>
              )}
            </Box>
            <Divider sx={{ my: 3 }} />
          </>
        )}

        {/* Instructions Section */}
        <Box>
          <Typography variant="h6" fontWeight="700" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BookIcon sx={{ fontSize: 20 }} />
            Assignment Instructions
          </Typography>
          {editMode ? (
            <TextField
              value={editForm.prompt}
              onChange={(e) => onEditFormChange('prompt', e.target.value)}
              fullWidth
              multiline
              rows={12}
              variant="outlined"
              placeholder="Enter assignment instructions and requirements..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: 'grey.50'
                }
              }}
            />
          ) : (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                bgcolor: 'grey.50',
                borderRadius: 2,
                border: 1,
                borderColor: 'grey.200'
              }}
            >
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                {assignment.prompt}
              </Typography>
            </Paper>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default AssignmentContent;