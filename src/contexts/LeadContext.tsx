
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Lead, FeedbackItem } from '../types';
import { mockLeads } from '../data/mockLeads';
import { toast } from '../hooks/use-toast';

interface LeadContextType {
  leads: Lead[];
  filteredLeads: Lead[];
  selectedLead: Lead | null;
  feedbackItems: FeedbackItem[];
  loading: boolean;
  filterText: string;
  filterStatus: string;
  filterScore: [number, number];
  setFilterText: (text: string) => void;
  setFilterStatus: (status: string) => void;
  setFilterScore: (score: [number, number]) => void;
  selectLead: (id: string | null) => void;
  updateLead: (lead: Lead) => void;
  addFeedback: (feedback: Omit<FeedbackItem, 'id' | 'timestamp'>) => void;
  resolveFeedback: (id: string, approved: boolean) => void;
  refreshLeads: () => void;
}

const LeadContext = createContext<LeadContextType | undefined>(undefined);

export function LeadProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterText, setFilterText] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterScore, setFilterScore] = useState<[number, number]>([0, 100]);

  // Filtered leads based on search text, status, and score
  const filteredLeads = leads.filter(lead => {
    const textMatch = filterText === '' || 
      lead.name.toLowerCase().includes(filterText.toLowerCase()) ||
      lead.company.toLowerCase().includes(filterText.toLowerCase()) ||
      lead.email.toLowerCase().includes(filterText.toLowerCase());
    
    const statusMatch = filterStatus === '' || lead.status === filterStatus;
    const scoreMatch = lead.score >= filterScore[0] && lead.score <= filterScore[1];
    
    return textMatch && statusMatch && scoreMatch;
  });

  const selectLead = useCallback((id: string | null) => {
    if (!id) {
      setSelectedLead(null);
      return;
    }
    
    const lead = leads.find(l => l.id === id);
    setSelectedLead(lead || null);
  }, [leads]);

  const updateLead = useCallback((updatedLead: Lead) => {
    setLeads(prevLeads => 
      prevLeads.map(lead => lead.id === updatedLead.id ? updatedLead : lead)
    );
    
    if (selectedLead?.id === updatedLead.id) {
      setSelectedLead(updatedLead);
    }
    
    toast({
      title: "Lead Updated",
      description: `Successfully updated lead for ${updatedLead.name} from ${updatedLead.company}`,
    });
  }, [selectedLead]);

  const addFeedback = useCallback((feedback: Omit<FeedbackItem, 'id' | 'timestamp'>) => {
    const newFeedback: FeedbackItem = {
      ...feedback,
      id: `feedback-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    
    setFeedbackItems(prev => [...prev, newFeedback]);
    
    toast({
      title: "Feedback Requested",
      description: "Your input is required on a lead assessment.",
    });
  }, []);

  const resolveFeedback = useCallback((id: string, approved: boolean) => {
    setFeedbackItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, status: approved ? 'approved' : 'rejected' } 
          : item
      )
    );
    
    if (approved) {
      toast({
        title: "Feedback Approved",
        description: "The AI's assessment has been approved and will be applied.",
      });
    } else {
      toast({
        title: "Feedback Rejected",
        description: "The AI's assessment has been rejected.",
      });
    }
  }, []);

  const refreshLeads = useCallback(() => {
    setLoading(true);
    // In a real app, this would be an API call
    setTimeout(() => {
      // For now, we're just simulating a refresh with the same data
      setLeads([...mockLeads]);
      setLoading(false);
      toast({
        title: "Leads Refreshed",
        description: "Latest lead data has been loaded.",
      });
    }, 1000);
  }, []);

  return (
    <LeadContext.Provider value={{
      leads,
      filteredLeads,
      selectedLead,
      feedbackItems,
      loading,
      filterText,
      filterStatus,
      filterScore,
      setFilterText,
      setFilterStatus,
      setFilterScore,
      selectLead,
      updateLead,
      addFeedback,
      resolveFeedback,
      refreshLeads
    }}>
      {children}
    </LeadContext.Provider>
  );
}

export const useLeads = () => {
  const context = useContext(LeadContext);
  if (context === undefined) {
    throw new Error("useLeads must be used within a LeadProvider");
  }
  return context;
};
