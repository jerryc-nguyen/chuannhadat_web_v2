'use client';

import React, { createContext, useContext } from 'react';

interface AppContextType {
  isMobile: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({
  children,
  isMobile
}: {
  children: React.ReactNode;
  isMobile: boolean;
}) {
  return (
    <AppContext.Provider value={{ isMobile }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
} 
