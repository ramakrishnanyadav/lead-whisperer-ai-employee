
import React, { useState } from 'react';
import { useLeads } from '../../contexts/LeadContext';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Check, X, Building, Mail, Phone, MapPin, Tag } from 'lucide-react';

export const LeadDetail: React.FC = () => {
  const { selectedLead, updateLead } = useLeads();
  const [editMode, setEditMode] = useState(false);
  const [editedLead, setEditedLead] = useState(selectedLead);

  if (!selectedLead) return null;

  const handleEditToggle = () => {
    if (editMode) {
      updateLead(editedLead!);
    } else {
      setEditedLead(selectedLead);
    }
    setEditMode(!editMode);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedLead({
      ...editedLead!,
      [name]: value,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Lead Details</h2>
        <Button
          variant={editMode ? "default" : "outline"}
          onClick={handleEditToggle}
        >
          {editMode ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Save
            </>
          ) : (
            "Edit Lead"
          )}
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-6">
          {editMode ? (
            <Input
              name="name"
              value={editedLead?.name}
              onChange={handleChange}
              className="text-2xl font-bold"
            />
          ) : (
            <h1 className="text-2xl font-bold text-gray-900">{selectedLead.name}</h1>
          )}
          
          <div className="flex items-center">
            <div className="mr-3">
              <div className="text-sm text-gray-500 mb-1">Lead Score</div>
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full ${getScoreColor(selectedLead.score)} mr-2`}></div>
                <span className="font-semibold">{selectedLead.score}%</span>
              </div>
            </div>
            
            {editMode ? (
              <select
                name="status"
                value={editedLead?.status}
                onChange={handleChange}
                className="border rounded px-2 py-1"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="proposal">Proposal</option>
                <option value="negotiation">Negotiation</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
            ) : (
              <Badge
                variant={
                  selectedLead.status === 'won' 
                    ? 'success' 
                    : selectedLead.status === 'lost'
                    ? 'destructive'
                    : 'default'
                }
                className="capitalize"
              >
                {selectedLead.status}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Company Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center">
                <Building className="h-4 w-4 mr-2 text-gray-500" />
                {editMode ? (
                  <Input
                    name="company"
                    value={editedLead?.company}
                    onChange={handleChange}
                  />
                ) : (
                  <span>{selectedLead.company}</span>
                )}
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-500" />
                {editMode ? (
                  <Input
                    name="email"
                    value={editedLead?.email}
                    onChange={handleChange}
                  />
                ) : (
                  <span>{selectedLead.email}</span>
                )}
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-gray-500" />
                {editMode ? (
                  <Input
                    name="phone"
                    value={editedLead?.phone}
                    onChange={handleChange}
                  />
                ) : (
                  <span>{selectedLead.phone}</span>
                )}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                {editMode ? (
                  <Input
                    name="location"
                    value={editedLead?.location}
                    onChange={handleChange}
                  />
                ) : (
                  <span>{selectedLead.location}</span>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="text-sm text-gray-500">Position</span>
                <div>
                  {editMode ? (
                    <Input
                      name="position"
                      value={editedLead?.position}
                      onChange={handleChange}
                    />
                  ) : (
                    selectedLead.position
                  )}
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-500">Industry</span>
                <div>
                  {editMode ? (
                    <Input
                      name="industry"
                      value={editedLead?.industry}
                      onChange={handleChange}
                    />
                  ) : (
                    selectedLead.industry
                  )}
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-500">Company Size</span>
                <div>
                  {editMode ? (
                    <select
                      name="size"
                      value={editedLead?.size}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  ) : (
                    selectedLead.size.charAt(0).toUpperCase() + selectedLead.size.slice(1)
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="notes" className="mb-6">
          <TabsList>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="interactions">Interactions</TabsTrigger>
            <TabsTrigger value="tags">Tags</TabsTrigger>
          </TabsList>
          
          <TabsContent value="notes" className="pt-4">
            {editMode ? (
              <Textarea
                name="notes"
                value={editedLead?.notes}
                onChange={handleChange}
                rows={5}
                className="w-full"
              />
            ) : (
              <div className="bg-gray-50 p-4 rounded-md">
                {selectedLead.notes || "No notes available"}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="interactions" className="pt-4">
            {selectedLead.interactions.length === 0 ? (
              <div className="text-center text-gray-500 py-8">No interactions recorded</div>
            ) : (
              <div className="space-y-4">
                {selectedLead.interactions.map((interaction) => (
                  <Card key={interaction.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <Badge className="capitalize">{interaction.type}</Badge>
                        <span className="text-xs text-gray-500">
                          {formatDate(interaction.date)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{interaction.notes}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="tags" className="pt-4">
            <div className="flex flex-wrap gap-2">
              {selectedLead.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="px-3 py-1">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
