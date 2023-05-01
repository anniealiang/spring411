import React from 'react';

function LogoutButton() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.reload(); // Reload the page to update the logged in status
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
}

export default LogoutButton;
