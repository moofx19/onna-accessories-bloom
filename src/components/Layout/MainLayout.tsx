
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Cart from '../Cart';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-16 md:pt-20">
        {children}
      </main>
      <Footer />
      <Cart />
    </div>
  );
};

export default MainLayout;
