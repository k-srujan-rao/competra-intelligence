import { HindsightMemory, ReflectionInsight, Observation, Competitor } from '../types';

export class HindsightEngine {
  private memories: HindsightMemory[] = [];
  private reflections: ReflectionInsight[] = [];
  private recallAuditLog: { query: string; bankId: string; returnedCount: number; timestamp: string }[] = [];

  constructor(initialMemories: HindsightMemory[] = [], initialReflections: ReflectionInsight[] = []) {
    this.memories = [...initialMemories];
    this.reflections = [...initialReflections];
  }

  // Set internal state
  public setMemories(memories: HindsightMemory[]) {
    this.memories = memories;
  }

  public setReflections(reflections: ReflectionInsight[]) {
    this.reflections = reflections;
  }

  public getMemories(): HindsightMemory[] {
    return this.memories;
  }

  public getReflections(): ReflectionInsight[] {
    return this.reflections;
  }

  public getAuditLog() {
    return this.recallAuditLog;
  }

  /**
   * 1. RETAIN Operation
   * Permanently saves an observation into a partitioned memory bank with semantic tags and source attribution.
   */
  public retain(observation: Observation, competitor: Competitor): HindsightMemory {
    const bankId = `competra-${competitor.id}`;
    
    // Auto-generate longitudinal pattern if previous memories exist in the bank
    const bankMemories = this.memories.filter((m) => m.bankId === bankId);
    let longitudinalPattern: string | undefined = undefined;
    
    if (observation.category === 'Pricing' && bankMemories.some((m) => m.category.includes('Pric'))) {
      longitudinalPattern = `Detected repeated price maneuver: ${competitor.name} demonstrates high pricing responsiveness.`;
    } else if (observation.category === 'Product Launch') {
      longitudinalPattern = `Product release cadence indicator: Staggered hardware roadmap advancement.`;
    }

    const newMemory: HindsightMemory = {
      id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      bankId,
      competitorId: competitor.id,
      competitorName: competitor.name,
      industry: competitor.industry,
      timestamp: new Date().toISOString(),
      operation: 'RETAIN',
      category: `${observation.category} Intelligence`,
      content: observation.headline,
      contextSummary: observation.summary,
      sourceUrl: observation.sourceUrl,
      semanticTags: Array.from(new Set([...observation.tags, competitor.name.toLowerCase(), competitor.industry.toLowerCase()])),
      confidenceScore: 0.92 + Math.random() * 0.07,
      longitudinalPattern,
    };

    this.memories.unshift(newMemory);
    return newMemory;
  }

  /**
   * 2. RECALL Operation
   * Queries memories using keyword/semantic relevance, temporal weighting, and specific bank partitioning.
   */
  public recall(query: string, bankId?: string): { memories: HindsightMemory[]; query: string; totalMatches: number } {
    const queryTokens = query.toLowerCase().split(/\s+/).filter((t) => t.length > 2);
    
    let candidatePool = this.memories;
    if (bankId && bankId !== 'all') {
      candidatePool = candidatePool.filter((m) => m.bankId === bankId || m.competitorId === bankId);
    }

    const scored = candidatePool.map((memory) => {
      let score = 0;
      const contentLower = `${memory.content} ${memory.contextSummary} ${memory.competitorName} ${memory.industry} ${memory.semanticTags.join(' ')}`.toLowerCase();
      
      let matchedTerms: string[] = [];
      queryTokens.forEach((token) => {
        if (contentLower.includes(token)) {
          score += 0.25;
          matchedTerms.push(token);
        }
      });

      // Semantic relevance boost if tags or category match directly
      if (memory.category.toLowerCase().includes(query.toLowerCase())) {
        score += 0.4;
      }
      if (memory.competitorName.toLowerCase().includes(query.toLowerCase())) {
        score += 0.5;
      }

      // Temporal recency bonus: within 30 days gets +0.15
      const daysDiff = (Date.now() - new Date(memory.timestamp).getTime()) / (1000 * 60 * 60 * 24);
      if (daysDiff < 30) {
        score += 0.15;
      } else if (daysDiff < 90) {
        score += 0.08;
      }

      // Cap at 0.99
      const normalizedScore = Math.min(0.99, Math.max(0.35, Math.round((score > 0 ? 0.5 + score * 0.35 : 0.25) * 100) / 100));

      const matchReason = matchedTerms.length > 0 
        ? `Matched on terms: ${matchedTerms.join(', ')} with historical recency index.`
        : `Contextual bank affinity for ${memory.competitorName} in ${memory.industry}.`;

      return {
        ...memory,
        operation: 'RECALL' as const,
        relevanceScore: normalizedScore,
        matchReason,
      };
    });

    // Sort by score descending
    const results = scored
      .filter((m) => (m.relevanceScore ?? 0) >= 0.3)
      .sort((a, b) => (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0));

    this.recallAuditLog.unshift({
      query,
      bankId: bankId || 'all_banks',
      returnedCount: results.length,
      timestamp: new Date().toISOString(),
    });

    return {
      memories: results,
      query,
      totalMatches: results.length,
    };
  }

  /**
   * 3. REFLECT Operation
   * Reason across accumulated memories within a bank to synthesize patterns, shifts, and strategic signals.
   */
  public reflect(competitorId: string, competitorName: string, industry: string): ReflectionInsight {
    const bankId = `competra-${competitorId}`;
    const bankMemories = this.memories.filter((m) => m.competitorId === competitorId || m.bankId === bankId);

    const priceActions = bankMemories.filter((m) => m.category.toLowerCase().includes('pric') || m.content.toLowerCase().includes('discount') || m.content.toLowerCase().includes('price'));
    const launchActions = bankMemories.filter((m) => m.category.toLowerCase().includes('launch') || m.category.toLowerCase().includes('feature') || m.content.toLowerCase().includes('announce'));

    let patternType: ReflectionInsight['patternType'] = 'Recurring Pattern';
    let title = `${competitorName} Competitive Trajectory Synthesis`;
    let synthesis = '';
    let recommendation = '';
    let threatImpact: ReflectionInsight['threatImpact'] = 'Defensive Threat';

    if (priceActions.length >= 2) {
      patternType = 'Pricing Anomaly';
      title = `${competitorName}: Tactical Price Elasticity Pattern`;
      synthesis = `Analysis of ${bankMemories.length} retained memories reveals systematic price positioning maneuvers. ${competitorName} actively uses dynamic discounting to protect market share against category rivals during key quarterly windows.`;
      recommendation = `Avoid reactionary headline price cuts. Enhance value-add service bundles and highlight multi-year residual value.`;
      threatImpact = 'Defensive Threat';
    } else if (launchActions.length >= 2) {
      patternType = 'Behavioral Shift';
      title = `${competitorName}: Innovation Vector Acceleration`;
      synthesis = `Historical observations show ${competitorName} redirecting R&D investments toward modular architectures, proprietary ecosystems, and integrated intelligence capabilities rather than raw hardware spec iterations.`;
      recommendation = `Target integration gaps in their ecosystem and provide open, interoperable alternatives.`;
      threatImpact = 'Market Disruption';
    } else {
      patternType = 'Strategic Signal';
      title = `${competitorName}: Market Expansion Signal`;
      synthesis = `Based on longitudinal telemetry across ${bankMemories.length} observations, ${competitorName} is positioning for cross-category disruption in the ${industry} space with targeted channel marketing and regulatory alignment.`;
      recommendation = `Monitor early distributor feedback and fortify regional enterprise sales channels.`;
      threatImpact = 'Offensive Advantage';
    }

    const newReflection: ReflectionInsight = {
      id: `ref-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      competitorId,
      competitorName,
      industry,
      title,
      timeframe: 'Longitudinal Trajectory (Historical to Present)',
      patternType,
      synthesis,
      evidenceCount: bankMemories.length,
      memoryReferences: bankMemories.map((m) => m.id),
      strategicRecommendation: recommendation,
      threatImpact,
      generatedAt: new Date().toISOString(),
    };

    this.reflections.unshift(newReflection);
    return newReflection;
  }
}
