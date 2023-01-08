import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './DropMenu.css';

// DropMenu component - used as a component to display a dropdown menu for the Recommendation sidenav

function DropMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button className="blue-button" onClick={() => setIsOpen(!isOpen)}>Recommendation</button>
      {isOpen && (
        <ul>
          <li><Link to="/recommendation/sent">Sent</Link></li>
          <li><Link to="/recommendation/received">Received</Link></li>
        </ul>
      )}
    </div>
  );
}

export default DropMenu;