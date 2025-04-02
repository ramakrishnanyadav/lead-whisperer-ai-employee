
import React from 'react';
import { LeadProvider } from '../../contexts/LeadContext';
import { VoiceProvider } from '../../contexts/VoiceContext';
import { Sidebar } from './Sidebar';
import { MainContent } from './MainContent';

export const Dashboard: React.FC = () => {
  return (
    <LeadProvider>
      <VoiceProvider>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar />
          <MainContent />
        </div>
      </VoiceProvider>
    </LeadProvider>
  );
};
