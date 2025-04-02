
import React from 'react';
import { LeadList } from '../leads/LeadList';
import { LeadDetail } from '../leads/LeadDetail';
import { FeedbackPanel } from '../feedback/FeedbackPanel';
import { VoicePanel } from '../voice/VoicePanel';
import { useLeads } from '../../contexts/LeadContext';

export const MainContent: React.FC = () => {
  const { selectedLead } = useLeads();

  return (
    <div className="flex-1 flex flex-col">
      {/* Top section - Lead List and Detail */}
      <div className="flex-1 flex">
        <div className="w-2/5 border-r border-gray-200">
          <LeadList />
        </div>
        <div className="w-3/5">
          {selectedLead ? (
            <LeadDetail />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-gray-500">
                <h3 className="text-xl font-semibold mb-2">No Lead Selected</h3>
                <p>Select a lead from the list to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Bottom section - Feedback and Voice */}
      <div className="h-64 border-t border-gray-200 flex">
        <div className="w-1/2 border-r border-gray-200">
          <FeedbackPanel />
        </div>
        <div className="w-1/2">
          <VoicePanel />
        </div>
      </div>
    </div>
  );
};
