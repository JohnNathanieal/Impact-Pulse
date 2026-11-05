import React from 'react';
import {
  Search,
  Filter,
  MapPin,
  Sparkles,
  Leaf,
  Shield,
  HeartHandshake,
  Activity,
  Layers,
  Compass,
  Trophy,
  RefreshCw,
  Radio,
  Globe2,
  Newspaper,
  CheckCircle,
  AlertTriangle,
  Heart,
  BookOpen,
  Users,
  Building2,
  Flame,
} from 'lucide-react';
import { useImpact } from '../context/ImpactContext';
import { NewsCard } from './NewsCard';
import { IssueCategory, GeographicScope } from '../types/impact';

export const NewsFeed: React.FC = () => {
  const {
    newsStories,
    selectedCategory,
    setSelectedCategory,
    selectedScope,
    setSelectedScope,
    searchQuery,
    setSearchQuery,
    userLocation,
    setIsLocationPickerOpen,
    wallet,
    setActiveTab,
    isLiveSyncing,
    lastLiveSyncTime,
    selectedPlatform,
    setSelectedPlatform,
    refreshLiveNews,
    monitoredPlatforms,
  } = useImpact();

  const categories: { id: IssueCategory; label: string; icon: React.ElementType }[] = [
    { id: 'all', label: 'All Issues', icon: Layers },
    { id: 'environmental', label: 'Environmental', icon: Leaf },
    { id: 'civic_safety', label: 'Civic Safety', icon: Shield },
    { id: 'community_support', label: 'Community Support', icon: HeartHandshake },
    { id: 'health_alert', label: 'Public Health', icon: Activity },
    { id: 'disaster_relief', label: 'Disaster Relief', icon: AlertTriangle },
    { id: 'animal_welfare', label: 'Animal Welfare', icon: Heart },
    { id: 'education_youth', label: 'Education & Youth', icon: BookOpen },
    { id: 'senior_care', label: 'Senior Care', icon: Users },
    { id: 'urban_infra', label: 'Urban Infrastructure', icon: Building2 },
  ];

  const scopes: { id: GeographicScope; label: string; flag: string; description: string }[] = [
    { id: 'all', label: 'All Feeds', flag: '🌍', description: 'World, India & Kerala' },
    { id: 'kerala', label: 'Kerala', flag: '🌴', description: 'Statewide & Local Districts' },
    { id: 'india', label: 'India', flag: '🇮🇳', description: 'National & Metro Corridors' },
    { id: 'world', label: 'World', flag: '🌐', description: 'Global & International News' },
  ];

  const filteredStories = newsStories.filter((story) => {
    // Geographic Scope match (World, India, Kerala)
    if (selectedScope !== 'all') {
      if (story.geographicScope !== selectedScope) {
        return false;
      }
    }
    // Category match
    if (selectedCategory !== 'all' && story.category !== selectedCategory) {
      return false;
    }
    // Publisher platform match
    if (selectedPlatform !== 'all') {
      const storyPlatform = (story.sourcePlatform || story.sourceAgency || '').toLowerCase();
      if (!storyPlatform.includes(selectedPlatform.toLowerCase())) {
        return false;
      }
    }
    // Search match
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchHeadline = story.headline.toLowerCase().includes(q);
      const matchSummary = story.summary.toLowerCase().includes(q);
      const matchLocation = story.locationName.toLowerCase().includes(q);
      const matchSource = (story.sourceAgency || '').toLowerCase().includes(q);
      const matchPlatform = (story.sourcePlatform || '').toLowerCase().includes(q);
      const matchScope = (story.geographicScope || '').toLowerCase().includes(q);
      if (!matchHeadline && !matchSummary && !matchLocation && !matchSource && !matchPlatform && !matchScope) return false;
    }
    return true;
  });

  const totalPointsAvailable = newsStories
    .filter((s) => !wallet.claimedArticleIds.includes(s.id))
    .reduce((sum, s) => sum + s.pointsReward, 0);

  // Compute platform article counts for filtering badges
  const getPlatformCount = (platform: string) => {
    if (platform === 'all') {
      return selectedScope === 'all'
        ? newsStories.length
        : newsStories.filter((s) => s.geographicScope === selectedScope).length;
    }
    return newsStories.filter((s) => {
      const matchesPlatform = (s.sourcePlatform || s.sourceAgency || '').toLowerCase().includes(platform.toLowerCase());
      const matchesScope = selectedScope === 'all' || s.geographicScope === selectedScope;
      return matchesPlatform && matchesScope;
    }).length;
  };

  // Compute geographic scope counts
  const getScopeCount = (scope: GeographicScope) => {
    if (scope === 'all') return newsStories.length;
    return newsStories.filter((s) => s.geographicScope === scope).length;
  };

  return (
    <div className="space-y-6">
      {/* Civic Action Banner */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <span className="inline-block text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs">
              Direct Civic Impact Platform
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Turn Negative Local News Into Citizen Action
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Read urgent local headlines, follow actionable safety guidelines, sign petitions, and verify your community actions to earn instant redeemable vouchers.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 bg-black/20 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 shrink-0">
            <div className="text-center px-2">
              <div className="text-xl font-black text-white">{newsStories.length}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">
                Local Alerts
              </div>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="text-center px-2">
              <div className="text-xl font-black text-amber-300">+{totalPointsAvailable}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">
                Points Available
              </div>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <button
              onClick={() => setActiveTab('top_events')}
              className="text-center px-2 py-1 rounded-xl hover:bg-white/10 transition-colors focus:outline-none focus:ring-1 focus:ring-amber-300"
              title="View Month and Week Top Viewed Events & Analytics"
            >
              <div className="flex items-center justify-center gap-1 text-xl font-black text-amber-300">
                <Flame className="w-4 h-4 text-orange-400" />
                <span>Top Events</span>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">
                Week / Month
              </div>
            </button>
            <div className="w-px h-8 bg-white/20"></div>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className="text-center px-2 py-1 rounded-xl hover:bg-white/10 transition-colors focus:outline-none focus:ring-1 focus:ring-amber-300"
              title="View Top 10 Community Champions"
            >
              <div className="flex items-center justify-center gap-1 text-xl font-black text-amber-300">
                <Trophy className="w-4 h-4 text-amber-300" />
                <span>Top 10</span>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">
                Champions
              </div>
            </button>
          </div>
        </div>

        {/* Decorative circle */}
        <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
      </div>

      {/* Geographic Scope Selector: World, India & Kerala */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-100">
                Geographic Coverage Hub
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Explore civic alerts and direct action plans by geographic level: World, India, or Kerala.
            </p>
          </div>

          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Active: <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase">{selectedScope === 'all' ? 'World, India & Kerala (Aggregated)' : selectedScope}</span>
          </div>
        </div>

        {/* 4 Scope Selector Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
          {scopes.map((scope) => {
            const isSelected = selectedScope === scope.id;
            const count = getScopeCount(scope.id);

            return (
              <button
                key={scope.id}
                type="button"
                onClick={() => {
                  setSelectedScope(scope.id);
                  refreshLiveNews(userLocation.name, scope.id);
                }}
                className={`p-3.5 rounded-2xl text-left border transition-all relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  isSelected
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-md scale-[1.02]'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 hover:border-emerald-400'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-xl">{scope.flag}</span>
                  <span
                    className={`text-[11px] font-mono font-black px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-emerald-500 text-white dark:bg-emerald-600 dark:text-white'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {count} {count === 1 ? 'alert' : 'alerts'}
                  </span>
                </div>

                <div className="font-extrabold text-sm sm:text-base leading-tight">
                  {scope.label}
                </div>
                <div
                  className={`text-[10px] sm:text-[11px] mt-0.5 line-clamp-1 ${
                    isSelected ? 'text-slate-300 dark:text-slate-600' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {scope.description}
                </div>

                {isSelected && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 dark:bg-emerald-600"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search alerts across World, India & Kerala..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder-slate-400 shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* Current Location Filter indicator */}
        <div className="flex items-center justify-between sm:justify-end gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>Targeting:</span>
          <button
            onClick={() => setIsLocationPickerOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold hover:border-emerald-500 transition-colors shadow-xs"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
            <span className="truncate max-w-[140px]">{userLocation.name}</span>
            <Compass className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Real-Time News Stream Live Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shrink-0">
            <Radio className="w-4 h-4 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                Live News Intelligence Stream
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800">
                {selectedScope === 'world' ? 'World' : selectedScope === 'kerala' ? 'Kerala' : selectedScope === 'india' ? 'India' : userLocation.name}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Harvested from BBC World, Reuters, Times of India, Mathrubhumi, Hindustan Times & News 24
              {lastLiveSyncTime && ` • Synced ${lastLiveSyncTime}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            onClick={() => refreshLiveNews(userLocation.name, selectedScope)}
            disabled={isLiveSyncing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors disabled:opacity-50"
            title="Fetch real-time news and extracted thumbnails for this scope and location"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLiveSyncing ? 'animate-spin text-emerald-500' : ''}`} />
            <span>{isLiveSyncing ? 'Harvesting Feeds...' : 'Sync Live News'}</span>
          </button>
        </div>
      </div>

      {/* Publisher Platform Filter Pills */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Newspaper className="w-3.5 h-3.5 text-emerald-500" />
            <span>Filter by Media House:</span>
          </div>
          {selectedPlatform !== 'all' && (
            <button
              onClick={() => setSelectedPlatform('all')}
              className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Show All Platforms
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setSelectedPlatform('all')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedPlatform === 'all'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>All Platforms</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-black/20 dark:bg-white/20">
              {getPlatformCount('all')}
            </span>
          </button>

          {monitoredPlatforms.map((platform) => {
            const isSelected = selectedPlatform.toLowerCase() === platform.toLowerCase();
            const count = getPlatformCount(platform);

            return (
              <button
                key={platform}
                onClick={() => setSelectedPlatform(platform)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                  isSelected
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800'
                }`}
              >
                <span>{platform}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected
                      ? 'bg-white/20 dark:bg-black/20 text-inherit'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isSelected
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs scale-102'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* News Cards Grid */}
      {filteredStories.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            No civic alerts match your criteria
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Try clearing your search filter or selecting another issue category above.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <NewsCard key={story.id} story={story} />
          ))}
        </div>
      )}
    </div>
  );
};
