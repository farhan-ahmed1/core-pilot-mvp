import React from 'react';

interface Course {
  id: number;
  title: string;
  description: string;
}

const CourseList: React.FC = () => {
  // Mock data - will be replaced with API calls later
  const courses: Course[] = [
    { id: 1, title: 'Introduction to Programming', description: 'Learn the basics of programming' },
    { id: 2, title: 'Web Development', description: 'HTML, CSS, and JavaScript fundamentals' },
  ];

  return (
    <div>
      <h2>Your Courses</h2>
      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            <h3>{course.title}</h3>
            <p>{course.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseList;