// Navbar.jsx
import React, { useState } from 'react';
import './Navbar.css';
import AdminPanel from "./AdminPanel";
import Withdraw from './withdraw';

const Navbar = () => {
    const [activeTab, setActiveTab] = useState('user');
console.log(activeTab)
    return (<>
        <nav className="navbar">
            <button 
                className={activeTab === 'user' ? 'active': ''} 
                onClick={() => setActiveTab('user')}
                >
                User Details
            </button>
            <button 
                className={activeTab === 'withdraw' ? 'active' : ''} 
                onClick={() => setActiveTab('Withdraw')}
                >
                Withdraw Details
            </button>
        </nav>

          <div className='table'>
          {activeTab === 'Withdraw'? <Withdraw/>: <AdminPanel/>}
       </div>
        </>
    );
};

export default Navbar;
