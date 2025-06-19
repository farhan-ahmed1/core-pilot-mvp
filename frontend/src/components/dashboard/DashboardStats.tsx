import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Box,
  Typography,
  Skeleton,
  Fade,
  useTheme
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  TrendingUp as TrendingUpIcon,
  TrackChanges as TargetIcon,
} from '@mui/icons-material';
import type { AssignmentStats } from '../../services/assignmentService';

interface DashboardStatsProps {
  stats: AssignmentStats | null;
  loading: boolean;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, loading }) => {
  const theme = useTheme();

  if (loading || !stats) {
    return (
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[1, 2, 3, 4].map((item) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item}>
            <Card sx={{ p: 3, border: 1, borderColor: 'grey.200', borderRadius: 3 }}>
              <Skeleton variant="rectangular" height={60} />
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  // Safe access to stats properties with fallback values
  const totalAssignments = stats.total_assignments || 0;
  const overdue = stats.overdue || 0;
  const dueSoon = stats.due_soon || 0;
  const upcoming = stats.upcoming || 0;
  const completed = totalAssignments - overdue - dueSoon - upcoming;
  const completionRate = totalAssignments > 0 
    ? Math.round((completed / totalAssignments) * 100) 
    : 0;

  const statCards = [
    {
      title: 'Total Assignments',
      value: totalAssignments,
      icon: <TargetIcon />,
      bgColor: 'grey.100',
      iconColor: 'grey.600',
    },
    {
      title: 'Completed',
      value: completed,
      icon: <CheckCircleIcon />,
      bgColor: 'success.50',
      iconColor: 'success.600',
    },
    {
      title: 'Due Soon',
      value: dueSoon,
      icon: <AccessTimeIcon />,
      bgColor: 'warning.50',
      iconColor: 'warning.600',
    },
    {
      title: 'Completion Rate',
      value: completionRate,
      suffix: '%',
      icon: <TrendingUpIcon />,
      bgColor: 'primary.50',
      iconColor: 'primary.600',
    }
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {statCards.map((stat, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.title}>
          <Fade in timeout={400 + (index * 100)}>
            <Card
              elevation={0}
              sx={{
                border: 1,
                borderColor: 'grey.200',
                borderRadius: 3,
                transition: 'all 0.2s ease',
                '&:hover': {
                  boxShadow: theme.shadows[2]
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="caption" fontWeight="500" color="text.secondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" fontWeight="600" color="text.primary">
                      {stat.value}{stat.suffix || ''}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: stat.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {React.cloneElement(stat.icon, { 
                      sx: { fontSize: 24, color: stat.iconColor } 
                    })}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardStats;