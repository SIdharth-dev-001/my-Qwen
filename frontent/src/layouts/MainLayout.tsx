import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { MobileMenu } from '../components/layout/MobileMenu';
import { useSidebar } from '../hooks/useSidebar';

export function MainLayout() {
  const { isOpen: sidebarOpen } = useSidebar();

  return (
    <div className="flex h-screen w-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      
      {/* Sidebar Panel - Left Column (hidden/expanded dynamically) */}
      <div className="hidden md:flex h-full">
        <Sidebar />
      </div>

      {/* Main Content Area - Right Column */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Header />
        
        {/* Core Screen Content Wrapper */}
        <main className="flex-1 overflow-hidden relative bg-zinc-950">
          <Outlet />
        </main>
      </div>

      {/* Floating Action Mobile Drawer Menu */}
      <MobileMenu />

    </div>
  );
}

export default MainLayout;
