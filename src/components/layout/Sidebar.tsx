
import React from 'react';
import { useLeads } from '../../contexts/LeadContext';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { BarChart3, Search, RefreshCcw } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    filterText, 
    setFilterText, 
    filterStatus, 
    setFilterStatus, 
    filterScore, 
    setFilterScore, 
    loading,
    refreshLeads
  } = useLeads();

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col h-screen">
      <div className="flex items-center mb-8">
        <BarChart3 className="h-6 w-6 text-brand-600 mr-2" />
        <h1 className="text-xl font-bold text-gray-800">Lead Whisperer</h1>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search leads..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Lead Status</label>
        <select
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="proposal">Proposal</option>
          <option value="negotiation">Negotiation</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Lead Score: {filterScore[0]} - {filterScore[1]}
        </label>
        <Slider
          defaultValue={[filterScore[0], filterScore[1]]}
          min={0}
          max={100}
          step={1}
          onValueChange={(value) => setFilterScore(value as [number, number])}
          className="my-4"
        />
      </div>

      <div className="mt-auto">
        <Button 
          onClick={refreshLeads} 
          className="w-full bg-brand-600 hover:bg-brand-700 text-white"
          disabled={loading}
        >
          {loading ? (
            <>
              <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh Leads
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
