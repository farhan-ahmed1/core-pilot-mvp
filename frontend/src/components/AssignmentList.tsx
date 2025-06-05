import React from 'react';

interface Assignment {
  id: number;
  title: string;
  dueDate: string;
  status: string;
}

const AssignmentList: React.FC = () => {
  // Mock data - will be replaced with API calls later
  const assignments: Assignment[] = [
    { id: 1, title: 'Project Proposal', dueDate: '2025-06-15', status: 'Pending' },
    { id: 2, title: 'Research Paper', dueDate: '2025-06-20', status: 'Not Started' },
  ];

  return (
    <div>
      <h2>Assignments</h2>
      <ul>
        {assignments.map((assignment) => (
          <li key={assignment.id}>
            <h3>{assignment.title}</h3>
            <p>Due: {assignment.dueDate}</p>
            <p>Status: {assignment.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssignmentList;