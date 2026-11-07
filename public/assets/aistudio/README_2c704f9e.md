# COMPETRA AI
### "Remember Every Move. Understand Every Strategy."
**AI-Powered Competitor Monitoring, Historical Memory & Strategic Intelligence Platform**

COMPETRA AI is an enterprise-grade competitive intelligence platform designed to continuously collect public business intelligence, retain competitor observations over time using **Hindsight**, identify longitudinal strategic patterns, detect unusual behavioral anomalies, and generate evidence-supported executive decisions.

---

## 1. Problem Statement & The Memory Gap

Most traditional monitoring systems and standard AI assistants suffer from **recency bias** and **session amnesia**:
- They only evaluate the latest news headline in isolation.
- They cannot compare an announced price against baselines from three quarters prior.
- They fail to recognize when a launch date has drifted by 60 days compared to historical precedents.
- They cannot reflect across accumulated observations to detect deliberate shifts in competitor behavior.

**COMPETRA AI bridges this gap by making Hindsight long-term memory the central intelligence engine of the agent.**

---

## 2. Core Architecture & System Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             COMPETRA AI PLATFORM                            │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
         ┌────────────────────────────┴──────────────────────────┐
         ▼                                                       ▼
┌───────────────────────────────────┐           ┌───────────────────────────────────┐
│     INTELLIGENCE COLLECTION       │           │       HINDSIGHT MEMORY ENGINE     │
│ - Company Newsrooms & RSS         │           │ - Partitioned Memory Banks:       │
│ - Manual URL & Press Releases     │           │   competra-samsung, apple, etc.   │
│ - Strict Deduplication Filter     │──────────>│ - 1. RETAIN (Semantic Ingestion)  │
│ - Delta & Price Change Detection  │           │ - 2. RECALL (Temporal Relevance)  │
│ - Source Verification & Dates     │           │ - 3. REFLECT (Pattern Synthesis)  │
└───────────────────────────────────┘           └───────────────────────────────────┘
                                                                  │
                                                                  ▼
┌───────────────────────────────────┐           ┌───────────────────────────────────┐
│       MODULAR LLM REASONING       │           │      ENTERPRISE SaaS MODULES      │
│ - Google Gemini 2.5 Flash SDK     │<──────────│ - Intelligence Overview Dashboard │
│ - Groq API (Llama-3.3-70B)        │           │ - Price & Product Matrix          │
│ - Embedded Strategic Engine       │           │ - Anomaly & Trend Radar           │
│ - Dual Assistant vs Agent Mode    │           │ - Knowledge Graph & Strategy Sim  │
└───────────────────────────────────┘           │ - Executive Reports & Battlecards │
                                                └───────────────────────────────────┘
```

---

## 3. The 3 Core Hindsight Operations

### 1. RETAIN
Whenever a competitor announcement, product launch, or pricing change is ingested:
- The observation is normalized and structured with verified dates, category, and source URLs.
- The item is saved into the competitor's partitioned memory bank (`competra-samsung`, `competra-apple`, etc.).
- Semantic vectors, metadata tags, and a permanent memory ID are generated for auditability.

### 2. RECALL
When a user or strategist asks a question:
- The system queries the relevant memory banks using semantic matching and temporal recency weighting.
- Returns ranked memories with relevance scores, reasons for match, and original citations.
- Logs every recall event in the audit trail.

### 3. REFLECT
Rather than simple keyword retrieval, Hindsight reasons across accumulated memories in a bank to synthesize:
- **Recurring Patterns**: E.g. *"Preemptive mid-tier discounting 14 days before rival product launch events."*
- **Behavioral Shifts**: E.g. *"Pivot from hardware spec battles toward on-device AI and 7-year update commitments."*
- **Strategic Signals**: E.g. *"Raising ultra-flagship price ceilings while funding aggressive carrier trade-in subsidies."*

---

## 4. 19 Core Modules Implemented

1. **Intelligence Overview**: High-level KPIs, activity breakdown charts, trend velocity, category distribution.
2. **Competitor Watchlist**: Add, edit, remove competitors across Technology, Automotive, Fintech, Ecommerce, etc.
3. **Collection Engine**: Automated & manual source URL ingestion, deduplication, and baseline delta detection.
4. **Price Intelligence**: Historical SKU prices, % changes, price reductions/increases, and anomaly flags.
5. **Product & Feature Intelligence**: Side-by-side technical specification matrix, release dates, differentiators.
6. **Intelligence News Feed**: Filter by competitor, date, category, and importance with verified source links.
7. **Hindsight Memory Engine**: Core Retain, Recall, and Reflect operations with multi-bank separation.
8. **Hindsight Memory Explorer**: Interactive inspector for retained memories, recall logs, and reflection outputs.
9. **AI Intelligence Chat**: Dual-mode conversational agent (Hindsight Memory Agent vs Standard Assistant).
10. **Historical Strategy Timeline**: Multi-competitor chronological visual timeline spanning 2024–2026.
11. **Competitor Anomaly Detection**: Compares activities against historical baselines to flag irregular moves.
12. **Market Trend Radar**: Multi-axial radar chart classifying trends as emerging, growing, stable, or declining.
13. **Competitive Knowledge Graph**: Interactive SVG network linking Companies, Products, Features, and Price Actions.
14. **AI Strategy Simulator**: "What-if" scenario wargaming with historical precedents and predicted rival reactions.
15. **Automatic SWOT Analysis**: Evidence-backed SWOT distinguishing verified facts from strategic inferences.
16. **Executive Reports**: Professional periodic reports with executive summaries, PDF/Print view, and CSV export.
17. **Competitor Battlecards**: Sales-ready battlecards with kill points, differentiators, and landmines to avoid.
18. **Alert & Notification System**: In-app alert notification center for high-priority deviations.
19. **Daily & Weekly Briefings**: Automated 24-hour flash digests and weekly strategic trajectory reviews.

---

## 5. Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Recharts, Lucide Icons.
- **Backend**: Node.js & Express running TypeScript (`tsx server.ts`) with mounted Vite middlewares.
- **Memory Engine**: Hindsight architecture supporting official cloud endpoints or high-accuracy local embedded mode.
- **AI / LLM**: Modular LLM service supporting `@google/genai` (Gemini 2.5 Flash), Groq API, and embedded strategic fallback.
- **Database**: In-memory & structured store pre-seeded with verified demonstration intelligence for Apple, Samsung, Google, and OnePlus.

---

## 6. Environment Configuration

Copy `.env.example` to `.env`:
```bash
# Required for Gemini AI inference
GEMINI_API_KEY="your-gemini-key"

# Optional modular Groq API inference
GROQ_API_KEY="your-groq-key"

# Optional Hindsight API cloud service
HINDSIGHT_API_KEY="your-hindsight-key"
HINDSIGHT_API_URL="https://api.hindsight.ai/v1"

PORT=3000
```

---

## 7. Guided 10-Step Hindsight Demonstration Walkthrough

Click the **"Hindsight 10-Step Demo"** button in the top navigation bar to run the interactive step-by-step verification:
1. Verify Samsung in the watchlist.
2. Collect initial labelled observations (Galaxy S24 launch & A55 discount).
3. Retain initial observations in Hindsight.
4. Ingest subsequent observation with later timestamp (Z Fold 6 +$100 price hike).
5. Retain the new information in Hindsight.
6. Formulate user query: *"What changes has Samsung made over this period?"*
7. Recall relevant historical memories with semantic similarity scoring.
8. Reflect on accumulated memories to synthesize margin vs volume strategies.
9. Generate evidence-supported strategic answer with citations and confidence indicators.
10. Open Memory Explorer and compare Hindsight Agent against a single-update ordinary AI assistant.
