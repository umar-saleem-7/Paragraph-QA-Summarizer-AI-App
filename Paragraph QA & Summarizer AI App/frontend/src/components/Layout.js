import React from 'react';
import Navbar from './Navbar';

function Layout({ children }) {
  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        {children}
      </div>
    </div>
  );
}

export default Layout;
