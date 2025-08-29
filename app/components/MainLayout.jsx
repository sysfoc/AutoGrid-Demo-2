"use client";
import { useState } from "react";
import Header from "./Header";
import SearchCallToAction from "./SearchCallToAction"

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleOpenSearch = () => {
    setIsSidebarOpen(true);
  };
    const handleCloseSearch = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
     <Header 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        onSidebarClose={handleCloseSearch}
      />
      
      <main className="pt-16"> 
        {children}
        
        {/* <SearchCallToAction onSearchClick={handleOpenSearch} /> */}
      </main>
    </div>
  );
};

export default MainLayout;