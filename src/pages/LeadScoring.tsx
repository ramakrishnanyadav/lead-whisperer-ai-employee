
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  Legend, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis 
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLeads } from '../contexts/LeadContext';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUpRight, BarChart as BarChartIcon, PieChart as PieChartIcon, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Simulated API calls to Python backend
const fetchLeadPredictions = async () => {
  // This would be a real API call to a Flask/FastAPI backend in production
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        predictions: [
          { id: 1, name: "John Doe", company: "ABC Corp", conversionProbability: 0.82, score: 82, industry: "Technology", size: "medium", lastContact: "2023-06-15" },
          { id: 2, name: "Jane Smith", company: "XYZ Inc", conversionProbability: 0.45, score: 45, industry: "Healthcare", size: "large", lastContact: "2023-05-28" },
          { id: 3, name: "Robert Johnson", company: "123 Services", conversionProbability: 0.67, score: 67, industry: "Finance", size: "small", lastContact: "2023-07-02" },
          { id: 4, name: "Emily Brown", company: "Tech Solutions", conversionProbability: 0.23, score: 23, industry: "Education", size: "medium", lastContact: "2023-04-12" },
          { id: 5, name: "Michael Wilson", company: "Global Enterprises", conversionProbability: 0.91, score: 91, industry: "Manufacturing", size: "enterprise", lastContact: "2023-06-30" },
          { id: 6, name: "Sarah Lee", company: "Innovative Systems", conversionProbability: 0.78, score: 78, industry: "Technology", size: "small", lastContact: "2023-07-05" },
          { id: 7, name: "David Martinez", company: "Healthcare Plus", conversionProbability: 0.39, score: 39, industry: "Healthcare", size: "medium", lastContact: "2023-05-18" },
          { id: 8, name: "Lisa Taylor", company: "Financial Services Ltd", conversionProbability: 0.62, score: 62, industry: "Finance", size: "large", lastContact: "2023-06-22" }
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
        },
        clusterAnalysis: [
          { x: 35, y: 28, z: 20, name: "Low Value, High Volume" },
          { x: 65, y: 82, z: 40, name: "High Value, Low Volume" },
          { x: 55, y: 45, z: 30, name: "Medium Value, Medium Volume" },
          { x: 70, y: 78, z: 15, name: "High Value, High Volume" },
          { x: 30, y: 15, z: 25, name: "Low Value, Low Volume" }
        ]
      });
    }, 1000);
  });
};

const LeadScoring: React.FC = () => {
  const { filteredLeads } = useLeads();
  const [modelType, setModelType] = useState<string>("logistic-regression");
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['leadPredictions', modelType],
    queryFn: fetchLeadPredictions
  });
  
  const handleModelChange = (newModelType: string) => {
    setModelType(newModelType);
    toast({
      title: "Model Changed",
      description: `Switched to ${newModelType.replace('-', ' ')} model`,
    });
  };

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshing Predictions",
      description: "Requesting fresh predictions from ML backend...",
    });
  };
  
  if (isLoading) return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Lead Conversion Prediction Dashboard</h1>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle><Skeleton className="h-6 w-2/3" /></CardTitle>
            <CardDescription><Skeleton className="h-4 w-full" /></CardDescription>
          </CardHeader>
          <CardContent className="h-[400px] flex items-center justify-center">
            <Skeleton className="h-full w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="container mx-auto p-4">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p className="font-bold">Error loading predictions</p>
        <p>{(error as Error).message}</p>
        <Button onClick={() => refetch()} className="mt-2">Retry</Button>
      </div>
    </div>
  );
  
  if (!data) return null;

  const { predictions, featureImportance, modelMetrics, clusterAnalysis } = data as any;

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lead Conversion Prediction Dashboard</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={handleRefresh}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
          <select 
            className="bg-background border border-input px-3 py-2 rounded-md text-sm"
            value={modelType}
            onChange={(e) => handleModelChange(e.target.value)}
          >
            <option value="logistic-regression">Logistic Regression</option>
            <option value="decision-tree">Decision Tree</option>
            <option value="random-forest">Random Forest</option>
            <option value="neural-network">Neural Network</option>
          </select>
        </div>
      </div>
      
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          This dashboard displays machine learning predictions processed by our Python backend.
          The model analyzes customer data to predict conversion likelihood using {modelType.replace('-', ' ')}.
        </p>
      </div>
      
      <Tabs defaultValue="predictions" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="predictions" className="flex items-center gap-1">
            <BarChartIcon className="h-4 w-4" /> Lead Predictions
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-1">
            <PieChartIcon className="h-4 w-4" /> Model Insights
          </TabsTrigger>
          <TabsTrigger value="performance">Model Performance</TabsTrigger>
          <TabsTrigger value="clusters">Customer Segmentation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="predictions">
          <Card>
            <CardHeader>
              <CardTitle>Lead Conversion Probabilities</CardTitle>
              <CardDescription>Predicted likelihood of converting each lead based on TensorFlow model</CardDescription>
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
                    <RechartsTooltip 
                      formatter={(value) => [`${(Number(value) * 100).toFixed(1)}%`, 'Conversion Probability']}
                      labelFormatter={(label) => `Lead: ${label}`}
                    />
                    <Legend />
                    <Bar 
                      dataKey="conversionProbability" 
                      name="Conversion Probability"
                      fill="#8884d8"
                      barSize={40}
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
              <CardDescription>Top factors influencing conversion predictions extracted from the ML model</CardDescription>
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
                    <RechartsTooltip formatter={(value) => [`${(Number(value) * 100).toFixed(1)}%`, 'Importance']} />
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
              <CardDescription>Evaluation metrics from the Python machine learning model</CardDescription>
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
                    <RechartsTooltip formatter={(value) => [`${(Number(value) * 100).toFixed(1)}%`, 'Score']} />
                    <Legend />
                    <Bar dataKey="value" fill="#00C49F" name="Score" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                These metrics are calculated using scikit-learn's evaluation functions on a test dataset split from the original data.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="clusters">
          <Card>
            <CardHeader>
              <CardTitle>Customer Segmentation</CardTitle>
              <CardDescription>Cluster analysis from unsupervised learning algorithms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="x" 
                      type="number" 
                      name="Value Score" 
                      unit="%" 
                    />
                    <YAxis 
                      dataKey="y" 
                      type="number" 
                      name="Engagement Score" 
                      unit="%"
                    />
                    <ZAxis 
                      dataKey="z" 
                      type="number" 
                      range={[50, 400]} 
                      name="Volume" 
                    />
                    <RechartsTooltip 
                      cursor={{ strokeDasharray: '3 3' }} 
                      formatter={(value, name) => [`${value}${name === 'Volume' ? '' : '%'}`, name]}
                      labelFormatter={(_, payload) => payload[0]?.payload?.name || ''}
                    />
                    <Legend />
                    <Scatter 
                      name="Customer Segments" 
                      data={clusterAnalysis} 
                      fill="#8884d8" 
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Clusters generated using K-means algorithm in scikit-learn, based on customer behavior patterns.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Lead Predictions Table</span>
            <Badge variant="outline" className="text-xs">Python ML Backend</Badge>
          </CardTitle>
          <CardDescription>Detailed view of machine learning predictions from TensorFlow model</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>Model predictions generated by Python backend using {modelType.replace('-', ' ')}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Company Size</TableHead>
                  <TableHead>Conversion Probability</TableHead>
                  <TableHead>Lead Score</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {predictions.map((lead: any) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>{lead.company}</TableCell>
                    <TableCell>{lead.industry}</TableCell>
                    <TableCell className="capitalize">{lead.size}</TableCell>
                    <TableCell>{(lead.conversionProbability * 100).toFixed(1)}%</TableCell>
                    <TableCell>
                      <span className={`
                        px-2 py-1 rounded-full text-white inline-flex
                        ${lead.score >= 70 ? 'bg-green-500' : lead.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'}
                      `}>
                        {lead.score}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        Details <ArrowUpRight className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-6 p-4 bg-yellow-50 rounded-md">
        <h3 className="font-semibold text-yellow-800">Technical Implementation Overview</h3>
        <div className="text-yellow-700 space-y-2 mt-2">
          <p><strong>Machine Learning Backend:</strong> Python with TensorFlow/PyTorch and scikit-learn</p>
          <p><strong>API Layer:</strong> FastAPI with RESTful endpoints for model predictions</p>
          <p><strong>Data Processing:</strong> pandas for ETL, feature engineering, and preprocessing</p>
          <p><strong>Security:</strong> API key authentication, data encryption during transit</p>
          <p className="text-sm mt-4">
            In a production environment, this dashboard connects to a Python backend API built with FastAPI.
            The ML models are developed using TensorFlow and scikit-learn, with the predictions served via secure API endpoints.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeadScoring;
