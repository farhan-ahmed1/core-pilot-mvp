import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Paper,
  Fade,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  Rocket as RocketIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';

interface DashboardStatsProps {
  totalCourses: number;
  totalAssignments: number;
  completedAssignments: number;
  completionRate: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalCourses,
  totalAssignments,
  completedAssignments,
  completionRate,
}) => {
  const theme = useTheme();

  const statsCards = [
    {
      title: 'Active Courses',
      value: totalCourses,
      icon: <SchoolIcon />,
      color: theme.palette.primary.main,
      bgColor: alpha(theme.palette.primary.main, 0.1),
    },
    {
      title: 'Total Assignments',
      value: totalAssignments,
      icon: <AssignmentIcon />,
      color: theme.palette.secondary.main,
      bgColor: alpha(theme.palette.secondary.main, 0.1),
    },
    {
      title: 'Completed',
      value: completedAssignments,
      icon: <TrendingUpIcon />,
      color: theme.palette.success.main,
      bgColor: alpha(theme.palette.success.main, 0.1),
    },
    {
      title: 'Completion Rate',
      value: `${Math.round(completionRate)}%`,
      icon: <TrendingUpIcon />,
      color: theme.palette.info.main,
      bgColor: alpha(theme.palette.info.main, 0.1),
    },
  ];

  return (
    <Fade in timeout={800}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          borderRadius: 4,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Box>
              <Typography
                variant="h3"
                component="h1"
                fontWeight="800"
                gutterBottom
              >
                Welcome to Your Learning Hub
              </Typography>
              <Typography
                variant="h6"
                sx={{ opacity: 0.9, fontWeight: 400 }}
              >
                Track your progress, manage assignments, and excel in your courses
              </Typography>
            </Box>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: alpha('#fff', 0.2),
                border: `3px solid ${alpha('#fff', 0.3)}`,
              }}
            >
              <RocketIcon sx={{ fontSize: 40 }} />
            </Avatar>
          </Box>

          <Grid container spacing={3}>
            {statsCards.map((stat) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.title}>
                <Card
                  sx={{
                    bgcolor: alpha('#fff', 0.1),
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${alpha('#fff', 0.2)}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      bgcolor: alpha('#fff', 0.15),
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        bgcolor: alpha('#fff', 0.2),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                      }}
                    >
                      {React.cloneElement(stat.icon, {
                        sx: { fontSize: 30, color: 'white' },
                      })}
                    </Box>
                    <Typography
                      variant="h4"
                      component="div"
                      fontWeight="700"
                      gutterBottom
                    >
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {stat.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Background decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            bgcolor: alpha('#fff', 0.05),
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 150,
            height: 150,
            borderRadius: '50%',
            bgcolor: alpha('#fff', 0.05),
            zIndex: 0,
          }}
        />
      </Paper>
    </Fade>
  );
};

export default DashboardStats;