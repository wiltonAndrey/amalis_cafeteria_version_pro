
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import { ScrollToTop } from './components/layout/ScrollToTop';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-transparent selection:bg-caramel selection:text-coffee overflow-x-hidden">
      <Navbar />
      <ScrollToTop />
      <main id="main-content" role="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/carta" element={<Menu />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
