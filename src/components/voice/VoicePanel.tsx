
import React, { useState } from 'react';
import { useVoice } from '../../contexts/VoiceContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { DialogTrigger, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Mic, MicOff, Play, Settings } from 'lucide-react';

export const VoicePanel: React.FC = () => {
  const { voiceState, apiKey, setApiKey, startListening, stopListening, speakText } = useVoice();
  const [inputText, setInputText] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      speakText(inputText);
      setInputText('');
    }
  };

  const handleSaveApiKey = () => {
    setSettingsOpen(false);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Voice Assistant</h2>
        
        <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Voice Assistant Settings</DialogTitle>
              <DialogDescription>
                Connect to ElevenLabs API to enable voice features.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <label htmlFor="apiKey" className="block text-sm font-medium mb-2">
                ElevenLabs API Key
              </label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
              />
              <p className="mt-2 text-xs text-gray-500">
                Get your API key from the ElevenLabs dashboard.
              </p>
            </div>
            
            <DialogFooter>
              <Button onClick={handleSaveApiKey}>Save Settings</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {voiceState.transcript && (
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-500 mb-1">You said:</div>
            <div className="bg-gray-50 p-3 rounded-md text-sm">
              {voiceState.transcript}
            </div>
          </div>
        )}
        
        {voiceState.lastResponse && (
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-500 mb-1">Response:</div>
            <div className="bg-blue-50 p-3 rounded-md text-sm">
              {voiceState.lastResponse}
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            disabled={voiceState.isListening || voiceState.isSpeaking}
          />
          <Button 
            type="submit" 
            disabled={voiceState.isListening || voiceState.isSpeaking || !inputText.trim()}
          >
            <Play className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={voiceState.isListening ? "destructive" : "default"}
            onClick={voiceState.isListening ? stopListening : startListening}
            disabled={voiceState.isSpeaking}
          >
            {voiceState.isListening ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
