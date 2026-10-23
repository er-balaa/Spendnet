import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { InboxPage } from './pages/InboxPage';
import { ConversationDetailPage } from './pages/ConversationDetailPage';
import { RoutingAnalysisPage } from './pages/RoutingAnalysisPage';
import { ManagerBriefPage } from './pages/ManagerBriefPage';
import { ExportsPage } from './pages/ExportsPage';
import { ImportReplayPage } from './pages/ImportReplayPage';
import { fetchHealth } from './services/api';
import { UserGuideTour } from './components/UserGuideTour';
import { ThemeProvider } from './context/ThemeContext';

export const App: React.FC = () => {
  const [recordsCount, setRecordsCount] = useState<number>(44);
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchHealth()
      .then(data => {
        if (data.unique_records !== undefined) {
          setRecordsCount(data.unique_records);
        }
      })
      .catch(() => {});

    // Automatically trigger tour on first visit if not yet completed
    const hasSeenTour = localStorage.getItem('spendnest_tour_completed');
    if (!hasSeenTour) {
      const timer = setTimeout(() => {
        setIsTourOpen(true);
      }, 900);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="h-screen flex flex-col bg-[#090A0D] text-[#F3F4F6] selection:bg-[#D6ED17] selection:text-[#090A0D] transition-colors duration-200 overflow-hidden">
          <Navbar onOpenTour={() => setIsTourOpen(true)} />
          <div className="flex flex-1 min-h-0 overflow-hidden">
            <Sidebar recordsCount={recordsCount} onOpenTour={() => setIsTourOpen(true)} />
            <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden bg-[#090A0D] transition-colors duration-200">
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/inbox" element={<InboxPage />} />
                <Route path="/conversations/:sourceType/:sourceId" element={<ConversationDetailPage />} />
                <Route path="/routing" element={<RoutingAnalysisPage />} />
                <Route path="/brief" element={<ManagerBriefPage />} />
                <Route path="/exports" element={<ExportsPage />} />
                <Route path="/imports" element={<ImportReplayPage />} />
              </Routes>
            </main>
          </div>
          {/* Interactive User Guide Walkthrough Modal */}
          <UserGuideTour isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
