import React, { useState, useEffect, useMemo } from 'react';
import {
  HeartHandshake,
  QrCode,
  ShieldCheck,
  MapPin,
  Users,
  Search,
  CheckCircle2,
  UserCheck,
  Package,
  Zap,
  ArrowUpDown,
  Sparkles,
  Radio,
  Clock,
  Filter,
  Check,
} from 'lucide-react';
import { useImpact } from '../context/ImpactContext';
import { calculateDistanceKm } from '../utils/impactLogic';
import { GeographicScope, NewsStory } from '../types/impact';
import { fireConfettiReward } from '../utils/confetti';

interface LiveActivity {
  id: string;
  donorName: string;
  actionText: string;
  storyTitle: string;
  timeAgoSec: number;
  type: 'donation' | 'volunteer' | 'item';
  amount?: number;
}

const INITIAL_ACTIVITIES: LiveActivity[] = [
  {
    id: 'act-1',
    donorName: 'Rahul S.',
    actionText: 'sent ₹500 via UPI QR',
    storyTitle: 'Wayanad Landslide Survivors Emergency Relief',
    timeAgoSec: 15,
    type: 'donation',
    amount: 500,
  },
  {
    id: 'act-2',
    donorName: 'Priya N.',
    actionText: 'enlisted as On-Site Kitchen Volunteer',
    storyTitle: 'Kuranchery Flash Flood Relief',
    timeAgoSec: 42,
    type: 'volunteer',
  },
  {
    id: 'act-3',
    donorName: 'Manoj V.',
    actionText: 'donated 10 Warm Blankets & Drinking Water',
    storyTitle: 'Chooralmala Camp Community Desk',
    timeAgoSec: 90,
    type: 'item',
  },
  {
    id: 'act-4',
    donorName: 'Deepa K.',
    actionText: 'contributed ₹1,000 via GPay',
    storyTitle: 'Cherpu Riverbank Inundation Support',
    timeAgoSec: 160,
    type: 'donation',
    amount: 1000,
  },
  {
    id: 'act-5',
    donorName: 'Dr. Arun Kumar',
    actionText: 'enlisted for Medical Triage Assist',
    storyTitle: 'Meppadi Disaster Zone Medical Desk',
    timeAgoSec: 240,
    type: 'volunteer',
  },
];

type SortOption = 'urgency' | 'distance' | 'progress' | 'target';
type CategoryFilter = 'all' | 'flood' | 'medical' | 'displaced';

export const DistressReliefDirectory: React.FC = () => {
  const {
    newsStories,
    userLocation,
    openDistressPaymentModal,
    openSiteVolunteerModal,
    openItemDonationModal,
    recordDistressDonation,
    addToast,
  } = useImpact();

  const [selectedScope, setSelectedScope] = useState<GeographicScope>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('urgency');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [isLiveFeedActive, setIsLiveFeedActive] = useState<boolean>(true);
  const [activities, setActivities] = useState<LiveActivity[]>(INITIAL_ACTIVITIES);
  const [quickDonatedCardId, setQuickDonatedCardId] = useState<string | null>(null);

  // Stories that have verified distress relief funds
  const distressStories = useMemo(() => newsStories.filter((s) => !!s.distressFund), [newsStories]);

  // Compute aggregate live metrics
  const totalRaised = distressStories.reduce((acc, s) => acc + (s.distressFund?.raisedAmount || 0), 0);
  const totalTarget = distressStories.reduce((acc, s) => acc + (s.distressFund?.targetAmount || 0), 0);
  const totalDonors = distressStories.reduce((acc, s) => acc + (s.distressFund?.donorCount || 0), 0);
  const totalAffected = distressStories.reduce((acc, s) => acc + (s.distressFund?.beneficiary.affectedCount || 0), 0);

  // Dynamic seconds ticker for activities
  useEffect(() => {
    const timer = setInterval(() => {
      setActivities((prev) =>
        prev.map((act) => ({
          ...act,
          timeAgoSec: act.timeAgoSec + 1,
        }))
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Background subtle live pulse: simulate a community contribution every 25 seconds when live feed is active
  useEffect(() => {
    if (!isLiveFeedActive || distressStories.length === 0) return;

    const interval = setInterval(() => {
      const randomStory = distressStories[Math.floor(Math.random() * distressStories.length)];
      if (!randomStory || !randomStory.distressFund) return;

      const randomNames = ['Ananya M.', 'Kavya R.', 'Biju Abraham', 'Siddharth V.', 'Fathima Z.', 'Vivek Nair'];
      const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
      const randomAmounts = [100, 250, 500];
      const amount = randomAmounts[Math.floor(Math.random() * randomAmounts.length)];

      const newAct: LiveActivity = {
        id: `act-${Date.now()}`,
        donorName: randomName,
        actionText: `contributed ₹${amount} via UPI QR`,
        storyTitle: randomStory.distressFund.title,
        timeAgoSec: 1,
        type: 'donation',
        amount,
      };

      setActivities((prev) => [newAct, ...prev.slice(0, 7)]);
    }, 22000);

    return () => clearInterval(interval);
  }, [isLiveFeedActive, distressStories]);

  // Manual Trigger: Simulate Live Aid
  const handleSimulateCommunityAid = () => {
    if (distressStories.length === 0) return;
    const targetStory = distressStories[Math.floor(Math.random() * distressStories.length)];
    if (!targetStory || !targetStory.distressFund) return;

    const names = ['Karthik Menon', 'Sneha Varghese', 'Gopika Pillai', 'Nithin Das'];
    const chosenName = names[Math.floor(Math.random() * names.length)];
    const amount = 500;

    recordDistressDonation({
      storyId: targetStory.id,
      headline: targetStory.headline,
      beneficiaryName: targetStory.distressFund.beneficiary.name,
      donorName: chosenName,
      amount,
      currency: 'INR',
      upiRefOrTxn: `UPI-${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      paymentMethod: 'upi_qr',
      note: 'Live simulated community relief contribution',
    });

    const newAct: LiveActivity = {
      id: `act-${Date.now()}`,
      donorName: chosenName,
      actionText: `sent ₹${amount} via UPI QR Pay`,
      storyTitle: targetStory.distressFund.title,
      timeAgoSec: 1,
      type: 'donation',
      amount,
    };
    setActivities((prev) => [newAct, ...prev.slice(0, 7)]);
    fireConfettiReward();

    addToast({
      type: 'success',
      title: '⚡ Live Community Aid Received!',
      message: `${chosenName} contributed ₹${amount} to ${targetStory.distressFund.beneficiary.name}. Total raised updated!`,
    });
  };

  // Quick 1-click test donation right on card
  const handleQuickCardDonate = (story: NewsStory, amount: number) => {
    if (!story.distressFund) return;
    setQuickDonatedCardId(story.id);
    recordDistressDonation({
      storyId: story.id,
      headline: story.headline,
      beneficiaryName: story.distressFund.beneficiary.name,
      donorName: 'You (Quick Aid)',
      amount,
      currency: 'INR',
      upiRefOrTxn: `UPI-QUICK-${Math.floor(10000000 + Math.random() * 90000000)}`,
      paymentMethod: 'upi_qr',
      note: `Quick direct relief contribution of ₹${amount}`,
    });

    const newAct: LiveActivity = {
      id: `act-${Date.now()}`,
      donorName: 'You',
      actionText: `sent ₹${amount} via Instant Direct Aid`,
      storyTitle: story.distressFund.title,
      timeAgoSec: 0,
      type: 'donation',
      amount,
    };
    setActivities((prev) => [newAct, ...prev.slice(0, 7)]);
    setTimeout(() => setQuickDonatedCardId(null), 2000);
  };

  // Format seconds to human string
  const formatTimeAgo = (sec: number): string => {
    if (sec < 60) return `${sec}s ago`;
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m ago`;
    const hr = Math.floor(min / 60);
    return `${hr}h ago`;
  };

  // Filtered and sorted stories
  const filteredStories = useMemo(() => {
    let result = distressStories.filter((s) => {
      // Scope filter
      if (selectedScope !== 'all' && s.geographicScope !== selectedScope) return false;

      // Category filter
      if (categoryFilter === 'flood') {
        const text = (s.headline + ' ' + (s.distressFund?.title || '')).toLowerCase();
        if (!text.includes('flood') && !text.includes('landslide') && !text.includes('water') && !text.includes('rain')) {
          return false;
        }
      } else if (categoryFilter === 'medical') {
        const text = (s.headline + ' ' + (s.distressFund?.title || '') + ' ' + (s.distressFund?.beneficiary.urgencyReason || '')).toLowerCase();
        if (!text.includes('medic') && !text.includes('hospital') && !text.includes('health') && !text.includes('surgery')) {
          return false;
        }
      } else if (categoryFilter === 'displaced') {
        const text = (s.headline + ' ' + (s.distressFund?.title || '') + ' ' + (s.distressFund?.beneficiary.urgencyReason || '')).toLowerCase();
        if (!text.includes('displaced') && !text.includes('camp') && !text.includes('home') && !text.includes('shelter')) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = s.distressFund?.title.toLowerCase().includes(q);
        const matchBeneficiary = s.distressFund?.beneficiary.name.toLowerCase().includes(q);
        const matchLocation = s.locationName.toLowerCase().includes(q);
        return matchTitle || matchBeneficiary || matchLocation;
      }
      return true;
    });

    // Dynamic sorting
    return result.sort((a, b) => {
      if (sortBy === 'distance') {
        const distA = calculateDistanceKm(userLocation.lat, userLocation.lng, a.coordinates.lat, a.coordinates.lng);
        const distB = calculateDistanceKm(userLocation.lat, userLocation.lng, b.coordinates.lat, b.coordinates.lng);
        return distA - distB;
      }
      if (sortBy === 'progress') {
        const pA = (a.distressFund!.raisedAmount / a.distressFund!.targetAmount);
        const pB = (b.distressFund!.raisedAmount / b.distressFund!.targetAmount);
        return pB - pA;
      }
      if (sortBy === 'target') {
        return (b.distressFund?.targetAmount || 0) - (a.distressFund?.targetAmount || 0);
      }
      // default urgency: Urgent first
      const urgScore = (s: NewsStory) => (s.urgency === 'Urgent' ? 3 : s.urgency === 'High' ? 2 : 1);
      return urgScore(b) - urgScore(a);
    });
  }, [distressStories, selectedScope, categoryFilter, searchQuery, sortBy, userLocation]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Dynamic Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-rose-950 via-slate-900 to-teal-950 text-white p-6 sm:p-8 overflow-hidden shadow-xl border border-rose-900/40">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-rose-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-600 text-white shadow-md">
              <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
              Live Disaster Relief Network
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              Real-Time UPI Sync
            </span>
            <button
              onClick={() => setIsLiveFeedActive(!isLiveFeedActive)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
                isLiveFeedActive
                  ? 'bg-white/10 text-emerald-300 hover:bg-white/20'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isLiveFeedActive ? 'bg-emerald-400' : 'bg-slate-500'}`}></span>
              <span>{isLiveFeedActive ? 'Live Stream: Active' : 'Live Stream: Paused'}</span>
            </button>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
            Direct Financial Aid for People in Critical Distress
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Scan verified UPI QR codes to transfer emergency aid directly to verified citizens and families. Zero
            platform deductions, audited by Grama Panchayaths and local disaster cells.
          </p>

          {/* Dynamic Interactive Action Buttons in Hero */}
          <div className="pt-2 flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleSimulateCommunityAid}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300 animate-bounce" />
              <span>Simulate Live Community Aid (+₹500)</span>
            </button>

            <span className="text-[11px] text-slate-300 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Auto-updating every few seconds
            </span>
          </div>
        </div>

        {/* Dynamic Aggregated Metrics Counter */}
        <div className="mt-6 pt-5 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center sm:text-left">
          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 backdrop-blur-xs transition-all hover:bg-white/10">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Aid Mobilized</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-400 tabular-nums">
              ₹{totalRaised.toLocaleString()}
            </span>
          </div>

          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 backdrop-blur-xs transition-all hover:bg-white/10">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Citizens Aided</span>
            <span className="text-xl sm:text-2xl font-black text-rose-300 tabular-nums">
              {totalAffected}+ Lives
            </span>
          </div>

          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 backdrop-blur-xs transition-all hover:bg-white/10">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Live Benefactors</span>
            <span className="text-xl sm:text-2xl font-black text-amber-300 tabular-nums">
              {totalDonors} Donors
            </span>
          </div>

          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 backdrop-blur-xs transition-all hover:bg-white/10">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Platform Cut</span>
            <span className="text-xl sm:text-2xl font-black text-teal-300">
              0% (Zero Fee)
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic Live Activity Ticker Banner */}
      <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 dark:from-emerald-950/40 dark:via-slate-900/60 dark:to-teal-950/30 border border-emerald-200/80 dark:border-emerald-800/50 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 overflow-hidden">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="font-mono uppercase tracking-wider">Live Activity Stream</span>
        </div>

        {/* Ticker Item */}
        <div className="flex-1 min-w-0 flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {activities.slice(0, 3).map((act) => (
            <div
              key={act.id}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 shrink-0 shadow-2xs animate-in fade-in slide-in-from-top-1 duration-300"
            >
              <span className="font-bold text-slate-900 dark:text-white">{act.donorName}</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{act.actionText}</span>
              <span className="text-[10px] text-slate-400 font-mono">({formatTimeAgo(act.timeAgoSec)})</span>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleSimulateCommunityAid}
          className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline shrink-0"
        >
          + Add Test Pulse
        </button>
      </div>

      {/* Dynamic Filter, Search & Sorting Controls */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Live Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search distress causes, beneficiaries, or locations..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'all' as GeographicScope, label: 'All Regions' },
              { id: 'kerala' as GeographicScope, label: 'Kerala 🌴' },
              { id: 'india' as GeographicScope, label: 'India 🇮🇳' },
            ].map((scope) => (
              <button
                key={scope.id}
                onClick={() => setSelectedScope(scope.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedScope === scope.id
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {scope.label}
              </button>
            ))}
          </div>

          {/* Dynamic Sort Selector */}
          <div className="flex items-center gap-1.5 shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="urgency">⚡ Most Urgent First</option>
              <option value="distance">📍 Nearest to Me</option>
              <option value="progress">🎯 Close to Goal (&gt;75%)</option>
              <option value="target">💰 Highest Target</option>
            </select>
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" />
            Filter:
          </span>
          {[
            { id: 'all' as CategoryFilter, label: 'All Causes' },
            { id: 'flood' as CategoryFilter, label: '🌊 Floods & Landslides' },
            { id: 'medical' as CategoryFilter, label: '🏥 Medical Emergency' },
            { id: 'displaced' as CategoryFilter, label: '⛺ Displaced Families' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
                categoryFilter === cat.id
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
          <span className="ml-auto text-[11px] text-slate-400 font-medium">
            Showing <strong>{filteredStories.length}</strong> active appeals
          </span>
        </div>
      </div>

      {/* Distress Relief Appeal Cards Grid */}
      {filteredStories.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-3">
          <Sparkles className="w-10 h-10 mx-auto text-slate-400" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No active appeals matching your filters
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try resetting your search query or switching regions to view other emergency appeals across India and Kerala.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedScope('all');
              setCategoryFilter('all');
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredStories.map((story) => {
            const fund = story.distressFund!;
            const distanceKm = calculateDistanceKm(
              userLocation.lat,
              userLocation.lng,
              story.coordinates.lat,
              story.coordinates.lng
            );
            const percent = Math.min(100, Math.round((fund.raisedAmount / fund.targetAmount) * 100));
            const isJustDonated = quickDonatedCardId === story.id;

            return (
              <div
                key={fund.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl hover:border-rose-400/50 dark:hover:border-rose-500/50 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Header Image & Tags */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={story.imageUrl}
                      alt={fund.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>

                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-600 text-white shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                        Emergency Relief
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-xs">
                        {fund.verifiedStatus}
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-white">
                      <span className="flex items-center gap-1 font-semibold truncate">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span>{story.locationName}</span>
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/60 text-emerald-300 font-semibold">
                        {distanceKm < 1 ? '< 1 km away' : `${distanceKm} km away`}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 sm:p-6 space-y-4">
                    <div>
                      <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-snug">
                        {fund.title}
                      </h3>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-bold">
                        <Users className="w-3.5 h-3.5 shrink-0" />
                        <span>{fund.beneficiary.name} ({fund.beneficiary.affectedCount} individuals)</span>
                      </div>
                    </div>

                    {/* Crisis Assessment */}
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/80">
                      <strong className="text-slate-900 dark:text-white block mb-0.5">Crisis Impact:</strong>
                      {fund.beneficiary.urgencyReason}
                    </p>

                    {/* Supplies Funded */}
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Supplies Being Financed:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {fund.emergencyNeeds.slice(0, 3).map((item, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                          >
                            • {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Dynamic Animated Progress Bar */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-700 dark:text-slate-300">
                          <strong className="text-emerald-600 dark:text-emerald-400 text-sm font-black tabular-nums">
                            ₹{fund.raisedAmount.toLocaleString()}
                          </strong>{' '}
                          raised of ₹{fund.targetAmount.toLocaleString()}
                        </span>
                        <span className="text-slate-500 font-mono tabular-nums">{percent}% • {fund.donorCount} donors</span>
                      </div>

                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-amber-400 via-rose-500 to-emerald-500 h-full rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>

                      {/* Quick test donation micro-action right on the card */}
                      <div className="flex items-center justify-between pt-1 text-[11px]">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          Live intake active
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleQuickCardDonate(story, 250)}
                            className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 transition-colors"
                            title="Simulate instant ₹250 direct aid to this beneficiary"
                          >
                            {isJustDonated ? '✓ Donated!' : '+Quick ₹250 Aid'}
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-5 sm:p-6 pt-0 space-y-2">
                  <button
                    type="button"
                    onClick={() => openDistressPaymentModal(story)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white shadow-md shadow-rose-600/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Scan QR & Send Money</span>
                  </button>

                  {/* Below the scan qr and send money: Be a volunteer at the site & Donate item */}
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => openSiteVolunteerModal(story)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800/80 transition-all hover:scale-[1.01] active:scale-[0.99]"
                      title="Enlist to support relief efforts on the ground"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="truncate">(Be a volunteer at the site)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => openItemDonationModal(story)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800/80 transition-all hover:scale-[1.01] active:scale-[0.99]"
                      title="Donate food, clean water, blankets or medical supplies"
                    >
                      <Package className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span className="truncate">Donate item</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
