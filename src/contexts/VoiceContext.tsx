import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { VoiceState } from '../types';
import { useToast } from '../hooks/use-toast';
import { useLeads } from './LeadContext';

interface VoiceContextType {
  voiceState: VoiceState;
  apiKey: string;
  setApiKey: (key: string) => void;
  startListening: () => void;
  stopListening: () => void;
  speakText: (text: string) => Promise<void>;
  processFeedback: (text: string) => void;
}

const ELEVENLABS_API_KEY_STORAGE = 'elevenlabs_api_key';

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export function VoiceProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const { addFeedback, selectedLead } = useLeads();
  
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isListening: false,
    isProcessing: false,
    isSpeaking: false,
    transcript: '',
    lastResponse: '',
  });
  
  const [apiKey, setApiKeyState] = useState<string>('');

  // Load API key from localStorage on component mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem(ELEVENLABS_API_KEY_STORAGE);
    if (storedApiKey) {
      setApiKeyState(storedApiKey);
    }
  }, []);

  // Set API key and save to localStorage
  const setApiKey = useCallback((key: string) => {
    setApiKeyState(key);
    localStorage.setItem(ELEVENLABS_API_KEY_STORAGE, key);
    if (key) {
      toast({
        title: "API Key Saved",
        description: "Your ElevenLabs API key has been saved",
      });
    }
  }, [toast]);

  const startListening = useCallback(() => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please set your ElevenLabs API key in settings to use voice features",
        variant: "destructive"
      });
      return;
    }

    setVoiceState(prev => ({
      ...prev,
      isListening: true,
      transcript: '',
    }));
    
    // In a real implementation, we would start the microphone recording here
    // This is a mock implementation
    setTimeout(() => {
      setVoiceState(prev => ({
        ...prev,
        isListening: false,
        isProcessing: true,
        transcript: "Can you analyze this lead and tell me if it's worth pursuing?"
      }));
      
      // Simulate processing
      setTimeout(() => {
        const response = "Based on the lead's profile and recent interactions, I'd rate this as a high-potential lead. The company size and industry match our ideal customer profile, and they've shown consistent engagement. Would you like me to prioritize this lead?";
        
        setVoiceState(prev => ({
          ...prev,
          isProcessing: false,
          lastResponse: response
        }));
        
        // Speak the response
        speakText(response);
        
        // Request feedback
        addFeedback({
          leadId: selectedLead?.id || '',
          feedbackType: 'recommendation',
          status: 'pending',
          comment: 'The AI suggests prioritizing this lead based on company profile and engagement metrics.',
        });
        
      }, 1500);
    }, 2000);
  }, [apiKey, toast, addFeedback, selectedLead]);

  const stopListening = useCallback(() => {
    setVoiceState(prev => ({
      ...prev,
      isListening: false,
    }));
  }, []);

  const speakText = useCallback(async (text: string) => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please set your ElevenLabs API key in settings to use voice features",
        variant: "destructive"
      });
      return;
    }

    setVoiceState(prev => ({
      ...prev,
      isSpeaking: true,
      lastResponse: text,
    }));

    // In a real implementation, we would call the ElevenLabs API here
    // This is a mock implementation
    console.log("Speaking:", text);
    
    // Simulate speaking delay based on text length
    await new Promise(resolve => setTimeout(resolve, text.length * 30));
    
    setVoiceState(prev => ({
      ...prev,
      isSpeaking: false,
    }));
  }, [apiKey, toast]);

  const processFeedback = useCallback((text: string) => {
    // In a real implementation, we would process the feedback with the AI
    console.log("Processing feedback:", text);
    
    if (!selectedLead) {
      toast({
        title: "No Lead Selected",
        description: "Please select a lead to provide feedback on",
      });
      return;
    }
    
    addFeedback({
      leadId: selectedLead.id,
      feedbackType: 'interaction',
      status: 'pending',
      comment: `User feedback: "${text}"`,
    });
    
    toast({
      title: "Feedback Recorded",
      description: "Your feedback has been recorded and will be used to improve lead assessments",
    });
  }, [toast, selectedLead, addFeedback]);

  return (
    <VoiceContext.Provider value={{
      voiceState,
      apiKey,
      setApiKey,
      startListening,
      stopListening,
      speakText,
      processFeedback,
    }}>
      {children}
    </VoiceContext.Provider>
  );
}

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (context === undefined) {
    throw new Error("useVoice must be used within a VoiceProvider");
  }
  return context;
};
