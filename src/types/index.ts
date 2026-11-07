export type IndustryType =
  | 'Technology'
  | 'Automotive'
  | 'E-commerce'
  | 'Pharmaceuticals'
  | 'Healthcare'
  | 'Fashion'
  | 'Banking and Finance'
  | 'Food and Beverage'
  | 'Telecommunications'
  | 'Education'
  | 'Real Estate'
  | 'Manufacturing'
  | 'Retail'
  | 'Other'
  | string;

export type CompetitorType =
  | 'Direct Competitor'
  | 'Indirect Competitor'
  | 'Emerging Threat'
  | 'Market Leader'
  | 'Low-Cost Disruptor'
  | 'Substitute / Alternate';

export type MonitoringPreference =
  | 'Price Changes'
  | 'Product Launches'
  | 'Executive Statements'
  | 'Marketing & Ads'
  | 'Patents & R&D'
  | 'Regulatory & Legal'
  | 'Partnerships & M&A';

export interface Competitor {
  id: string;
  name: string;
  website: string;
  industry: IndustryType;
  customIndustry?: string;
  description: string;
  country: string;
  productCategory: string;
  competitorType: CompetitorType;
  monitoringPreferences: MonitoringPreference[];
  monitoringEnabled: boolean;
  logoUrl?: string;
  brandColor?: string;
  foundedYear?: number;
  marketCapOrRevenue?: string;
  headquarters?: string;
  observationCount: number;
  lastMonitoredAt: string;
  latestActivity?: string;
  latestActivityCategory?: ActivityCategory;
  activityStatus: 'Active Monitoring' | 'Paused' | 'Alert Active';
  threatLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  productsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export type ActivityCategory =
  | 'Pricing'
  | 'Product Launch'
  | 'Feature Update'
  | 'Strategic Pivot'
  | 'Marketing Campaign'
  | 'Executive Leadership'
  | 'Partnership'
  | 'Patent / R&D'
  | 'Legal / Regulatory';

export type ImportanceLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export interface Observation {
  id: string;
  competitorId: string;
  competitorName: string;
  industry: IndustryType;
  category: ActivityCategory;
  headline: string;
  summary: string;
  details?: string;
  date: string;
  importance: ImportanceLevel;
  sourceUrl: string;
  sourceName: string;
  priceDelta?: {
    productName: string;
    oldPrice: number;
    newPrice: number;
    currency: string;
    percentChange: number;
  };
  productDelta?: {
    productName: string;
    featureChanged: string;
    previousState: string;
    newState: string;
  };
  retainedInHindsight: boolean;
  hindsightMemoryId?: string;
  tags: string[];
}

export interface HindsightMemory {
  id: string;
  bankId: string; // e.g. "competra-apple" or "competra-global"
  competitorId: string;
  competitorName: string;
  industry: IndustryType;
  timestamp: string;
  operation: 'RETAIN' | 'RECALL' | 'REFLECT';
  category: string;
  content: string;
  contextSummary: string;
  sourceUrl: string;
  semanticTags: string[];
  relevanceScore?: number;
  matchReason?: string;
  longitudinalPattern?: string;
  confidenceScore: number;
}

export interface ReflectionInsight {
  id: string;
  competitorId: string;
  competitorName: string;
  industry: IndustryType;
  title: string;
  timeframe: string;
  patternType: 'Recurring Pattern' | 'Behavioral Shift' | 'Strategic Signal' | 'Pricing Anomaly';
  synthesis: string;
  evidenceCount: number;
  memoryReferences: string[];
  strategicRecommendation: string;
  threatImpact: 'Offensive Advantage' | 'Defensive Threat' | 'Market Disruption' | 'Neutral';
  generatedAt: string;
}

export interface TrendItem {
  id: string;
  title: string;
  industry: IndustryType;
  stage: 'Emerging' | 'Growing' | 'Stable' | 'Declining';
  growthVelocity: number; // 0 to 100
  adoptionCount: number;
  pioneeringCompetitor: string;
  description: string;
  keyKeywords: string[];
}

export interface ProductItem {
  id: string;
  competitorId: string;
  competitorName: string;
  productName: string;
  category: string;
  releaseDate: string;
  currentPrice: number;
  currency: string;
  priceHistory: { date: string; price: number }[];
  keyFeatures: string[];
  status: 'Flagship' | 'Active' | 'Discounted' | 'Discontinued';
}

export interface SwotItem {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  evidenceBacked: boolean;
  lastUpdated: string;
}

export interface Battlecard {
  competitorId: string;
  competitorName: string;
  quickPitch: string;
  strengths: string[];
  vulnerabilities: string[];
  killPoints: string[];
  landminesToAvoid: string[];
  pricingComparison: string;
  howWeWin: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  groundedCompetitors?: string[];
  hindsightMemoriesUsed?: string[];
  citations?: { title: string; url: string }[];
  isThinking?: boolean;
}
