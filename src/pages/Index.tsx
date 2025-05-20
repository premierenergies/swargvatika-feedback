
import React from 'react';
import FeedbackForm from '../components/FeedbackForm';
import Footer from '../components/Footer';
import Logo from '../components/Logo';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-pattern">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-6xl py-4 flex justify-between items-center">
          <Logo />
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">About Us</a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Our Work</a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Contact</a>
            <a 
              href="#" 
              className="px-4 py-2 rounded-md bg-gradient-to-r from-saffron-500 to-green-500 text-white text-sm font-medium hover:from-saffron-600 hover:to-green-600 transition-all"
            >
              Donate Now
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1 container max-w-6xl py-12">
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Your Feedback Matters</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Help us improve our services and support our mission by sharing your thoughts or making a contribution.
          </p>
        </div>
        
        <FeedbackForm />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border rounded-lg p-6 shadow-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-saffron-100 rounded-full flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-saffron-500 rounded-full"></div>
            </div>
            <h3 className="font-semibold text-lg mb-2">Our Mission</h3>
            <p className="text-muted-foreground">Dedicated to spiritual growth and community welfare through compassionate service.</p>
          </div>
          
          <div className="bg-white border rounded-lg p-6 shadow-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-full"></div>
            </div>
            <h3 className="font-semibold text-lg mb-2">Community Impact</h3>
            <p className="text-muted-foreground">Transforming lives through education, healthcare, and spiritual guidance.</p>
          </div>
          
          <div className="bg-white border rounded-lg p-6 shadow-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-primary rounded-full"></div>
            </div>
            <h3 className="font-semibold text-lg mb-2">Get Involved</h3>
            <p className="text-muted-foreground">Join us through volunteering, donations, or participating in our community events.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
