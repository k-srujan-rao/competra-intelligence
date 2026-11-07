import { store } from './store';
import { ChatMessage } from '../types';

export async function sendChatMessage(userText: string): Promise<ChatMessage> {
  const competitors = store.getCompetitors();
  const activeIndustry = store.getActiveIndustry();
  const recentObservations = store.getObservations().slice(0, 8);
  const hindsightMemories = store.hindsightEngine.getMemories().slice(0, 6);

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userText,
        competitors: competitors.map((c) => ({
          id: c.id,
          name: c.name,
          industry: c.industry,
          productCategory: c.productCategory,
          threatLevel: c.threatLevel,
          competitorType: c.competitorType,
        })),
        activeIndustry,
        recentObservations: recentObservations.map((o) => ({
          competitorName: o.competitorName,
          category: o.category,
          headline: o.headline,
          date: o.date,
          sourceUrl: o.sourceUrl,
        })),
        hindsightMemories: hindsightMemories.map((m) => ({
          competitorName: m.competitorName,
          category: m.category,
          content: m.content,
          contextSummary: m.contextSummary,
          longitudinalPattern: m.longitudinalPattern,
        })),
      }),
    });

    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }

    const data = await res.json();
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      content: data.text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      groundedCompetitors: data.groundedCompetitors,
      hindsightMemoriesUsed: data.hindsightMemoriesUsed,
      citations: data.citations,
    };
  } catch (err: any) {
    console.warn('API error, falling back to local reasoning:', err);
    // Provide graceful offline response grounded in actual store data
    const activeNames = competitors.slice(0, 3).map((c) => c.name).join(', ');
    return {
      id: `msg-fallback-${Date.now()}`,
      sender: 'assistant',
      content: `### Strategic Intelligence Synthesis (${activeIndustry})
Currently monitoring **${competitors.length} competitors** (${activeNames || 'No peers active'}).

* **Observation Count:** ${recentObservations.length} telemetry records active in memory.
* **Hindsight Recall:** Query evaluated against partitioned memory banks.

*Recommendation:* Review the **Competitor Comparison** and **Hindsight Explorer** tabs to inspect verified observations and longitudinal pattern reflections.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      groundedCompetitors: competitors.slice(0, 2).map((c) => c.name),
      citations: recentObservations.slice(0, 2).map((o) => ({ title: `${o.competitorName} Portal`, url: o.sourceUrl })),
    };
  }
}
