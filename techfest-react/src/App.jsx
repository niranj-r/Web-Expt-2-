import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import EventModal from './components/EventModal';
import AuthModal from './components/AuthModal';
import MyRegistrationsModal from './components/MyRegistrationsModal';

import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import RegistrationPage from './pages/RegistrationPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';
import OrganizerPage from './pages/OrganizerPage';

const MainContent = () => {
  const { currentPage, setCurrentPage, toast } = useApp();
  const [selectedEventModal, setSelectedEventModal] = useState(null);
  
  // Auth & My Registration Modals State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState('login');
  const [myRegModalOpen, setMyRegModalOpen] = useState(false);

  const handleOpenAuth = (tab = 'login') => {
    setAuthInitialTab(tab);
    setAuthModalOpen(true);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onSelectEvent={evt => setSelectedEventModal(evt)} />;
      case 'events':
        return <EventsPage onSelectEvent={evt => setSelectedEventModal(evt)} />;
      case 'registration':
        return <RegistrationPage onOpenAuth={() => handleOpenAuth('register')} />;
      case 'gallery':
        return <GalleryPage />;
      case 'contact':
        return <ContactPage />;
      case 'organizer':
      case 'participants':
        return <OrganizerPage />;
      default:
        return <HomePage onSelectEvent={evt => setSelectedEventModal(evt)} />;
    }
  };

  return (
    <div className="app-root-container">
      <Navbar
        onOpenAuth={handleOpenAuth}
        onOpenMyRegistrations={() => setMyRegModalOpen(true)}
      />

      {/* Page View */}
      {renderPage()}

      {/* Floating Register Button on bottom-right */}
      <button
        type="button"
        className="register-button floating"
        onClick={() => setCurrentPage('registration')}
      >
        REGISTER
      </button>

      {/* Event Detail Modal */}
      {selectedEventModal && (
        <EventModal
          event={selectedEventModal}
          onClose={() => setSelectedEventModal(null)}
        />
      )}

      {/* Auth Modal (Login / Sign Up) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authInitialTab}
      />

      {/* User's Event Registrations Modal */}
      <MyRegistrationsModal
        isOpen={myRegModalOpen}
        onClose={() => setMyRegModalOpen(false)}
      />

      {/* Toast Notification */}
      {toast && (
        <div className={`toast-notification ${toast.type}`}>
          {toast.message}
        </div>
      )}

      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </ThemeProvider>
  );
};

export default App;
