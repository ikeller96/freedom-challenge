import React from 'react';
import LeadsList from './LeadsList';
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from './catalyst-ui-kit/typescript/navbar';

const MainPage: React.FC = () => {
    return (
        <div className="bg-gray-900 min-h-screen text-white flex flex-col items-center">
            {/* Header / Navbar */}
            <Navbar className="w-full bg-gray-800">
                <NavbarSection>
                    <h1 className="text-2xl font-semibold p-4">Freedom Challenge</h1>
                </NavbarSection>
            </Navbar>

            {/* Main Content */}
            <div className="w-full max-w-7xl p-6">
                <LeadsList />
            </div>
        </div>
    );
};

export default MainPage;