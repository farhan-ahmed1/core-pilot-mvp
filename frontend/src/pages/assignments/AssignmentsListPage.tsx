import React from 'react';
import {
  Box,
  Alert,
  Snackbar,
} from '@mui/material';

// Import modular components
import AssignmentFilters from '../../components/assignments/AssignmentFilters';
import AssignmentGrid from '../../components/assignments/AssignmentGrid';
import AssignmentListView from '../../components/assignments/AssignmentListView';
import AssignmentEmptyState from '../../components/assignments/AssignmentEmptyState';
import AssignmentDialog from '../../components/assignments/AssignmentDialog';
import LoadingScreen from '../../components/common/LoadingScreen';

// Import custom hook
import { useAssignmentList } from '../../hooks/useAssignmentList';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`assignments-tabpanel-${index}`}
      aria-labelledby={`assignments-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AssignmentsListPage: React.FC = () => {
  const {
    // State
    assignments,
    courses,
    stats,
    loading,
    activeTab,
    viewMode,
    assignmentDialogOpen,
    filters,
    searchQuery,
    selectedCourse,
    snackbar,
    
    // Actions
    handleTabChange,
    handleSearchChange,
    handleSearchSubmit,
    handleCourseFilter,
    handleSortChange,
    handleOrderChange,
    handleViewModeChange,
    handleAssignmentClick,
    handleCreateAssignment,
    handleAssignmentCreated,
    setAssignmentDialogOpen,
    setSnackbar,
    getCourseById,
  } = useAssignmentList();

  if (loading) {
    return <LoadingScreen message="Loading assignments..." />;
  }

  return (
    <>
      {/* Filters and Header */}
      <AssignmentFilters
        activeTab={activeTab}
        searchQuery={searchQuery}
        selectedCourse={selectedCourse}
        filters={filters}
        stats={stats}
        courses={courses}
        onTabChange={handleTabChange}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        onCourseFilter={handleCourseFilter}
        onSortChange={handleSortChange}
        onOrderChange={handleOrderChange}
        onCreateAssignment={handleCreateAssignment}
      />

      {/* Assignments Content */}
      <TabPanel value={activeTab} index={activeTab}>
        {assignments.length === 0 ? (
          <AssignmentEmptyState
            activeTab={activeTab}
            onCreateAssignment={handleCreateAssignment}
          />
        ) : viewMode === 'grid' ? (
          <AssignmentGrid
            assignments={assignments}
            courses={courses}
            onAssignmentClick={handleAssignmentClick}
            getCourseById={getCourseById}
          />
        ) : (
          <AssignmentListView
            assignments={assignments}
            courses={courses}
            onAssignmentClick={handleAssignmentClick}
            getCourseById={getCourseById}
          />
        )}
      </TabPanel>

      {/* Assignment Creation Dialog */}
      <AssignmentDialog
        open={assignmentDialogOpen}
        onClose={() => setAssignmentDialogOpen(false)}
        onAssignmentCreated={handleAssignmentCreated}
      />

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ borderRadius: 3 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AssignmentsListPage;