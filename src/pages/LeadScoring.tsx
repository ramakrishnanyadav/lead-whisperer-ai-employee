
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLeads } from '../contexts/LeadContext';

// This would be an actual API call to your Python backend in a real implementation
const fetchLeadPredictions = async () => {
  // Simulate API call with mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        predictions: [
          { id: 1, name: "John Doe", company: "ABC Corp", conversionProbability: 0.82, score: 82 },
          { id: 2, name: "Jane Smith", company: "XYZ Inc", conversionProbability: 0.45, score: 45 },
          { id: 3, name: "Robert Johnson", company: "123 Services", conversionProbability: 0.67, score: 67 },
          { id: 4, name: "Emily Brown", company: "Tech Solutions", conversionProbability: 0.23, score: 23 },
          { id: 5, name: "Michael Wilson", company: "Global Enterprises", conversionProbability: 0.91, score: 91 }
        ],
        featureImportance: [
          { name: "Last Contact Recency", value: 0.32 },
          { name: "Budget Size", value: 0.27 },
          { name: "Previous Purchases", value: 0.18 },
          { name: "Company Size", value: 0.15 },
          { name: "Industry", value: 0.08 }
        ],
        modelMetrics: {
          accuracy: 0.85,
          precision: 0.83,
          recall: 0.79,
          f1Score: 0.81
        }
      });
    }, 1000);
  });
};

const LeadScoring: React.FC = () => {
  const { filteredLeads } = useLeads();
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['leadPredictions'],
    queryFn: fetchLeadPredictions
  });
  
  if (isLoading) return <div className="flex justify-center items-center h-[60vh]">Loading lead predictions...</div>;
  if (error) return <div className="text-red-500">Error loading predictions: {(error as Error).message}</div>;
  if (!data) return null;

  const { predictions, featureImportance, modelMetrics } = data as any;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Format data for model performance metrics
  const performanceData = [
    { name: 'Accuracy', value: modelMetrics.accuracy },
    { name: 'Precision', value: modelMetrics.precision },
    { name: 'Recall', value: modelMetrics.recall },
    { name: 'F1 Score', value: modelMetrics.f1Score },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Lead Conversion Prediction Dashboard</h1>
      
      <div className="mb-6">
        <Button onClick={() => refetch()}>Refresh Predictions</Button>
        <p className="text-sm text-gray-500 mt-2">
          This dashboard displays machine learning predictions processed by our Python backend.
          The model analyzes customer data to predict conversion likelihood.
        </p>
      </div>
      
      <Tabs defaultValue="predictions" className="mb-6">
        <TabsList>
          <TabsTrigger value="predictions">Lead Predictions</TabsTrigger>
          <TabsTrigger value="insights">Model Insights</TabsTrigger>
          <TabsTrigger value="performance">Model Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="predictions">
          <Card>
            <CardHeader>
              <CardTitle>Lead Conversion Probabilities</CardTitle>
              <CardDescription>Predicted likelihood of converting each lead</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={predictions}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis 
                      domain={[0, 1]} 
                      tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                    />
                    <Tooltip 
                      formatter={(value) => [`${(Number(value) * 100).toFixed(1)}%`, 'Conversion Probability']}
                    />
                    <Legend />
                    <Bar 
                      dataKey="conversionProbability" 
                      name="Conversion Probability"
                      fill="#8884d8"
                      barSize={50}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle>Feature Importance</CardTitle>
              <CardDescription>Top factors influencing conversion predictions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={featureImportance}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {featureImportance.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${(Number(value) * 100).toFixed(1)}%`, 'Importance']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Model Performance Metrics</CardTitle>
              <CardDescription>Evaluation of the machine learning model</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={performanceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis 
                      domain={[0, 1]} 
                      tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                    />
                    <Tooltip formatter={(value) => [`${(Number(value) * 100).toFixed(1)}%`, 'Score']} />
                    <Legend />
                    <Bar dataKey="value" fill="#00C49F" name="Score" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Lead Predictions Table</CardTitle>
          <CardDescription>Detailed view of machine learning predictions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Name</th>
                  <th className="border p-2 text-left">Company</th>
                  <th className="border p-2 text-left">Conversion Probability</th>
                  <th className="border p-2 text-left">Lead Score</th>
                  <th className="border p-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((lead: any) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="border p-2">{lead.name}</td>
                    <td className="border p-2">{lead.company}</td>
                    <td className="border p-2">{(lead.conversionProbability * 100).toFixed(1)}%</td>
                    <td className="border p-2">
                      <span className={`
                        px-2 py-1 rounded-full text-white
                        ${lead.score >= 70 ? 'bg-green-500' : lead.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'}
                      `}>
                        {lead.score}
                      </span>
                    </td>
                    <td className="border p-2">
                      <Button variant="outline" size="sm">View Details</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-6 p-4 bg-yellow-50 rounded-md">
        <h3 className="font-semibold text-yellow-800">Integration Note</h3>
        <p className="text-yellow-700">
          In a production environment, this dashboard would connect to a Python backend API built with Flask or FastAPI.
          The ML model would be developed using TensorFlow or PyTorch, and the predictions would be served via REST API endpoints.
        </p>
      </div>
    </div>
  );
};

export default LeadScoring;
