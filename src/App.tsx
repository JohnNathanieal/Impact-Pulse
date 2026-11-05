import React from 'react';
import { ImpactProvider, useImpact } from './context/ImpactContext';
import { Header } from './components/Header';
import { RewardsStore } from './components/RewardsStore';
import { Leaderboard } from './components/Leaderboard';
import { DistressReliefDirectory } from './components/DistressReliefDirectory';
import { DistressPaymentModal } from './components/DistressPaymentModal';
import { ActionModal } from './components/ActionModal';
import { LocationPickerModal } from './components/LocationPickerModal';
import { WalletHistoryModal } from './components/WalletHistoryModal';
import { SiteVolunteerModal } from './components/SiteVolunteerModal';
import { ItemDonationModal } from './components/ItemDonationModal';
import { ToastContainer } from './components/ToastContainer';
import { ShieldCheck } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab } = useImpact();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Fixed Header */}
      <Header />

      {/* Main View Area: Concise & Clean */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {(activeTab === 'distress' || activeTab === 'feed' || activeTab === 'volunteers' || activeTab === 'top_events') && (
          <DistressReliefDirectory />
        )}
        {activeTab === 'rewards' && <RewardsStore />}
        {activeTab === 'leaderboard' && <Leaderboard />}
      </main>

      {/* Global Modals & Notifications */}
      <DistressPaymentModal />
      <ActionModal />
      <SiteVolunteerModal />
      <ItemDonationModal />
      <LocationPickerModal />
      <WalletHistoryModal />
      <ToastContainer />

      {/* Concise, Clean Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-slate-800 dark:text-slate-200">ImpactPulse</span>
            <span>— Grama Panchayath Verified Direct Citizen Relief</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>100% Direct to Beneficiary UPI</span>
            <span>•</span>
            <span>Zero Platform Fees</span>
            <span>•</span>
            <span>Local LSGD & Ward Desk Verified</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <ImpactProvider>
      <AppContent />
    </ImpactProvider>
  );
}
