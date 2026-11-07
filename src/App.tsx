import React, { useState, useEffect, Suspense, useCallback, useMemo } from 'react';
import { store } from './services/store';
import { authService, AuthUser } from './services/authService';
import { Competitor, IndustryType } from './types';
import { Header } from './components/layout/Header';
import { Sidebar, ModuleKey } from './components/layout/Sidebar';
import { ComparisonTray } from './components/layout/ComparisonTray';
import { AddCompetitorModal } from './components/competitor/AddCompetitorModal';
import { CompetitorProfileDrawer } from './components/competitor/CompetitorProfileDrawer';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { HindsightDemoModal } from './components/common/HindsightDemoModal';
import { SplashScreen } from './components/common/SplashScreen';
import { AuthPage } from './components/auth/AuthPage';
import { ModuleSkeleton } from './components/common/ModuleSkeleton';

// Route-based code splitting & dynamic lazy loading
const OverviewModule = React.lazy(() =>
  import('./components/modules/OverviewModule').then((m) => ({ default: m.OverviewModule }))
);
const CompetitorsModule = React.lazy(() =>
  import('./components/modules/CompetitorsModule').then((m) => ({ default: m.CompetitorsModule }))
);
const ComparisonModule = React.lazy(() =>
  import('./components/modules/ComparisonModule').then((m) => ({ default: m.ComparisonModule }))
);
const FeedModule = React.lazy(() =>
  import('./components/modules/FeedModule').then((m) => ({ default: m.FeedModule }))
);
const PriceIntelligenceModule = React.lazy(() =>
  import('./components/modules/PriceIntelligenceModule').then((m) => ({ default: m.PriceIntelligenceModule }))
);
const ProductIntelligenceModule = React.lazy(() =>
  import('./components/modules/ProductIntelligenceModule').then((m) => ({ default: m.ProductIntelligenceModule }))
);
const StrategyTimelineModule = React.lazy(() =>
  import('./components/modules/StrategyTimelineModule').then((m) => ({ default: m.StrategyTimelineModule }))
);
const TrendRadarModule = React.lazy(() =>
  import('./components/modules/TrendRadarModule').then((m) => ({ default: m.TrendRadarModule }))
);
const KnowledgeGraphModule = React.lazy(() =>
  import('./components/modules/KnowledgeGraphModule').then((m) => ({ default: m.KnowledgeGraphModule }))
);
const HindsightExplorerModule = React.lazy(() =>
  import('./components/modules/HindsightExplorerModule').then((m) => ({ default: m.HindsightExplorerModule }))
);
const AiChatModule = React.lazy(() =>
  import('./components/modules/AiChatModule').then((m) => ({ default: m.AiChatModule }))
);
const StrategySimulatorModule = React.lazy(() =>
  import('./components/modules/StrategySimulatorModule').then((m) => ({ default: m.StrategySimulatorModule }))
);
const SwotModule = React.lazy(() =>
  import('./components/modules/SwotModule').then((m) => ({ default: m.SwotModule }))
);
const BattlecardsModule = React.lazy(() =>
  import('./components/modules/BattlecardsModule').then((m) => ({ default: m.BattlecardsModule }))
);
const ExecutiveReportsModule = React.lazy(() =>
  import('./components/modules/ExecutiveReportsModule').then((m) => ({ default: m.ExecutiveReportsModule }))
);

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(authService.getUser());
  const [, setTick] = useState(0);
  const [activeModule, setActiveModule] = useState<ModuleKey>('overview');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCompetitor, setEditingCompetitor] = useState<Competitor | null>(null);
  const [profileCompetitor, setProfileCompetitor] = useState<Competitor | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  // Subscribe to auth state
  useEffect(() => {
    const unsubAuth = authService.subscribe(() => {
      setCurrentUser(authService.getUser());
    });
    return unsubAuth;
  }, []);

  // Subscribe to store state
  useEffect(() => {
    const unsubStore = store.subscribe(() => {
      setTick((t) => t + 1);
    });
    return unsubStore;
  }, []);

  // Check first-time onboarding
  useEffect(() => {
    if (currentUser && !store.isOnboardingDone()) {
      setIsOnboardingOpen(true);
    }
  }, [currentUser]);

  // Dynamic Store Data with memoization
  const competitors = useMemo(() => store.getCompetitors(), []);
  const observations = useMemo(() => store.getObservations(), []);
  const memories = useMemo(() => store.hindsightEngine.getMemories(), []);
  const reflections = useMemo(() => store.hindsightEngine.getReflections(), []);
  const activeIndustry = store.getActiveIndustry();
  const selectedCompareIds = store.getSelectedForComparison();

  // Handlers
  const handleOpenAdd = useCallback(() => {
    setEditingCompetitor(null);
    setIsAddModalOpen(true);
  }, []);

  const handleEdit = useCallback((comp: Competitor) => {
    setEditingCompetitor(comp);
    setIsAddModalOpen(true);
  }, []);

  const handleSaveCompetitor = useCallback((data: any) => {
    if (editingCompetitor) {
      store.updateCompetitor(editingCompetitor.id, data);
    } else {
      store.addCompetitor(data);
    }
  }, [editingCompetitor]);

  const handleDeleteCompetitor = useCallback((id: string) => {
    store.deleteCompetitor(id);
    if (profileCompetitor?.id === id) {
      setProfileCompetitor(null);
    }
  }, [profileCompetitor]);

  const handleToggleMonitoring = useCallback((id: string) => {
    store.toggleMonitoring(id);
  }, []);

  const handleToggleCompare = useCallback((id: string) => {
    store.toggleComparisonCompetitor(id);
  }, []);

  const handleSelectIndustry = useCallback((ind: IndustryType) => {
    store.setActiveIndustry(ind);
  }, []);

  const handleLaunchCompare = useCallback(() => {
    setActiveModule('comparison');
  }, []);

  const handleLogout = useCallback(() => {
    authService.logout();
    setCurrentUser(null);
  }, []);

  const handleOnboardingComplete = useCallback(
    (data: { industry: IndustryType; competitors: string[]; preferences: any[] }) => {
      store.setActiveIndustry(data.industry);
      store.setOnboardingDone(true);

      data.competitors.forEach((name) => {
        const exists = store.getCompetitors().some((c) => c.name.toLowerCase() === name.toLowerCase());
        if (!exists) {
          store.addCompetitor({
            name,
            website: `https://${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
            industry: data.industry,
            description: `Key competitor operating in ${data.industry}.`,
            country: 'Global',
            productCategory: 'Core Portfolio',
            competitorType: 'Direct Competitor',
            monitoringPreferences: data.preferences.length > 0 ? data.preferences : ['Price Changes', 'Product Launches'],
            monitoringEnabled: true,
            threatLevel: 'High',
          });
        }
      });

      setActiveModule('overview');
    },
    []
  );

  // Splash Screen on initial application mount
  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  // Authentication Guard: if not authenticated, display the split-screen AuthPage
  if (!currentUser) {
    return (
      <AuthPage
        onSuccess={(user) => {
          setCurrentUser(user);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#060709] text-stone-100 flex flex-col antialiased selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Header */}
      <Header
        activeIndustry={activeIndustry}
        onSelectIndustry={handleSelectIndustry}
        onOpenAddModal={handleOpenAdd}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onRunHindsightDemo={() => setIsDemoOpen(true)}
        onResetData={() => store.resetToDefaultPresets()}
        onClearData={() => store.clearAllData()}
        competitorsCount={competitors.length}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Workspace: Sidebar + Content */}
      <div className="flex flex-1">
        {/* Navigation Sidebar */}
        <Sidebar
          activeModule={activeModule}
          onSelectModule={setActiveModule}
          competitorsCount={competitors.length}
          observationsCount={observations.length}
          memoriesCount={memories.length}
        />

        {/* Dynamic Module Presentation Container with Suspense Lazy Loading */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          <Suspense fallback={<ModuleSkeleton />}>
            {activeModule === 'overview' && (
              <OverviewModule
                competitors={competitors}
                observations={observations}
                memories={memories}
                onOpenAddModal={handleOpenAdd}
                onSelectModule={setActiveModule}
                onViewProfile={(c) => setProfileCompetitor(c)}
                onLoadPresets={() => store.resetToDefaultPresets()}
              />
            )}

            {activeModule === 'competitors' && (
              <CompetitorsModule
                competitors={competitors}
                activeIndustry={activeIndustry}
                onSelectIndustry={handleSelectIndustry}
                onOpenAddModal={handleOpenAdd}
                onEditCompetitor={handleEdit}
                onDeleteCompetitor={handleDeleteCompetitor}
                onViewProfile={(c) => setProfileCompetitor(c)}
                onToggleMonitoring={handleToggleMonitoring}
                selectedCompareIds={selectedCompareIds}
                onToggleCompare={handleToggleCompare}
                onLoadPresets={() => store.resetToDefaultPresets()}
              />
            )}

            {activeModule === 'comparison' && (
              <ComparisonModule
                competitors={competitors}
                selectedIds={selectedCompareIds}
                onToggleCompare={handleToggleCompare}
                onOpenAddModal={handleOpenAdd}
                onViewProfile={(c) => setProfileCompetitor(c)}
              />
            )}

            {activeModule === 'feed' && (
              <FeedModule
                observations={observations}
                competitors={competitors}
                activeIndustry={activeIndustry}
                onOpenAddModal={handleOpenAdd}
              />
            )}

            {activeModule === 'pricing' && (
              <PriceIntelligenceModule
                competitors={competitors}
                observations={observations}
              />
            )}

            {activeModule === 'products' && (
              <ProductIntelligenceModule
                competitors={competitors}
              />
            )}

            {activeModule === 'timeline' && (
              <StrategyTimelineModule
                competitors={competitors}
                observations={observations}
              />
            )}

            {activeModule === 'radar' && (
              <TrendRadarModule
                activeIndustry={activeIndustry}
              />
            )}

            {activeModule === 'knowledge' && (
              <KnowledgeGraphModule
                competitors={competitors}
              />
            )}

            {activeModule === 'hindsight' && (
              <HindsightExplorerModule
                competitors={competitors}
                memories={memories}
                reflections={reflections}
                onTriggerDemo={() => setIsDemoOpen(true)}
              />
            )}

            {activeModule === 'chat' && (
              <AiChatModule
                competitors={competitors}
                activeIndustry={activeIndustry}
              />
            )}

            {activeModule === 'simulator' && (
              <StrategySimulatorModule
                competitors={competitors}
              />
            )}

            {activeModule === 'swot' && (
              <SwotModule
                competitors={competitors}
              />
            )}

            {activeModule === 'battlecards' && (
              <BattlecardsModule
                competitors={competitors}
              />
            )}

            {activeModule === 'reports' && (
              <ExecutiveReportsModule
                competitors={competitors}
                observations={observations}
                activeIndustry={activeIndustry}
              />
            )}
          </Suspense>
        </main>
      </div>

      {/* Floating Comparison Tray */}
      <ComparisonTray
        selectedIds={selectedCompareIds}
        competitors={competitors}
        onRemove={(id) => handleToggleCompare(id)}
        onClear={() => store.setComparisonCompetitors([])}
        onLaunchCompare={handleLaunchCompare}
      />

      {/* Add / Edit Competitor Modal */}
      <AddCompetitorModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingCompetitor(null);
        }}
        onSave={handleSaveCompetitor}
        editingCompetitor={editingCompetitor}
      />

      {/* In-Depth Competitor Profile Drawer */}
      <CompetitorProfileDrawer
        competitor={profileCompetitor}
        onClose={() => setProfileCompetitor(null)}
        onOpenCompare={(id) => {
          if (!selectedCompareIds.includes(id)) {
            store.toggleComparisonCompetitor(id);
          }
          setActiveModule('comparison');
        }}
      />

      {/* First-Time User Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => {
          setIsOnboardingOpen(false);
          store.setOnboardingDone(true);
        }}
        onComplete={handleOnboardingComplete}
      />

      {/* Guided 10-Step Hindsight Memory Demonstration Modal */}
      <HindsightDemoModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        onFinishDemo={() => setActiveModule('hindsight')}
      />
    </div>
  );
}
