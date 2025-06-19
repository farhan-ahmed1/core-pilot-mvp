import { useState, useEffect } from 'react';
import { 
  getAssignmentStats, 
  getUpcomingAssignments, 
  AssignmentStats, 
  AssignmentListItem
} from '../services/assignmentService';

export const useDashboardData = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AssignmentStats | null>(null);
  const [upcomingAssignments, setUpcomingAssignments] = useState<AssignmentListItem[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, upcomingData] = await Promise.all([
        getAssignmentStats(),
        getUpcomingAssignments(4)
      ]);
      setStats(statsData);
      setUpcomingAssignments(upcomingData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadDashboardData();
  };

  return {
    loading,
    stats,
    upcomingAssignments,
    refreshData
  };
};