import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  NewsStory,
  CityPreset,
  Voucher,
  RedeemedVoucher,
  ClaimHistoryItem,
  WalletState,
  IssueCategory,
  DistressDonationRecord,
  ItemDonationRecord,
  GeographicScope,
  RefugeeCamp,
  VolunteerRegistration,
} from '../types/impact';
import { CITY_PRESETS, MOCK_NEWS_STORIES } from '../data/newsStories';
import { MOCK_VOUCHERS } from '../data/vouchers';
import { REFUGEE_CAMPS } from '../data/refugeeCamps';
import {
  getUserLevel,
  UserLevelInfo,
  checkDailyPointLimit,
  processVoucherRedemption,
} from '../utils/impactLogic';
import { fireConfettiReward } from '../utils/confetti';
import { fetchRealtimeLocationNews } from '../services/newsCollector';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface ImpactContextType {
  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Active view tab
  activeTab: 'feed' | 'rewards' | 'wallet' | 'leaderboard' | 'distress' | 'top_events' | 'volunteers';
  setActiveTab: (tab: 'feed' | 'rewards' | 'wallet' | 'leaderboard' | 'distress' | 'top_events' | 'volunteers') => void;

  // Location Engine
  userLocation: {
    name: string;
    lat: number;
    lng: number;
    isGps: boolean;
  };
  gpsStatus: 'idle' | 'requesting' | 'granted' | 'denied';
  requestGeolocation: () => void;
  selectCityPreset: (city: CityPreset) => void;
  isLocationPickerOpen: boolean;
  setIsLocationPickerOpen: (open: boolean) => void;

  // Geographic Scope (World, India, Kerala, All)
  selectedScope: GeographicScope;
  setSelectedScope: (scope: GeographicScope) => void;

  // Feed Filter & Search
  selectedCategory: IssueCategory;
  setSelectedCategory: (cat: IssueCategory) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Real-Time Multi-Platform News Collection
  isLiveSyncing: boolean;
  lastLiveSyncTime: string | null;
  selectedPlatform: string;
  setSelectedPlatform: (platform: string) => void;
  refreshLiveNews: (targetLocation?: string, targetScope?: GeographicScope) => Promise<void>;
  monitoredPlatforms: string[];

  // Data
  newsStories: NewsStory[];
  vouchers: Voucher[];

  // Modals
  activeStoryForModal: NewsStory | null;
  openActionModal: (story: NewsStory) => void;
  closeActionModal: () => void;

  isWalletModalOpen: boolean;
  setIsWalletModalOpen: (open: boolean) => void;

  // Distress Payment & Relief Modal
  activeDistressStory: NewsStory | null;
  isDistressPaymentModalOpen: boolean;
  openDistressPaymentModal: (story: NewsStory) => void;
  closeDistressPaymentModal: () => void;
  customDistressQrUrl: string | null;
  setCustomDistressQrUrl: (url: string | null) => void;
  recordDistressDonation: (
    donation: Omit<DistressDonationRecord, 'id' | 'timestamp' | 'pointsEarned'>
  ) => { success: boolean; pointsEarned: number; record: DistressDonationRecord };

  latestRedeemedVoucher: RedeemedVoucher | null;
  setLatestRedeemedVoucher: (v: RedeemedVoucher | null) => void;

  // Wallet & Gamification
  wallet: WalletState;
  userLevel: UserLevelInfo;
  claimArticlePoints: (story: NewsStory, completedTasks: string[]) => { success: boolean; error?: string };
  signPetition: (storyId: string, petitionId: string) => void;
  submitVolunteerPledge: (storyId: string, pledgeOption: string) => void;
  redeemVoucher: (voucher: Voucher) => { success: boolean; error?: string; redeemed?: RedeemedVoucher };
  resetWalletData: () => void;

  // Disaster & Refugee Camp Volunteer Community
  refugeeCamps: RefugeeCamp[];
  isVolunteerModalOpen: boolean;
  setIsVolunteerModalOpen: (open: boolean) => void;
  selectedCampForVolunteer: RefugeeCamp | null;
  setSelectedCampForVolunteer: (camp: RefugeeCamp | null) => void;
  openVolunteerModal: (camp?: RefugeeCamp | null) => void;
  closeVolunteerModal: () => void;
  registerVolunteer: (
    reg: Omit<VolunteerRegistration, 'id' | 'registeredAt' | 'volunteerPassId' | 'verified'>
  ) => { success: boolean; registration: VolunteerRegistration };
  latestVolunteerRegistration: VolunteerRegistration | null;
  setLatestVolunteerRegistration: (reg: VolunteerRegistration | null) => void;

  // Site Volunteering & Item Donations
  isSiteVolunteerModalOpen: boolean;
  selectedStoryForVolunteer: NewsStory | null;
  openSiteVolunteerModal: (story?: NewsStory | null) => void;
  closeSiteVolunteerModal: () => void;

  isItemDonationModalOpen: boolean;
  selectedStoryForItemDonation: NewsStory | null;
  openItemDonationModal: (story?: NewsStory | null) => void;
  closeItemDonationModal: () => void;
  recordItemDonation: (
    donation: Omit<ItemDonationRecord, 'id' | 'timestamp' | 'tokenNumber' | 'pointsEarned'>
  ) => { success: boolean; record: ItemDonationRecord };

  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const LOCAL_STORAGE_WALLET_KEY = 'impactpulse_wallet_v2';
const LOCAL_STORAGE_THEME_KEY = 'impactpulse_theme';
const LOCAL_STORAGE_LOCATION_KEY = 'impactpulse_location';

function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

const DEFAULT_INITIAL_WALLET: WalletState = {
  points: 150, // Welcome bonus so user starts as Level 2 Local Hero and can test redeeming
  claimedArticleIds: [],
  claimHistory: [],
  redeemedVouchers: [],
  dailyPointsDate: getTodayDateString(),
  dailyPointsEarned: 0,
  signedPetitionIds: [],
  volunteerPledges: [],
  donations: [],
  volunteerRegistrations: [],
  itemDonations: [],
};

const ImpactContext = createContext<ImpactContextType | undefined>(undefined);

export const ImpactProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state: Default theme is white (light mode)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);
      if (saved !== null) return saved === 'dark';
      return false; // Default to white / light theme
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_THEME_KEY, isDarkMode ? 'dark' : 'light');
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
        document.body.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
        document.body.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
      }
    } catch {
      // ignore
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Active view tab (Distress Relief is primary)
  const [activeTab, setActiveTab] = useState<'feed' | 'rewards' | 'wallet' | 'leaderboard' | 'distress' | 'top_events' | 'volunteers'>('distress');

  // Location Engine
  const [userLocation, setUserLocation] = useState<{
    name: string;
    lat: number;
    lng: number;
    isGps: boolean;
  }>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_LOCATION_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    // Default to Thrissur
    const defaultCity = CITY_PRESETS[0];
    return {
      name: `${defaultCity.name}, ${defaultCity.state}`,
      lat: defaultCity.lat,
      lng: defaultCity.lng,
      isGps: false,
    };
  });

  const [gpsStatus, setGpsStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle');
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);

  // Geolocation request handler
  const requestGeolocation = () => {
    if (!navigator.geolocation) {
      setGpsStatus('denied');
      addToast({
        type: 'warning',
        title: 'Geolocation Unsupported',
        message: 'Your browser does not support GPS geolocation. Using manual city selection.',
      });
      return;
    }

    setGpsStatus('requesting');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newLoc = {
          name: 'My Device GPS Location',
          lat: Math.round(latitude * 10000) / 10000,
          lng: Math.round(longitude * 10000) / 10000,
          isGps: true,
        };
        setUserLocation(newLoc);
        setGpsStatus('granted');
        try {
          localStorage.setItem(LOCAL_STORAGE_LOCATION_KEY, JSON.stringify(newLoc));
        } catch {
          // ignore
        }
        addToast({
          type: 'success',
          title: 'GPS Location Synced',
          message: `Coordinates verified: ${newLoc.lat}°N, ${newLoc.lng}°E`,
        });
      },
      (err) => {
        console.warn('Geolocation denied or failed:', err);
        setGpsStatus('denied');
        addToast({
          type: 'info',
          title: 'GPS Access Declined / Unavailable',
          message: 'Using preset city location. You can switch cities anytime from the header.',
        });
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Attempt browser geolocation on startup as requested
  useEffect(() => {
    if (!userLocation.isGps) {
      requestGeolocation();
    }
  }, []);

  const selectCityPreset = (city: CityPreset) => {
    const newLoc = {
      name: `${city.name}, ${city.state}`,
      lat: city.lat,
      lng: city.lng,
      isGps: false,
    };
    setUserLocation(newLoc);
    setGpsStatus('idle');
    try {
      localStorage.setItem(LOCAL_STORAGE_LOCATION_KEY, JSON.stringify(newLoc));
    } catch {
      // ignore
    }
    setIsLocationPickerOpen(false);
    addToast({
      type: 'info',
      title: 'Region Switched',
      message: `Active region is now ${city.name}, ${city.state}. Local feeds updated!`,
    });
  };

  // Geographic Scope Engine (All, Kerala, India, World)
  const [selectedScope, setSelectedScope] = useState<GeographicScope>('all');

  // Feed Filter & Search
  const [selectedCategory, setSelectedCategory] = useState<IssueCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Real-Time News Collection Platforms (Times of India, Mathrubhumi, Hindustan Times, News 24, BBC World, Reuters, Al Jazeera)
  const monitoredPlatforms = [
    'Mathrubhumi',
    'Times of India',
    'Hindustan Times',
    'News 24',
    'BBC World',
    'Reuters',
    'Al Jazeera',
  ];
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [isLiveSyncing, setIsLiveSyncing] = useState<boolean>(false);
  const [lastLiveSyncTime, setLastLiveSyncTime] = useState<string | null>(null);

  // News Stories State (live collected + verified base stories for Kerala, India, and World)
  const [newsStories, setNewsStories] = useState<NewsStory[]>(() => MOCK_NEWS_STORIES);

  // Real-Time News Collection Function
  const refreshLiveNews = async (targetLocation?: string, targetScope?: GeographicScope) => {
    const loc = targetLocation || userLocation.name;
    const scopeToFetch = targetScope || selectedScope;
    setIsLiveSyncing(true);

    try {
      let liveStories: NewsStory[] = [];

      // 1. Try server-side API collection with location and scope
      try {
        const res = await fetch(
          `/api/news/live?location=${encodeURIComponent(loc)}&lat=${userLocation.lat}&lng=${userLocation.lng}&maxCount=12&scope=${scopeToFetch}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.stories) && data.stories.length > 0) {
            liveStories = data.stories;
          }
        }
      } catch {
        // Server fetch fallback
      }

      // 2. Direct client collection fallback if server did not return items
      if (liveStories.length === 0) {
        liveStories = await fetchRealtimeLocationNews({
          location: loc,
          lat: userLocation.lat,
          lng: userLocation.lng,
          maxCount: 12,
          scope: scopeToFetch,
        });
      }

      if (liveStories.length > 0) {
        setNewsStories((prev) => {
          const newHeadlines = new Set(liveStories.map((s) => s.headline.toLowerCase().trim()));
          const filteredPrev = prev.filter((p) => !newHeadlines.has(p.headline.toLowerCase().trim()));
          return [...liveStories, ...filteredPrev];
        });

        const syncTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLastLiveSyncTime(syncTime);
        const scopeLabel = scopeToFetch === 'all' ? 'World, India & Kerala' : scopeToFetch.toUpperCase();
        addToast({
          type: 'success',
          title: `Live Stream Updated (${scopeLabel})`,
          message: `Real-time headlines and exact channel thumbnails synced from major news platforms.`,
        });
      }
    } catch (err) {
      console.warn('Real-time news fetch error:', err);
    } finally {
      setIsLiveSyncing(false);
    }
  };

  // Automatically trigger live news collection on initial load and when location or scope changes
  useEffect(() => {
    refreshLiveNews(userLocation.name, selectedScope);
  }, [userLocation.name, selectedScope]);


  // Modals & Active Story
  const [activeStoryForModal, setActiveStoryForModal] = useState<NewsStory | null>(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [latestRedeemedVoucher, setLatestRedeemedVoucher] = useState<RedeemedVoucher | null>(null);

  // Distress Relief & Payment Modal State
  const [activeDistressStory, setActiveDistressStory] = useState<NewsStory | null>(null);
  const [isDistressPaymentModalOpen, setIsDistressPaymentModalOpen] = useState(false);
  const [customDistressQrUrl, setCustomDistressQrUrl] = useState<string | null>(null);

  const openActionModal = (story: NewsStory) => {
    setActiveStoryForModal(story);
  };

  const closeActionModal = () => {
    setActiveStoryForModal(null);
  };

  const openDistressPaymentModal = (story: NewsStory) => {
    setActiveDistressStory(story);
    setIsDistressPaymentModalOpen(true);
  };

  const closeDistressPaymentModal = () => {
    setIsDistressPaymentModalOpen(false);
  };

  // Disaster & Refugee Camp Volunteer Community State
  const [refugeeCamps, setRefugeeCamps] = useState<RefugeeCamp[]>(() => REFUGEE_CAMPS);
  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);
  const [selectedCampForVolunteer, setSelectedCampForVolunteer] = useState<RefugeeCamp | null>(null);
  const [latestVolunteerRegistration, setLatestVolunteerRegistration] = useState<VolunteerRegistration | null>(null);

  const openVolunteerModal = (camp?: RefugeeCamp | null) => {
    if (camp) {
      setSelectedCampForVolunteer(camp);
    } else if (!selectedCampForVolunteer && refugeeCamps.length > 0) {
      setSelectedCampForVolunteer(refugeeCamps[0]);
    }
    setIsVolunteerModalOpen(true);
  };

  const closeVolunteerModal = () => {
    setIsVolunteerModalOpen(false);
  };

  // Site Volunteering State
  const [isSiteVolunteerModalOpen, setIsSiteVolunteerModalOpen] = useState(false);
  const [selectedStoryForVolunteer, setSelectedStoryForVolunteer] = useState<NewsStory | null>(null);

  const openSiteVolunteerModal = (story?: NewsStory | null) => {
    setSelectedStoryForVolunteer(story || activeDistressStory || newsStories[0] || null);
    setIsSiteVolunteerModalOpen(true);
  };

  const closeSiteVolunteerModal = () => {
    setIsSiteVolunteerModalOpen(false);
  };

  // Item Donation State
  const [isItemDonationModalOpen, setIsItemDonationModalOpen] = useState(false);
  const [selectedStoryForItemDonation, setSelectedStoryForItemDonation] = useState<NewsStory | null>(null);

  const openItemDonationModal = (story?: NewsStory | null) => {
    setSelectedStoryForItemDonation(story || activeDistressStory || newsStories[0] || null);
    setIsItemDonationModalOpen(true);
  };

  const closeItemDonationModal = () => {
    setIsItemDonationModalOpen(false);
  };

  // Persistent Wallet State
  const [wallet, setWallet] = useState<WalletState>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_WALLET_KEY);
      if (saved) {
        const parsed: WalletState = JSON.parse(saved);
        const today = getTodayDateString();
        // Check daily rollover
        if (parsed.dailyPointsDate !== today) {
          parsed.dailyPointsDate = today;
          parsed.dailyPointsEarned = 0;
        }
        if (!parsed.donations) {
          parsed.donations = [];
        }
        if (!parsed.volunteerRegistrations) {
          parsed.volunteerRegistrations = [];
        }
        if (!parsed.itemDonations) {
          parsed.itemDonations = [];
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse saved wallet:', e);
    }
    return DEFAULT_INITIAL_WALLET;
  });

  // Save wallet changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_WALLET_KEY, JSON.stringify(wallet));
    } catch (e) {
      console.error('Failed to save wallet to localStorage:', e);
    }
  }, [wallet]);

  // Derived user level
  const userLevel = getUserLevel(wallet.points);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Claim points for an article after passing anti-foulplay verification
  const claimArticlePoints = (
    story: NewsStory,
    completedTasks: string[]
  ): { success: boolean; error?: string } => {
    // 1. Check if already claimed
    if (wallet.claimedArticleIds.includes(story.id)) {
      return { success: false, error: 'You have already claimed points for this story.' };
    }

    // 2. Check daily point limit (500 pts max/day)
    const today = getTodayDateString();
    const rateCheck = checkDailyPointLimit(
      today,
      wallet.dailyPointsDate,
      wallet.dailyPointsEarned,
      story.pointsReward,
      500
    );

    if (!rateCheck.allowed) {
      return { success: false, error: rateCheck.reason };
    }

    const effectiveDailyEarned =
      today === wallet.dailyPointsDate ? wallet.dailyPointsEarned : 0;

    const newClaimItem: ClaimHistoryItem = {
      articleId: story.id,
      articleHeadline: story.headline,
      category: story.category,
      pointsEarned: story.pointsReward,
      claimedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      completedTasks,
    };

    setWallet((prev) => ({
      ...prev,
      points: prev.points + story.pointsReward,
      claimedArticleIds: [...prev.claimedArticleIds, story.id],
      claimHistory: [newClaimItem, ...prev.claimHistory],
      dailyPointsDate: today,
      dailyPointsEarned: effectiveDailyEarned + story.pointsReward,
    }));

    // Update story analytics for quiz/verification completion and points redeemed
    setNewsStories((prev) =>
      prev.map((s) => {
        if (s.id === story.id) {
          const current = s.analytics || {
            viewsCount: 1420,
            donationsCount: 12,
            totalDonationAmount: 4800,
            quizCompletionsCount: 38,
            actionVerificationsCount: 22,
            pointsRedeemedCount: 1100,
            weeklyViews: 920,
            monthlyViews: 1420,
          };
          return {
            ...s,
            analytics: {
              ...current,
              quizCompletionsCount: current.quizCompletionsCount + 1,
              actionVerificationsCount: current.actionVerificationsCount + 1,
              pointsRedeemedCount: current.pointsRedeemedCount + story.pointsReward,
            },
          };
        }
        return s;
      })
    );

    fireConfettiReward();
    addToast({
      type: 'success',
      title: `+${story.pointsReward} Civic Points Earned!`,
      message: `Action verified. Your impact wallet has been credited!`,
    });

    return { success: true };
  };

  // Sign digital petition
  const signPetition = (storyId: string, petitionId: string) => {
    if (wallet.signedPetitionIds.includes(petitionId)) {
      addToast({
        type: 'info',
        title: 'Already Signed',
        message: 'You have already signed this community petition.',
      });
      return;
    }

    setWallet((prev) => ({
      ...prev,
      signedPetitionIds: [...prev.signedPetitionIds, petitionId],
    }));

    addToast({
      type: 'success',
      title: 'Petition Signature Verified',
      message: 'Your voice has been added to the official civic record!',
    });
  };

  // Submit volunteer pledge
  const submitVolunteerPledge = (storyId: string, pledgeOption: string) => {
    setWallet((prev) => ({
      ...prev,
      volunteerPledges: [
        ...prev.volunteerPledges.filter((p) => p.storyId !== storyId),
        { storyId, optionSelected: pledgeOption, timestamp: new Date().toISOString() },
      ],
    }));

    addToast({
      type: 'success',
      title: 'Pledge Recorded',
      message: 'Thank you for your active commitment to our community!',
    });
  };

  // Redeem voucher
  const redeemVoucher = (
    voucher: Voucher
  ): { success: boolean; error?: string; redeemed?: RedeemedVoucher } => {
    const result = processVoucherRedemption(wallet.points, voucher.pointsCost, voucher.brand);

    if (!result.success || !result.code) {
      return { success: false, error: result.error };
    }

    // Set expiry 90 days out
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 90);
    const expiryStr = expiry.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const redeemedItem: RedeemedVoucher = {
      id: Math.random().toString(36).substring(2, 9),
      voucherId: voucher.id,
      title: voucher.title,
      brand: voucher.brand,
      pointsSpent: voucher.pointsCost,
      valueDisplay: voucher.valueDisplay,
      code: result.code,
      redeemedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      expiryDate: expiryStr,
    };

    setWallet((prev) => ({
      ...prev,
      points: result.newBalance,
      redeemedVouchers: [redeemedItem, ...prev.redeemedVouchers],
    }));

    setLatestRedeemedVoucher(redeemedItem);
    fireConfettiReward();

    addToast({
      type: 'success',
      title: 'Voucher Redeemed Successfully!',
      message: `${voucher.valueDisplay} from ${voucher.brand} code generated.`,
    });

    return { success: true, redeemed: redeemedItem };
  };

  // Record direct emergency payment / donation for people in distress
  const recordDistressDonation = (
    donation: Omit<DistressDonationRecord, 'id' | 'timestamp' | 'pointsEarned'>
  ): { success: boolean; pointsEarned: number; record: DistressDonationRecord } => {
    // Generous Civic Impact points for direct humanitarian distress relief
    const pointsEarned = Math.max(50, Math.min(300, Math.round(donation.amount * 0.4)));

    const record: DistressDonationRecord = {
      ...donation,
      id: `don-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      pointsEarned,
    };

    // Update story fund metrics & analytics
    setNewsStories((prev) =>
      prev.map((s) => {
        if (s.id === donation.storyId) {
          const currentAnalytics = s.analytics || {
            viewsCount: 1840,
            donationsCount: 18,
            totalDonationAmount: 7500,
            quizCompletionsCount: 65,
            actionVerificationsCount: 42,
            pointsRedeemedCount: 2100,
            weeklyViews: 1240,
            monthlyViews: 1840,
          };
          const updatedFund = s.distressFund
            ? {
                ...s.distressFund,
                raisedAmount: s.distressFund.raisedAmount + donation.amount,
                donorCount: s.distressFund.donorCount + 1,
                recentDonations: [
                  { donorName: donation.donorName, amount: donation.amount, timeAgo: 'Just now' },
                  ...(s.distressFund.recentDonations || []),
                ],
              }
            : undefined;

          return {
            ...s,
            distressFund: updatedFund,
            analytics: {
              ...currentAnalytics,
              donationsCount: currentAnalytics.donationsCount + 1,
              totalDonationAmount: currentAnalytics.totalDonationAmount + donation.amount,
            },
          };
        }
        return s;
      })
    );

    // Update wallet
    const newClaimItem: ClaimHistoryItem = {
      articleId: donation.storyId,
      articleHeadline: `Distress Relief: ${donation.beneficiaryName}`,
      category: 'community_support',
      pointsEarned,
      claimedAt: record.timestamp,
      completedTasks: [
        `Direct Aid ₹${donation.amount.toLocaleString()} via ${donation.paymentMethod.toUpperCase()}`,
        `Ref / UTR: ${donation.upiRefOrTxn}`,
        'Verified Beneficiary Relief',
      ],
    };

    setWallet((prev) => ({
      ...prev,
      points: prev.points + pointsEarned,
      donations: [record, ...(prev.donations || [])],
      claimHistory: [newClaimItem, ...prev.claimHistory],
    }));

    fireConfettiReward();
    addToast({
      type: 'success',
      title: `Emergency Aid Sent: ₹${donation.amount.toLocaleString()}!`,
      message: `+${pointsEarned} Civic Points earned. Your direct support directly reaches people in distress.`,
    });

    return { success: true, pointsEarned, record };
  };

  // Register volunteer in disaster & refugee camp community
  const registerVolunteer = (
    reg: Omit<VolunteerRegistration, 'id' | 'registeredAt' | 'volunteerPassId' | 'verified'>
  ): { success: boolean; registration: VolunteerRegistration } => {
    const passNum = Math.floor(10000 + Math.random() * 90000);
    const passId = `VOL-DISASTER-${passNum}`;
    const id = `reg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const registeredAt = new Date().toISOString();

    const registration: VolunteerRegistration = {
      ...reg,
      id,
      registeredAt,
      volunteerPassId: passId,
      verified: true,
    };

    // Award +150 Civic Impact Points for registering into disaster relief volunteer community
    const pointsAwarded = 150;
    const newClaimItem: ClaimHistoryItem = {
      articleId: reg.campId || 'camp-disaster-relief',
      articleHeadline: `Refugee Camp Volunteer Force: ${reg.campName}`,
      category: 'disaster_relief',
      pointsEarned: pointsAwarded,
      claimedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      completedTasks: [
        `Volunteer ID Pass: ${passId}`,
        `Intake Channel: ${reg.channelUsed.toUpperCase()}`,
        `Assigned Roles: ${reg.roles.slice(0, 2).join(', ')}`,
      ],
    };

    setWallet((prev) => ({
      ...prev,
      points: prev.points + pointsAwarded,
      volunteerRegistrations: [registration, ...(prev.volunteerRegistrations || [])],
      claimHistory: [newClaimItem, ...prev.claimHistory],
    }));

    setLatestVolunteerRegistration(registration);
    fireConfettiReward();

    addToast({
      type: 'success',
      title: `Volunteer Force Registration Confirmed (+${pointsAwarded} pts)!`,
      message: `Pass ID: ${passId}. Official camp coordination link dispatched via ${reg.channelUsed.toUpperCase()}.`,
    });

    return { success: true, registration };
  };

  // Record Item Donation
  const recordItemDonation = (
    donation: Omit<ItemDonationRecord, 'id' | 'timestamp' | 'tokenNumber' | 'pointsEarned'>
  ): { success: boolean; record: ItemDonationRecord } => {
    const tokenNum = Math.floor(10000 + Math.random() * 90000);
    const tokenNumber = `RELIEF-ITEM-${tokenNum}`;
    const id = `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const pointsEarned = 75;

    const record: ItemDonationRecord = {
      ...donation,
      id,
      tokenNumber,
      timestamp,
      pointsEarned,
    };

    const newClaimItem: ClaimHistoryItem = {
      articleId: donation.storyId,
      articleHeadline: `Relief Items Donated: ${donation.siteName}`,
      category: 'disaster_relief',
      pointsEarned,
      claimedAt: timestamp,
      completedTasks: [
        `Donation Token: ${tokenNumber}`,
        `Delivery: ${donation.deliveryMethod === 'self_dropoff' ? 'Panchayath Desk Drop-off' : 'Volunteer Pickup'}`,
        `Items: ${donation.items.map((i) => `${i.quantity} ${i.itemName}`).join(', ')}`,
      ],
    };

    setWallet((prev) => ({
      ...prev,
      points: prev.points + pointsEarned,
      itemDonations: [record, ...(prev.itemDonations || [])],
      claimHistory: [newClaimItem, ...prev.claimHistory],
    }));

    fireConfettiReward();
    addToast({
      type: 'success',
      title: `Item Donation Registered (+${pointsEarned} pts)!`,
      message: `Token: ${tokenNumber}. Panchayath collection team notified for ${donation.items.length} relief item(s).`,
    });

    return { success: true, record };
  };

  // Reset wallet data for demo convenience
  const resetWalletData = () => {
    setWallet(DEFAULT_INITIAL_WALLET);
    addToast({
      type: 'info',
      title: 'Demo Wallet Reset',
      message: 'Points and history have been restored to initial demo state.',
    });
  };

  return (
    <ImpactContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        activeTab,
        setActiveTab,
        userLocation,
        gpsStatus,
        requestGeolocation,
        selectCityPreset,
        isLocationPickerOpen,
        setIsLocationPickerOpen,
        selectedScope,
        setSelectedScope,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        isLiveSyncing,
        lastLiveSyncTime,
        selectedPlatform,
        setSelectedPlatform,
        refreshLiveNews,
        monitoredPlatforms,
        newsStories,
        vouchers: MOCK_VOUCHERS,
        activeStoryForModal,
        openActionModal,
        closeActionModal,
        isWalletModalOpen,
        setIsWalletModalOpen,
        activeDistressStory,
        isDistressPaymentModalOpen,
        openDistressPaymentModal,
        closeDistressPaymentModal,
        customDistressQrUrl,
        setCustomDistressQrUrl,
        recordDistressDonation,
        latestRedeemedVoucher,
        setLatestRedeemedVoucher,
        refugeeCamps,
        isVolunteerModalOpen,
        setIsVolunteerModalOpen,
        selectedCampForVolunteer,
        setSelectedCampForVolunteer,
        openVolunteerModal,
        closeVolunteerModal,
        registerVolunteer,
        latestVolunteerRegistration,
        setLatestVolunteerRegistration,
        isSiteVolunteerModalOpen,
        selectedStoryForVolunteer,
        openSiteVolunteerModal,
        closeSiteVolunteerModal,
        isItemDonationModalOpen,
        selectedStoryForItemDonation,
        openItemDonationModal,
        closeItemDonationModal,
        recordItemDonation,
        wallet,
        userLevel,
        claimArticlePoints,
        signPetition,
        submitVolunteerPledge,
        redeemVoucher,
        resetWalletData,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </ImpactContext.Provider>
  );
};

export function useImpact(): ImpactContextType {
  const context = useContext(ImpactContext);
  if (!context) {
    throw new Error('useImpact must be used within an ImpactProvider');
  }
  return context;
}
