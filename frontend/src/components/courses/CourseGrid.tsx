import React from 'react';
import { Grid, Fade } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CourseCard from './CourseCard';
import { Course } from '../../services/courseService';

interface Assignment {
  id: number;
  courseId: number;
  title: string;
  dueDate: string;
  status: 'no_draft' | 'draft_saved' | 'feedback_ready';
}

interface CourseGridProps {
  courses: Course[];
  assignments: Assignment[];
  onCourseEdit: (courseId: number) => void;
  onCourseDelete: (courseId: number) => void;
  onAssignmentClick: (assignmentId: number) => void;
  onAddAssignment: (courseId: number) => void;
}

const CourseGrid: React.FC<CourseGridProps> = ({
  courses,
  assignments,
  onCourseEdit,
  onCourseDelete,
}) => {
  const navigate = useNavigate();

  const getAssignmentsForCourse = (courseId: number) => {
    return assignments.filter(assignment => assignment.courseId === courseId);
  };

  // Convert assignments to the format expected by CourseCard
  const convertAssignmentsForCourse = (courseId: number) => {
    const courseAssignments = getAssignmentsForCourse(courseId);
    return courseAssignments.map(assignment => ({
      id: assignment.id.toString(),
      title: assignment.title,
      due_date: assignment.dueDate,
      status: assignment.status === 'feedback_ready' ? 'completed' : 'in_progress',
    }));
  };

  // Convert course to CourseCard format
  const convertCourseForCard = (course: Course) => ({
    id: course.id.toString(),
    name: course.name,
    term: course.term,
    created_at: course.created_at,
    assignments: convertAssignmentsForCourse(course.id),
  });

  const handleEditCourse = (course: any) => {
    onCourseEdit(parseInt(course.id));
  };

  const handleDeleteCourse = (courseId: string) => {
    onCourseDelete(parseInt(courseId));
  };

  const handleViewAssignments = (courseId: string) => {
    navigate(`/courses/${courseId}/assignments`);
  };

  return (
    <Grid container spacing={3}>
      {courses.map((course, index) => (
        <Grid 
          key={course.id}
          size={{ xs: 12, md: 6, lg: 4 }}
        >
          <Fade in timeout={600 + index * 100}>
            <div>
              <CourseCard
                course={convertCourseForCard(course)}
                onEdit={handleEditCourse}
                onDelete={handleDeleteCourse}
                onViewAssignments={handleViewAssignments}
              />
            </div>
          </Fade>
        </Grid>
      ))}
    </Grid>
  );
};

export default CourseGrid;