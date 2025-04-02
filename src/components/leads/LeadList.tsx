
import React from 'react';
import { useLeads } from '../../contexts/LeadContext';
import { Badge } from '../ui/badge';

export const LeadList: React.FC = () => {
  const { filteredLeads, selectedLead, selectLead } = useLeads();

  // Function to get score class
  const getScoreClass = (score: number) => {
    if (score >= 70) return 'lead-score-high';
    if (score >= 40) return 'lead-score-medium';
    return 'lead-score-low';
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Leads ({filteredLeads.length})</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredLeads.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p>No leads match your filters</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredLeads.map((lead) => (
              <div
                key={lead.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedLead?.id === lead.id ? 'bg-gray-100' : ''
                }`}
                onClick={() => selectLead(lead.id)}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-gray-900">{lead.name}</h3>
                  <span className={getScoreClass(lead.score)}>{lead.score}%</span>
                </div>
                
                <div className="text-sm text-gray-600 mb-2">{lead.company}</div>
                
                <div className="flex justify-between items-center">
                  <Badge
                    variant={
                      lead.status === 'won' 
                        ? 'success' 
                        : lead.status === 'lost'
                        ? 'destructive'
                        : 'default'
                    }
                    className="capitalize"
                  >
                    {lead.status}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    Last Contact: {formatDate(lead.lastContact)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
