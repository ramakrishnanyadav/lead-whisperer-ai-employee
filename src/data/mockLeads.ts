
import { Lead, LeadStatus } from "../types";

// Generate a random date within the last 60 days
const randomRecentDate = () => {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 60);
  now.setDate(now.getDate() - daysAgo);
  return now.toISOString();
};

// Generate random interaction dates for a lead
const generateInteractions = (leadId: string) => {
  const interactionTypes = ['email', 'call', 'meeting', 'other'] as const;
  const interactionCount = Math.floor(Math.random() * 5) + 1;
  
  return Array.from({ length: interactionCount }).map((_, idx) => ({
    id: `interaction-${leadId}-${idx}`,
    type: interactionTypes[Math.floor(Math.random() * interactionTypes.length)],
    date: randomRecentDate(),
    notes: `Discussed shipping requirements and logistics needs.`
  }));
};

// Generate random tags for a lead
const generateTags = () => {
  const allTags = ['urgent', 'follow-up', 'key-account', 'price-sensitive', 'new-market', 'referral', 'repeat-customer'];
  const tagCount = Math.floor(Math.random() * 3) + 1;
  const shuffled = [...allTags].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, tagCount);
};

// Companies in logistics and adjacent industries
const companies = [
  'FastFreight Logistics', 'Global Shipping Co.', 'Express Cargo Solutions',
  'TransWorld Movers', 'Maritime Shipping Inc.', 'AirCargo Express',
  'Pacific Freight Systems', 'Continental Delivery', 'Nordic Transport Ltd.',
  'EastWest Supply Chain', 'Atlas Fulfillment', 'Horizon Distribution',
  'Velocity Logistics', 'Prime Shipping Group', 'Eagle Transport Services',
  'Summit Warehousing', 'Coastal Freight Lines', 'Central Storage Solutions'
];

// Locations relevant to logistics
const locations = [
  'Los Angeles, CA', 'New York, NY', 'Chicago, IL', 'Houston, TX',
  'Miami, FL', 'Seattle, WA', 'Atlanta, GA', 'Dallas, TX',
  'Toronto, Canada', 'Vancouver, Canada', 'London, UK', 'Rotterdam, Netherlands',
  'Singapore', 'Hong Kong', 'Shanghai, China', 'Tokyo, Japan',
  'Sydney, Australia', 'Dubai, UAE'
];

// Relevant industries
const industries = [
  'Freight Forwarding', 'eCommerce', 'Manufacturing', 'Retail',
  'Automotive', 'Pharmaceuticals', 'Electronics', 'Food & Beverage',
  'Construction', 'Chemical', 'Agriculture', 'Aerospace'
];

// Company sizes
const companySizes = ['small', 'medium', 'large', 'enterprise'] as const;

// Lead statuses
const statuses = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'] as LeadStatus[];

// Generate mock leads
export const generateMockLeads = (count: number = 25): Lead[] => {
  return Array.from({ length: count }).map((_, idx) => {
    const id = `lead-${idx + 1}`;
    const company = companies[Math.floor(Math.random() * companies.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Calculate score based on status and some randomness
    let baseScore = 0;
    switch(status) {
      case 'qualified': baseScore = 60; break;
      case 'proposal': baseScore = 70; break;
      case 'negotiation': baseScore = 80; break;
      case 'won': baseScore = 95; break;
      default: baseScore = 30; break;
    }
    const score = Math.min(100, Math.max(1, baseScore + (Math.floor(Math.random() * 20) - 10)));
    
    return {
      id,
      name: ['John Smith', 'Maria Rodriguez', 'David Chen', 'Sarah Johnson', 'Mohammed Al-Farsi', 
             'Priya Patel', 'Carlos Gomez', 'Emma Wilson', 'Hiroshi Tanaka', 'Olivia Brown'][Math.floor(Math.random() * 10)],
      company,
      position: ['Logistics Manager', 'Supply Chain Director', 'Operations Head', 'Procurement Manager', 
                 'CEO', 'Warehouse Manager', 'Fleet Director', 'VP of Operations'][Math.floor(Math.random() * 8)],
      email: `contact@${company.toLowerCase().replace(/\s/g, '')}.com`,
      phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      industry: industries[Math.floor(Math.random() * industries.length)],
      size: companySizes[Math.floor(Math.random() * companySizes.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      status,
      score,
      lastContact: randomRecentDate(),
      notes: "Looking for shipping solutions to optimize their supply chain.",
      createdAt: randomRecentDate(),
      tags: generateTags(),
      interactions: generateInteractions(id)
    };
  });
};

// Create an initial set of mock leads
export const mockLeads = generateMockLeads(25);
