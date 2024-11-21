// src/App.js
import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './Components/Home';
import About from './Components/About';
import Contact from './Components/Contact';
import Navbar from './Components/Navbar';
import TeamLeadAuth from './Components/TeamLeadAuth';
import EmployeeAuth from './Components/EmployeeAuth';
import TeamLeadInterface from './Components/TeamLeadInterface';
import EmployeeInterface from './Components/EmployeeInterface'; // Import EmployeeInterface
import EmployeeDashboard from './Components/EmployeeDashboard';
import CreateTask from './Components/CreateTask';
import Progress from './Components/Progress';
import FileModules from './Components/FileModules';
import Deadlines from './Components/Deadlines';
import Queries from './Components/Queries';

const App = () => {
    // State for authentication
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Handle logout logic
    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('userRole');
    };

    // Conditional rendering of Navbar on certain pages
    const NavbarWrapper = ({ children }) => {
        const location = useLocation();
        const showNavbar = ['/', '/about', '/contact'].includes(location.pathname);

        return (
            <>
                {showNavbar && <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />}
                {children}
            </>
        );
    };

    return (
        <NavbarWrapper>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/team-lead-auth" element={<TeamLeadAuth setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/employee-auth" element={<EmployeeAuth setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/team-lead-interface" element={<TeamLeadInterface />} />
                <Route path="/employee-interface" element={<EmployeeInterface />} /> {/* Regular Employee Interface */}
                <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
                <Route path="/create-task" element={<CreateTask />} />
                <Route path="/progress" element={<Progress />} />
                <Route path="/file-modules" element={<FileModules />} />
                <Route path="/deadlines" element={<Deadlines />} />
                <Route path="/queries" element={<Queries />} />
                {/* Specific route for employee task by moduleId */}
                <Route path="/tasks/:moduleId" element={<Progress />} /> {/* Task-based Employee Interface */}
            </Routes>
        </NavbarWrapper>
    );
};

export default App;
