import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <aside>
      <h2>Menu</h2>
      <nav>
        <ul>
          <li>Dashboard</li>
          <li>Courses</li>
          <li>Assignments</li>
          <li>Settings</li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;