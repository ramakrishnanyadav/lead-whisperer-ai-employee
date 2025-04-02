
import React from 'react';
import { useLeads } from '../../contexts/LeadContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Check, X } from 'lucide-react';

export const FeedbackPanel: React.FC = () => {
  const { feedbackItems, resolveFeedback } = useLeads();

  const pendingFeedback = feedbackItems.filter(item => item.status === 'pending');

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Human Feedback</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {pendingFeedback.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p>No pending feedback requests</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingFeedback.map((item) => (
              <Card key={item.id} className="animate-slide-up">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Feedback Requested</CardTitle>
                  <CardDescription className="text-xs">
                    {new Date(item.timestamp).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{item.comment}</p>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-500 border-red-200 hover:bg-red-50"
                    onClick={() => resolveFeedback(item.id, false)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-green-500 border-green-200 hover:bg-green-50"
                    onClick={() => resolveFeedback(item.id, true)}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
