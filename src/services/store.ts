import { Competitor, Observation, HindsightMemory, ReflectionInsight, TrendItem, ProductItem, IndustryType } from '../types';
import { INITIAL_COMPETITORS, INITIAL_OBSERVATIONS, INITIAL_MEMORIES, INITIAL_REFLECTIONS, INITIAL_TRENDS, INITIAL_PRODUCTS } from '../data/seedData';
import { HindsightEngine } from './hindsightEngine';

const STORAGE_KEYS = {
  COMPETITORS: 'competra_competitors_v2',
  OBSERVATIONS: 'competra_observations_v2',
  MEMORIES: 'competra_memories_v2',
  REFLECTIONS: 'competra_reflections_v2',
  TRENDS: 'competra_trends_v2',
  PRODUCTS: 'competra_products_v2',
  ACTIVE_INDUSTRY: 'competra_active_industry_v2',
  SELECTED_COMPARE: 'competra_selected_compare_v2',
  ONBOARDING_DONE: 'competra_onboarding_done_v2',
};

class DataStore {
  private competitors: Competitor[] = [];
  private observations: Observation[] = [];
  private trends: TrendItem[] = [];
  private products: ProductItem[] = [];
  private activeIndustry: IndustryType = 'All';
  private selectedForComparison: string[] = ['comp-apple', 'comp-samsung'];
  private onboardingDone: boolean = false;
  public hindsightEngine: HindsightEngine;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.hindsightEngine = new HindsightEngine(INITIAL_MEMORIES, INITIAL_REFLECTIONS);
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const storedComps = localStorage.getItem(STORAGE_KEYS.COMPETITORS);
      const storedObs = localStorage.getItem(STORAGE_KEYS.OBSERVATIONS);
      const storedMem = localStorage.getItem(STORAGE_KEYS.MEMORIES);
      const storedRef = localStorage.getItem(STORAGE_KEYS.REFLECTIONS);
      const storedTrends = localStorage.getItem(STORAGE_KEYS.TRENDS);
      const storedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      const storedInd = localStorage.getItem(STORAGE_KEYS.ACTIVE_INDUSTRY);
      const storedCompare = localStorage.getItem(STORAGE_KEYS.SELECTED_COMPARE);
      const storedOnboarding = localStorage.getItem(STORAGE_KEYS.ONBOARDING_DONE);

      this.competitors = storedComps ? JSON.parse(storedComps) : INITIAL_COMPETITORS;
      this.observations = storedObs ? JSON.parse(storedObs) : INITIAL_OBSERVATIONS;
      this.trends = storedTrends ? JSON.parse(storedTrends) : INITIAL_TRENDS;
      this.products = storedProducts ? JSON.parse(storedProducts) : INITIAL_PRODUCTS;
      this.activeIndustry = storedInd ? JSON.parse(storedInd) : 'All';
      this.selectedForComparison = storedCompare ? JSON.parse(storedCompare) : (this.competitors.length >= 2 ? [this.competitors[0].id, this.competitors[1].id] : []);
      this.onboardingDone = storedOnboarding ? JSON.parse(storedOnboarding) : false;

      const memories: HindsightMemory[] = storedMem ? JSON.parse(storedMem) : INITIAL_MEMORIES;
      const reflections: ReflectionInsight[] = storedRef ? JSON.parse(storedRef) : INITIAL_REFLECTIONS;
      
      this.hindsightEngine.setMemories(memories);
      this.hindsightEngine.setReflections(reflections);
    } catch (e) {
      console.warn('Storage parse fallback to seed data', e);
      this.competitors = [...INITIAL_COMPETITORS];
      this.observations = [...INITIAL_OBSERVATIONS];
      this.trends = [...INITIAL_TRENDS];
      this.products = [...INITIAL_PRODUCTS];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEYS.COMPETITORS, JSON.stringify(this.competitors));
      localStorage.setItem(STORAGE_KEYS.OBSERVATIONS, JSON.stringify(this.observations));
      localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(this.hindsightEngine.getMemories()));
      localStorage.setItem(STORAGE_KEYS.REFLECTIONS, JSON.stringify(this.hindsightEngine.getReflections()));
      localStorage.setItem(STORAGE_KEYS.TRENDS, JSON.stringify(this.trends));
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(this.products));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_INDUSTRY, JSON.stringify(this.activeIndustry));
      localStorage.setItem(STORAGE_KEYS.SELECTED_COMPARE, JSON.stringify(this.selectedForComparison));
      localStorage.setItem(STORAGE_KEYS.ONBOARDING_DONE, JSON.stringify(this.onboardingDone));
    } catch (e) {
      console.error('Failed saving to localStorage', e);
    }
    this.notify();
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  // --- Competitor Operations ---
  public getCompetitors(industryFilter?: IndustryType): Competitor[] {
    const filter = industryFilter ?? this.activeIndustry;
    if (!filter || filter === 'All') {
      return this.competitors;
    }
    return this.competitors.filter((c) => c.industry === filter || (filter === 'Other' && c.customIndustry));
  }

  public getCompetitorById(id: string): Competitor | undefined {
    return this.competitors.find((c) => c.id === id);
  }

  public addCompetitor(newCompData: Omit<Competitor, 'id' | 'createdAt' | 'updatedAt' | 'observationCount' | 'lastMonitoredAt' | 'activityStatus'>): Competitor {
    const id = `comp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    
    // Assign a distinctive brand color if not supplied
    const fallbackColors = ['#0071e3', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#6366f1'];
    const brandColor = newCompData.brandColor || fallbackColors[this.competitors.length % fallbackColors.length];

    const competitor: Competitor = {
      ...newCompData,
      id,
      brandColor,
      observationCount: 1,
      lastMonitoredAt: now,
      activityStatus: 'Active Monitoring',
      createdAt: now,
      updatedAt: now,
    };

    this.competitors.unshift(competitor);

    // Automatically create an initial baseline observation and retain into Hindsight!
    const baselineObs: Observation = {
      id: `obs-init-${Date.now()}`,
      competitorId: id,
      competitorName: competitor.name,
      industry: competitor.industry,
      category: 'Strategic Pivot',
      headline: `Initiated continuous strategic monitoring for ${competitor.name}`,
      summary: `${competitor.name} (${competitor.productCategory}) added to COMPETRA AI watchlist. Monitored for ${competitor.monitoringPreferences.join(', ')}.`,
      details: `Company profile registered: ${competitor.description} Based in ${competitor.country}. Primary website: ${competitor.website}.`,
      date: new Date().toISOString().split('T')[0],
      importance: 'Medium',
      sourceUrl: competitor.website.startsWith('http') ? competitor.website : `https://${competitor.website}`,
      sourceName: `${competitor.name} Official Portal`,
      retainedInHindsight: true,
      tags: [competitor.industry.toLowerCase(), competitor.competitorType.toLowerCase(), 'onboarding', 'baseline'],
    };

    this.observations.unshift(baselineObs);
    this.hindsightEngine.retain(baselineObs, competitor);

    // Auto-select for comparison if less than 2
    if (this.selectedForComparison.length < 2 && !this.selectedForComparison.includes(id)) {
      this.selectedForComparison.push(id);
    }

    this.saveToStorage();
    return competitor;
  }

  public updateCompetitor(id: string, updates: Partial<Competitor>): Competitor | undefined {
    const index = this.competitors.findIndex((c) => c.id === id);
    if (index === -1) return undefined;

    this.competitors[index] = {
      ...this.competitors[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.saveToStorage();
    return this.competitors[index];
  }

  public deleteCompetitor(id: string): boolean {
    const initialLen = this.competitors.length;
    this.competitors = this.competitors.filter((c) => c.id !== id);
    
    // Remove from selected compare
    this.selectedForComparison = this.selectedForComparison.filter((compId) => compId !== id);

    // If less than 2 selected and competitors exist, replenish
    if (this.selectedForComparison.length < 2 && this.competitors.length >= 2) {
      this.selectedForComparison = [this.competitors[0].id, this.competitors[1].id];
    } else if (this.selectedForComparison.length === 1 && this.competitors.length === 1) {
      this.selectedForComparison = [this.competitors[0].id];
    }

    if (this.competitors.length !== initialLen) {
      this.saveToStorage();
      return true;
    }
    return false;
  }

  public toggleMonitoring(id: string): boolean {
    const comp = this.competitors.find((c) => c.id === id);
    if (!comp) return false;
    comp.monitoringEnabled = !comp.monitoringEnabled;
    comp.activityStatus = comp.monitoringEnabled ? 'Active Monitoring' : 'Paused';
    this.saveToStorage();
    return comp.monitoringEnabled;
  }

  // --- Observation Operations ---
  public getObservations(competitorId?: string, industry?: IndustryType): Observation[] {
    let list = this.observations;
    if (competitorId && competitorId !== 'all') {
      list = list.filter((o) => o.competitorId === competitorId);
    }
    if (industry && industry !== 'All') {
      list = list.filter((o) => o.industry === industry);
    }
    return list;
  }

  public addObservation(obsData: Omit<Observation, 'id' | 'retainedInHindsight'>): Observation {
    const id = `obs-${Date.now()}`;
    const obs: Observation = {
      ...obsData,
      id,
      retainedInHindsight: true,
    };

    this.observations.unshift(obs);

    // Increment competitor observation count & latest activity
    const comp = this.competitors.find((c) => c.id === obs.competitorId);
    if (comp) {
      comp.observationCount = (comp.observationCount || 0) + 1;
      comp.latestActivity = obs.headline;
      comp.latestActivityCategory = obs.category;
      comp.lastMonitoredAt = new Date().toISOString();
      if (obs.importance === 'Critical') {
        comp.activityStatus = 'Alert Active';
      }
      // Retain in Hindsight!
      this.hindsightEngine.retain(obs, comp);
    }

    this.saveToStorage();
    return obs;
  }

  // --- Comparison Dock Operations ---
  public getSelectedForComparison(): string[] {
    return this.selectedForComparison;
  }

  public toggleComparisonCompetitor(id: string) {
    if (this.selectedForComparison.includes(id)) {
      this.selectedForComparison = this.selectedForComparison.filter((c) => c !== id);
    } else {
      if (this.selectedForComparison.length >= 4) {
        // limit to 4 max side-by-side
        this.selectedForComparison.shift();
      }
      this.selectedForComparison.push(id);
    }
    this.saveToStorage();
  }

  public setComparisonCompetitors(ids: string[]) {
    this.selectedForComparison = ids;
    this.saveToStorage();
  }

  // --- Industry Filter ---
  public getActiveIndustry(): IndustryType {
    return this.activeIndustry;
  }

  public setActiveIndustry(industry: IndustryType) {
    this.activeIndustry = industry;
    this.saveToStorage();
  }

  // --- Onboarding ---
  public isOnboardingDone(): boolean {
    return this.onboardingDone;
  }

  public setOnboardingDone(done: boolean) {
    this.onboardingDone = done;
    this.saveToStorage();
  }

  // --- Products & Trends ---
  public getProducts(competitorId?: string): ProductItem[] {
    if (competitorId && competitorId !== 'all') {
      return this.products.filter((p) => p.competitorId === competitorId);
    }
    return this.products;
  }

  public getTrends(industry?: IndustryType): TrendItem[] {
    if (industry && industry !== 'All') {
      return this.trends.filter((t) => t.industry === industry);
    }
    return this.trends;
  }

  // --- Reset & Seed ---
  public resetToDefaultPresets() {
    this.competitors = [...INITIAL_COMPETITORS];
    this.observations = [...INITIAL_OBSERVATIONS];
    this.trends = [...INITIAL_TRENDS];
    this.products = [...INITIAL_PRODUCTS];
    this.activeIndustry = 'All';
    this.selectedForComparison = ['comp-apple', 'comp-samsung'];
    this.hindsightEngine.setMemories([...INITIAL_MEMORIES]);
    this.hindsightEngine.setReflections([...INITIAL_REFLECTIONS]);
    this.onboardingDone = true;
    this.saveToStorage();
  }

  public clearAllData() {
    this.competitors = [];
    this.observations = [];
    this.trends = [];
    this.products = [];
    this.selectedForComparison = [];
    this.hindsightEngine.setMemories([]);
    this.hindsightEngine.setReflections([]);
    this.saveToStorage();
  }
}

export const store = new DataStore();
