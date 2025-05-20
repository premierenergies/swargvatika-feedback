
import React from 'react';
import Footer from '../components/Footer';
import Logo from '../components/Logo';
import CremationFeedbackForm from '../components/CremationFeedbackForm';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-6xl py-4 flex justify-between items-center">
          <Logo />
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">About Us</a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Our Services</a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      <main className="flex-1 container max-w-6xl py-12">
        <div className="mb-8">
          <CremationFeedbackForm />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
