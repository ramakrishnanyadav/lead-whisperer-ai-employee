
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';

export interface Lead {
  id: string;
  name: string;
  company: string;
  position: string;
  email: string;
  phone: string;
  industry: string;
  size: 'small' | 'medium' | 'large' | 'enterprise';
  location: string;
  status: LeadStatus;
  score: number;
  lastContact: string;
  notes: string;
  createdAt: string;
  tags: string[];
  interactions: LeadInteraction[];
}

export interface LeadInteraction {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'other';
  date: string;
  notes: string;
}

export interface FeedbackItem {
  id: string;
  leadId: string;
  feedbackType: 'score' | 'recommendation' | 'interaction';
  status: 'pending' | 'approved' | 'rejected';
  comment: string;
  timestamp: string;
}

export interface VoiceState {
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  transcript: string;
  lastResponse: string;
}
