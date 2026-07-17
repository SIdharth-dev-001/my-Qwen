import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { ChatPage } from '../pages/Chat';
import { HistoryPage } from '../pages/History';
import { SettingsPage } from '../pages/Settings';
import { NotFoundPage } from '../pages/NotFound';

export function AppRoutes() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<ChatPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default AppRoutes;
