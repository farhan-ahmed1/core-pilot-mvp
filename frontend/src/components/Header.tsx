import React from 'react';

const Header: React.FC = () => {
  return (
    <header>
      <h1>Application Title</h1>
      <nav>
        {/* Navigation items will go here */}
        <ul>
          <li>Dashboard</li>
          <li>Assignments</li>
          <li>Profile</li>
          <li>Logout</li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;