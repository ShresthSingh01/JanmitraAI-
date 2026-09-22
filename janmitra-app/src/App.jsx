import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from './firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { CLUSTERS, LUCKNOW_CLUSTERS } from '../scripts/seedData.js';

import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';

import Dashboard from './pages/Dashboard';
import IssuesPage from './pages/IssuesPage';
import PortfolioPlanner from './pages/PortfolioPlanner';
import BudgetSimulator from './pages/BudgetSimulator';
import CitizenWidget from './pages/CitizenWidget';
import WardMapPage from './pages/WardMapPage';
import AnalyticsPage from './pages/AnalyticsPage';

function App() {
  const { i18n } = useTranslation();
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'analytics' | 'issues' | 'portfolio' | 'simulator' | 'wardmap' | 'citizen'
  
  // Shared State
  const [currentConstituency, setCurrentConstituency] = useState('varanasi');
  const [clusters, setClusters] = useState([]);
  const [budget, setBudget] = useState(3500000);
  const [selectedCluster, setSelectedCluster] = useState(null);

  // Sync document language with i18n for screen reader pronunciation
  useEffect(() => {
    document.documentElement.lang = i18n.language || 'en';
  }, [i18n.language]);

  // Data loading (Real-time Firestore listener with resilient local seed fallback)
  useEffect(() => {
    const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
    const isFirebaseValid = projectId && !projectId.includes("YOUR_");

    // Helper to get seed data for current constituency
    const getConstituencySeedClusters = () => {
      return currentConstituency.toLowerCase() === 'lucknow' ? LUCKNOW_CLUSTERS : CLUSTERS;
    };

    if (isFirebaseValid) {
      console.log(`Setting up real-time listener for ${currentConstituency} clusters...`);
      const q = query(collection(db, 'clusters'), where('constituency_id', '==', currentConstituency));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const docsData = [];
          snapshot.forEach((doc) => docsData.push({ id: doc.id, ...doc.data() }));
          setClusters(docsData);
        } else {
          // If Firestore is empty for this constituency, fallback to authentic seed data
          setClusters(getConstituencySeedClusters());
        }
      }, (error) => {
        console.warn("Firestore snapshot error, falling back to authentic seed data:", error.message);
        setClusters(getConstituencySeedClusters());
      });

      return () => unsubscribe();
    } else {
      // Local state mode: Read from localStorage or initialize with seed clusters
      const loadLocalClusters = () => {
        const saved = localStorage.getItem('janmitra_clusters');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            const filtered = parsed.filter(c => (c.constituency_id || 'varanasi').toLowerCase() === currentConstituency.toLowerCase());
            if (filtered.length > 0) {
              setClusters(filtered);
              return;
            }
          } catch (e) {
            console.warn("Error parsing saved clusters:", e);
          }
        }
        // If not in localStorage, load seed clusters
        const seeds = getConstituencySeedClusters();
        setClusters(seeds);
        localStorage.setItem('janmitra_clusters', JSON.stringify(seeds));
      };

      loadLocalClusters();
      const handleUpdate = () => loadLocalClusters();
      window.addEventListener('janmitra_clusters_updated', handleUpdate);
      return () => window.removeEventListener('janmitra_clusters_updated', handleUpdate);
    }
  }, [currentConstituency]);

  // Critical issues count for notification badge
  const criticalCount = clusters.filter(c => c.urgency === 'critical').length;

  return (
    <div className="flex h-screen min-h-dvh overflow-hidden bg-soft-surface">
      {/* Left Sidebar / Bottom Navigation Bar */}
      <Sidebar 
        activeView={currentView} 
        onViewChange={setCurrentView}
        currentConstituency={currentConstituency} 
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden pb-16 md:pb-0">
        {/* Top Utility Bar */}
        <TopBar 
          notificationCount={criticalCount} 
          currentConstituency={currentConstituency}
          onConstituencyChange={setCurrentConstituency}
          onNavigateToCitizen={() => setCurrentView('citizen')}
        />

        {/* Content Area */}
        <main key={currentView} className="flex-1 overflow-y-auto">
          {currentView === 'home' && (
            <Dashboard 
              clusters={clusters} 
              onNavigateToPortfolio={() => setCurrentView('portfolio')}
              onNavigateToIssues={(issue) => {
                setSelectedCluster(issue);
                setCurrentView('issues');
              }}
            />
          )}

          {currentView === 'analytics' && (
            <AnalyticsPage 
              clusters={clusters}
              currentConstituency={currentConstituency}
              onNavigateToPortfolio={() => setCurrentView('portfolio')}
            />
          )}

          {currentView === 'issues' && (
            <IssuesPage 
              clusters={clusters} 
              selectedCluster={selectedCluster} 
              setSelectedCluster={setSelectedCluster}
              onNavigateToPortfolio={() => setCurrentView('portfolio')}
            />
          )}

          {currentView === 'portfolio' && (
            <PortfolioPlanner 
              clusters={clusters} 
              budget={budget} 
              selectedCluster={selectedCluster}
              onNavigateToSimulator={() => setCurrentView('simulator')}
            />
          )}

          {currentView === 'simulator' && (
            <BudgetSimulator 
              clusters={clusters} 
              budget={budget} 
              onBudgetChange={setBudget}
              onNavigateBack={() => setCurrentView('portfolio')}
            />
          )}

          {currentView === 'wardmap' && (
            <WardMapPage 
              clusters={clusters} 
              setSelectedCluster={setSelectedCluster}
              onNavigateToIssues={(issue) => {
                setSelectedCluster(issue);
                setCurrentView('issues');
              }}
              currentConstituency={currentConstituency}
            />
          )}

          {currentView === 'citizen' && (
            <CitizenWidget currentConstituency={currentConstituency} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
