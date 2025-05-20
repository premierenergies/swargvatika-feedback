
import React from 'react';
import CremationFeedbackForm from '../components/CremationFeedbackForm';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 container max-w-6xl py-12">
        <div className="mb-8">
          <CremationFeedbackForm />
        </div>
      </main>
    </div>
  );
};

export default Index;
