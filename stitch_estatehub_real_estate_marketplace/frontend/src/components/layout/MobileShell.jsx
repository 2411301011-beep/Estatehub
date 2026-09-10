import React from 'react';
import Header from './Header';
import BottomNav from './BottomNav';
import Footer from './Footer';

const MobileShell = ({ children, hideHeader = false, hideNav = false, activeCity, onCityChange }) => {
  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col font-body antialiased">
      {!hideHeader && <Header activeCity={activeCity} onCityChange={onCityChange} />}
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 md:pb-12">
        {children}
      </main>
      
      {!hideNav && <Footer />}
      {!hideNav && <BottomNav />}
    </div>
  );
};

export default MobileShell;
