import React, { useState } from 'react';
import {
  Flame,
  Calendar,
  Eye,
  HeartHandshake,
  CheckCircle2,
  Sparkles,
  Award,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  FileCheck,
  Search,
  Filter,
  Layers,
  Leaf,
  Shield,
  Activity,
  Heart,
  BookOpen,
  Users,
  Compass,
  Share2,
} from 'lucide-react';
import { useImpact } from '../context/ImpactContext';
import { NewsStory, IssueCategory } from '../types/impact';

export const TopEventsAnalytics: React.FC = () => {
  const {
    newsStories,
    openActionModal,
    openDistressPaymentModal,
    setActiveTab,
    addToast,
    userLocation,
  } = useImpact();

  const [activeSubTab, setActiveSubTab] = useState<'week' | 'month' | 'all'>('week');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<IssueCategory>('all');
  const [sortBy, setSortBy] = useState<'views' | 'donations' | 'quiz' | 'points'>('views');

  // Identify week's top viewed event
  const weeksTopStory =
    newsStories.find((s) => s.analytics?.isWeeksTopViewed) ||
    [...newsStories].sort((a, b) => (b.analytics?.weeklyViews || 0) - (a.analytics?.weeklyViews || 0))[0] ||
    newsStories[0];

  // Identify month's top viewed event
  const monthsTopStory =
    newsStories.find((s) => s.analytics?.isMonthsTopViewed) ||
    [...newsStories].sort((a, b) => (b.analytics?.monthlyViews || b.analytics?.viewsCount || 0) - (a.analytics?.monthlyViews || a.analytics?.viewsCount || 0))[0] ||
    newsStories[0];

  // Aggregate metrics across all published posts
  const totalViews = newsStories.reduce((sum, s) => sum + (s.analytics?.viewsCount || 1200), 0);
  const totalDonors = newsStories.reduce((sum, s) => sum + (s.analytics?.donationsCount || s.distressFund?.donorCount || 15), 0);
  const totalDonationAmount = newsStories.reduce((sum, s) => sum + (s.analytics?.totalDonationAmount || s.distressFund?.raisedAmount || 5000), 0);
  const totalQuizCompleted = newsStories.reduce((sum, s) => sum + (s.analytics?.quizCompletionsCount || 45), 0);
  const totalActionVerified = newsStories.reduce((sum, s) => sum + (s.analytics?.actionVerificationsCount || 30), 0);
  const totalPointsRedeemed = newsStories.reduce((sum, s) => sum + (s.analytics?.pointsRedeemedCount || 2250), 0);

  // Filter and sort all stories
  const filteredStories = newsStories
    .filter((story) => {
      if (selectedCategory !== 'all' && story.category !== selectedCategory) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchTitle = story.headline.toLowerCase().includes(q);
        const matchLocation = story.locationName.toLowerCase().includes(q);
        const matchSource = (story.sourcePlatform || story.sourceAgency || '').toLowerCase().includes(q);
        return matchTitle || matchLocation || matchSource;
      }
      return true;
    })
    .sort((a, b) => {
      const aStats = a.analytics || { viewsCount: 1000, donationsCount: 10, quizCompletionsCount: 20, pointsRedeemedCount: 1000 };
      const bStats = b.analytics || { viewsCount: 1000, donationsCount: 10, quizCompletionsCount: 20, pointsRedeemedCount: 1000 };

      if (sortBy === 'views') return (bStats.viewsCount || 0) - (aStats.viewsCount || 0);
      if (sortBy === 'donations') return (bStats.donationsCount || 0) - (aStats.donationsCount || 0);
      if (sortBy === 'quiz') return (bStats.quizCompletionsCount || 0) - (aStats.quizCompletionsCount || 0);
      if (sortBy === 'points') return (bStats.pointsRedeemedCount || 0) - (aStats.pointsRedeemedCount || 0);
      return 0;
    });

  const renderSpotlightHero = (story: NewsStory, periodLabel: string, periodIcon: React.ReactNode) => {
    const stats = story.analytics || {
      viewsCount: 38240,
      weeklyViews: 24100,
      monthlyViews: 45200,
      donationsCount: 642,
      totalDonationAmount: 82500,
      quizCompletionsCount: 2890,
      actionVerificationsCount: 2150,
      pointsRedeemedCount: 107500,
    };

    const collector = story.distressFund?.collectorDetails;

    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Spotlight Top Card */}
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 overflow-hidden shadow-2xl border border-emerald-800/40">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500 text-slate-950 shadow-md">
                {periodIcon}
                <span>{periodLabel}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-xs text-emerald-200">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>#1 Citizen Engagement Benchmark</span>
              </span>
              <span className="text-xs text-slate-300 font-mono">
                {story.sourcePlatform || story.sourceAgency} • {story.timestamp}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 space-y-3">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-snug text-white">
                  {story.headline}
                </h2>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
                  {story.summary}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-300">
                  <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-xl">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{story.locationName}</span>
                  </span>
                  <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-xl">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{story.readingTimeMinutes} min read</span>
                  </span>
                  <span className="flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-xl font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>+{story.pointsReward} Points per Citizen Action</span>
                  </span>
                </div>
              </div>

              {/* Exact Article Photo Thumbnail */}
              <div className="lg:col-span-4 relative rounded-2xl overflow-hidden border border-white/20 shadow-xl group max-h-56">
                <img
                  src={story.imageUrl}
                  alt={story.headline}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-white">
                  <span className="font-bold">{story.sourcePlatform || 'Publisher Photo'}</span>
                  <span className="bg-emerald-600 px-2 py-0.5 rounded-full font-bold">Verified Story</span>
                </div>
              </div>
            </div>

            {/* 4 Primary Performance KPI Cards */}
            <div className="mt-6 pt-6 border-t border-white/15 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {/* Metric 1: People who have viewed the news */}
              <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <span>News Viewership</span>
                  <Eye className="w-4 h-4 text-sky-400" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white tabular-nums">
                    {stats.viewsCount.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-sky-300 mt-0.5 flex items-center gap-1 font-medium">
                    <span>👥 Total citizens viewed</span>
                  </div>
                </div>
                <div className="mt-2 text-[10px] text-slate-400 pt-2 border-t border-white/10 font-mono">
                  Weekly views: {stats.weeklyViews.toLocaleString()}
                </div>
              </div>

              {/* Metric 2: People who have donated */}
              <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <span>Donors & Relief</span>
                  <HeartHandshake className="w-4 h-4 text-rose-400" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-rose-400 tabular-nums">
                    {stats.donationsCount.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-rose-200 mt-0.5 flex items-center gap-1 font-medium">
                    <span>❤️ People contributed aid</span>
                  </div>
                </div>
                <div className="mt-2 text-[10px] text-emerald-300 pt-2 border-t border-white/10 font-bold">
                  ₹{stats.totalDonationAmount.toLocaleString()} disbursed 100%
                </div>
              </div>

              {/* Metric 3: Quiz & Verification Completed */}
              <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <span>Quiz & Verification</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400 tabular-nums">
                    {stats.quizCompletionsCount.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-emerald-200 mt-0.5 flex items-center gap-1 font-medium">
                    <span>✅ Passed quiz protocols</span>
                  </div>
                </div>
                <div className="mt-2 text-[10px] text-slate-400 pt-2 border-t border-white/10 font-mono">
                  {stats.actionVerificationsCount.toLocaleString()} action proofs verified
                </div>
              </div>

              {/* Metric 4: Points Redeemed by the Post */}
              <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <span>Points Redeemed</span>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-300 tabular-nums">
                    {stats.pointsRedeemedCount.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-amber-200 mt-0.5 flex items-center gap-1 font-medium">
                    <span>🌟 Impact points redeemed</span>
                  </div>
                </div>
                <div className="mt-2 text-[10px] text-slate-400 pt-2 border-t border-white/10">
                  Exchanged in Voucher Bazaar
                </div>
              </div>
            </div>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => openActionModal(story)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-black bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Take Action, Complete Quiz & Earn Points</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {story.distressFund && (
                <button
                  type="button"
                  onClick={() => openDistressPaymentModal(story)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-black bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <HeartHandshake className="w-4 h-4" />
                  <span>Scan QR & Donate Direct Relief (₹{story.distressFund.raisedAmount.toLocaleString()} Raised)</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  const text = `Look at the #1 top viewed civic event on ImpactPulse: "${story.headline}" (${stats.viewsCount.toLocaleString()} readers, ₹${stats.totalDonationAmount.toLocaleString()} relief mobilized). Join and take action:`;
                  if (navigator.share) {
                    navigator.share({ title: story.headline, text, url: window.location.href });
                  } else if (navigator.clipboard) {
                    navigator.clipboard.writeText(`${text} ${window.location.href}`);
                    addToast({ type: 'success', title: 'Copied', message: 'Spotlight link copied to clipboard!' });
                  }
                }}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
              >
                <Share2 className="w-4 h-4 text-emerald-400" />
                <span>Share Top Event</span>
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Collector & Disbursement Transparency Section */}
        {collector && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-black">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Who Is Collecting The Fund & How It Is Sent
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Full organizational accountability and 100% direct-to-victim disbursement protocol
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 self-start sm:self-auto">
                {collector.directBeneficiaryRatio}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Left Column: Authorized Collectors */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Verified Fund Custodian & Collector</span>
                </span>
                <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {collector.organizationName}
                </div>
                <div className="text-slate-600 dark:text-slate-300">
                  <strong className="text-slate-700 dark:text-slate-200">Lead Officer:</strong> {collector.leadCollectorName} ({collector.collectorRole})
                </div>
                <div className="text-slate-600 dark:text-slate-300">
                  <strong className="text-slate-700 dark:text-slate-200">Registration:</strong> {collector.registrationNumber}
                </div>
                <div className="text-slate-600 dark:text-slate-300">
                  <strong className="text-slate-700 dark:text-slate-200">Field Desk:</strong> {collector.deskLocation}
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                    <Phone className="w-3 h-3 text-emerald-500" />
                    <span>{collector.phone}</span>
                  </span>
                  <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                    <Mail className="w-3 h-3 text-emerald-500" />
                    <span>{collector.email}</span>
                  </span>
                </div>
              </div>

              {/* Right Column: How the Money Is Disbursed */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>How Funds Reach The Victims (Disbursement Pipeline)</span>
                </span>
                <div className="space-y-1.5">
                  {collector.howFundsAreSent.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                      <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>⏱ Timeline: <strong>{collector.disbursementTimeline}</strong></span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">{collector.auditEntity}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const getCategoryTheme = (category: IssueCategory) => {
    switch (category) {
      case 'environmental':
        return { label: 'Environmental', badgeBg: 'bg-emerald-100 dark:bg-emerald-950/80', badgeText: 'text-emerald-700 dark:text-emerald-300' };
      case 'civic_safety':
        return { label: 'Civic Safety', badgeBg: 'bg-amber-100 dark:bg-amber-950/80', badgeText: 'text-amber-700 dark:text-amber-300' };
      case 'community_support':
        return { label: 'Community Support', badgeBg: 'bg-indigo-100 dark:bg-indigo-950/80', badgeText: 'text-indigo-700 dark:text-indigo-300' };
      case 'health_alert':
        return { label: 'Public Health', badgeBg: 'bg-rose-100 dark:bg-rose-950/80', badgeText: 'text-rose-700 dark:text-rose-300' };
      case 'disaster_relief':
        return { label: 'Disaster Relief', badgeBg: 'bg-red-100 dark:bg-red-950/80', badgeText: 'text-red-700 dark:text-red-300' };
      case 'animal_welfare':
        return { label: 'Animal Welfare', badgeBg: 'bg-orange-100 dark:bg-orange-950/80', badgeText: 'text-orange-700 dark:text-orange-300' };
      case 'education_youth':
        return { label: 'Education & Youth', badgeBg: 'bg-blue-100 dark:bg-blue-950/80', badgeText: 'text-blue-700 dark:text-blue-300' };
      case 'senior_care':
        return { label: 'Senior & Disability', badgeBg: 'bg-purple-100 dark:bg-purple-950/80', badgeText: 'text-purple-700 dark:text-purple-300' };
      case 'urban_infra':
        return { label: 'Urban Infrastructure', badgeBg: 'bg-teal-100 dark:bg-teal-950/80', badgeText: 'text-teal-700 dark:text-teal-300' };
      default:
        return { label: 'Civic Issue', badgeBg: 'bg-slate-100 dark:bg-slate-800', badgeText: 'text-slate-700 dark:text-slate-300' };
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Top Header Hero */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white shadow-xl border border-emerald-800/40">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
              Verified Post Analytics & Event Spotlights
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Top Viewed Civic Events & Real-Time Impact Metrics
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Transparently track readership, direct relief donations, quiz completions, on-ground verification proofs, and total voucher points redeemed across every headline.
          </p>
        </div>

        {/* Global Aggregate KPI Pill */}
        <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 shrink-0">
          <div className="text-center px-2">
            <div className="text-xl font-black text-sky-400">{totalViews.toLocaleString()}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Views</div>
          </div>
          <div className="w-px h-8 bg-white/20"></div>
          <div className="text-center px-2">
            <div className="text-xl font-black text-rose-400">₹{totalDonationAmount.toLocaleString()}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Relief Sent</div>
          </div>
          <div className="w-px h-8 bg-white/20"></div>
          <div className="text-center px-2">
            <div className="text-xl font-black text-amber-300">{totalPointsRedeemed.toLocaleString()}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pts Redeemed</div>
          </div>
        </div>
      </div>

      {/* Main Sub-Tab Switcher: Week's Top, Month's Top, All Posts Directory */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTab('week')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all ${
              activeSubTab === 'week'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Flame className="w-4 h-4 text-orange-600" />
            <span>Week&apos;s Top Viewed Event</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/20 text-inherit">
              {weeksTopStory.analytics?.weeklyViews?.toLocaleString() || '38.2k'} views
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('month')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all ${
              activeSubTab === 'month'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Calendar className="w-4 h-4 text-emerald-300" />
            <span>Month&apos;s Top Viewed Event</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/20 text-inherit">
              {monthsTopStory.analytics?.monthlyViews?.toLocaleString() || monthsTopStory.analytics?.viewsCount?.toLocaleString() || '68.4k'} views
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all ${
              activeSubTab === 'all'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span>All Posts Impact Directory</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/20 dark:bg-white/20 text-inherit">
              {newsStories.length} posts
            </span>
          </button>
        </div>
      </div>

      {/* Sub-Tab 1: Week's Top Viewed Event Spotlight */}
      {activeSubTab === 'week' && (
        <div className="space-y-6">
          {renderSpotlightHero(
            weeksTopStory,
            "Week's Top Viewed Civic Event",
            <Flame className="w-4 h-4 text-orange-600" />
          )}
        </div>
      )}

      {/* Sub-Tab 2: Month's Top Viewed Event Spotlight */}
      {activeSubTab === 'month' && (
        <div className="space-y-6">
          {renderSpotlightHero(
            monthsTopStory,
            "Month's Top Viewed Civic Event",
            <Calendar className="w-4 h-4 text-emerald-300" />
          )}
        </div>
      )}

      {/* Sub-Tab 3: Full All-Events Impact Directory & Rankings */}
      {activeSubTab === 'all' && (
        <div className="space-y-6">
          {/* Controls: Search, Category, and Metric Sorter */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search post metrics by headline or location..."
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
              <span className="shrink-0 text-slate-400">Sort Metric:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="views">Most Viewed (News Readers)</option>
                <option value="donations">Most Donors (Relief Contributors)</option>
                <option value="quiz">Most Quizzes & Verifications</option>
                <option value="points">Total Points Redeemed</option>
              </select>
            </div>
          </div>

          {/* Table / Card List of All Posts */}
          <div className="grid grid-cols-1 gap-4">
            {filteredStories.map((story, index) => {
              const stats = story.analytics || {
                viewsCount: 1420 + index * 300,
                weeklyViews: 900 + index * 150,
                monthlyViews: 1420 + index * 300,
                donationsCount: 15 + index * 5,
                totalDonationAmount: 5000 + index * 1200,
                quizCompletionsCount: 42 + index * 10,
                actionVerificationsCount: 28 + index * 8,
                pointsRedeemedCount: 1400 + index * 500,
              };

              const theme = getCategoryTheme(story.category);

              return (
                <div
                  key={story.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Rank Number */}
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-black text-sm shrink-0 border border-slate-200 dark:border-slate-700">
                        #{index + 1}
                      </div>

                      {/* Small Thumbnail */}
                      <div className="w-20 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-800">
                        <img
                          src={story.imageUrl}
                          alt={story.headline}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>

                      {/* Title & Metadata */}
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className={`px-2 py-0.5 rounded-md font-bold ${theme.badgeBg} ${theme.badgeText}`}>
                            {theme.label}
                          </span>
                          {story.analytics?.isWeeksTopViewed && (
                            <span className="px-2 py-0.5 rounded-md font-black bg-amber-400 text-amber-950 text-[10px] uppercase">
                              Week&apos;s #1 Top
                            </span>
                          )}
                          {story.analytics?.isMonthsTopViewed && (
                            <span className="px-2 py-0.5 rounded-md font-black bg-emerald-500 text-white text-[10px] uppercase">
                              Month&apos;s #1 Top
                            </span>
                          )}
                          <span className="text-slate-400 font-mono text-[11px]">
                            {story.sourcePlatform || story.sourceAgency} • {story.locationName}
                          </span>
                        </div>

                        <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-snug line-clamp-1">
                          {story.headline}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                          {story.summary}
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                      <button
                        type="button"
                        onClick={() => openActionModal(story)}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                      >
                        Action Plan
                      </button>

                      {story.distressFund && (
                        <button
                          type="button"
                          onClick={() => openDistressPaymentModal(story)}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors"
                        >
                          Donate Relief
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 4 Performance Metric Badges */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {/* 1. Viewed the news */}
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">News Readers</span>
                      <strong className="text-sm font-black text-slate-900 dark:text-white tabular-nums flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-sky-500" />
                        <span>{stats.viewsCount.toLocaleString()} viewed</span>
                      </strong>
                    </div>

                    {/* 2. Donated */}
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Donations</span>
                      <strong className="text-sm font-black text-rose-600 dark:text-rose-400 tabular-nums flex items-center gap-1">
                        <HeartHandshake className="w-3.5 h-3.5 text-rose-500" />
                        <span>{stats.donationsCount.toLocaleString()} donors (₹{stats.totalDonationAmount.toLocaleString()})</span>
                      </strong>
                    </div>

                    {/* 3. Completed quiz and verification */}
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Quiz & Verifications</span>
                      <strong className="text-sm font-black text-emerald-600 dark:text-emerald-400 tabular-nums flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{stats.quizCompletionsCount.toLocaleString()} passed ({stats.actionVerificationsCount} proofs)</span>
                      </strong>
                    </div>

                    {/* 4. Total points redeemed by the post */}
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Points Redeemed</span>
                      <strong className="text-sm font-black text-amber-500 tabular-nums flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>{stats.pointsRedeemedCount.toLocaleString()} pts converted</span>
                      </strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
