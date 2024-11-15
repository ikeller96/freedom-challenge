import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';

const App: React.FC = () => {
    return (
        <Router>
            <div className="bg-gray-900 text-white min-h-screen">
                <Routes>
                    {/* Main page with header and leads list */}
                    <Route path="/" element={<MainPage />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;