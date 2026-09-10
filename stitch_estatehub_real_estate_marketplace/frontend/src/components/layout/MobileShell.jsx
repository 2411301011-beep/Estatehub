import React from 'react';
import Header from './Header';
import BottomNav from './BottomNav';

const MobileShell = ({ children, hideHeader = false, hideNav = false, activeCity, onCityChange }) => {
  return (
    <div className="min-h-screen bg-neutral-900 flex justify-center items-start md:py-6 sm:px-4">
      {/* Container framing mobile-first view, fluid desktop fallback */}
      <div className="w-full max-w-md bg-background min-h-screen md:min-h-[860px] md:max-h-[920px] md:rounded-3xl shadow-2xl relative overflow-hidden flex flex-col border-0 md:border md:border-outline-variant/30">
        {!hideHeader && <Header activeCity={activeCity} onCityChange={onCityChange} />}
        
        <main className="flex-1 overflow-y-auto pb-24 no-scrollbar">
          {children}
        </main>
        
        {!hideNav && <BottomNav />}
      </div>
    </div>
  );
};

export default MobileShell;
