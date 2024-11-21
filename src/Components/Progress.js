// src/components/Progress.js
import React from 'react';
import Sidebar from './Sidebar';
// import './Progress.css';

const Progress = () => {
    return (
        <div className="team-lead-interface">
            <Sidebar />
            <main className="main-content">
                <h1>Progress Page</h1>
                <p>Track your team's progress here.</p>
            </main>
        </div>
    );
};

export default Progress;
