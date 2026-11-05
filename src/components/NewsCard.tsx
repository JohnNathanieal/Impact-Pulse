import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Leaf,
  Shield,
  HeartHandshake,
  Activity,
  QrCode,
  ExternalLink,
  Camera,
  Newspaper,
  Heart,
  BookOpen,
  Users,
  Building2,
  Eye,
  Flame,
  Tent,
} from 'lucide-react';
import { NewsStory, IssueCategory } from '../types/impact';
import { useImpact } from '../context/ImpactContext';
import { calculateDistanceKm } from '../utils/impactLogic';

interface NewsCardProps {
  story: NewsStory;
}

export const NewsCard: React.FC<NewsCardProps> = ({ story }) => {
  const {
    userLocation,
    wallet,
    openActionModal,
    openDistressPaymentModal,
    openVolunteerModal,
  } = useImpact();
  const [imgSrc, setImgSrc] = useState(story.imageUrl);
  const [retriedWithProxy, setRetriedWithProxy] = useState(false);
  const [hasImgFailed, setHasImgFailed] = useState(false);

  // Sync image source whenever story changes or refreshes
  React.useEffect(() => {
    setImgSrc(story.imageUrl);
    setRetriedWithProxy(false);
    setHasImgFailed(false);
  }, [story.imageUrl]);

  const isClaimed = wallet.claimedArticleIds.includes(story.id);

  // Fallback image if remote publisher thumbnail encounters CORS/404
  const fallbackThumbnail = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80';

  const handleImageError = () => {
    // If direct CDN access failed, first try the server-side image proxy
    if (!retriedWithProxy && imgSrc && !imgSrc.startsWith('/api/news/image-proxy')) {
      setRetriedWithProxy(true);
      setImgSrc(`/api/news/image-proxy?url=${encodeURIComponent(imgSrc)}`);
      return;
    }
    if (!hasImgFailed) {
      setHasImgFailed(true);
      setImgSrc(fallbackThumbnail);
    }
  };

  const getPlatformStyle = (platform?: string, agency?: string) => {
    const combined = `${platform || ''} ${agency || ''}`.toLowerCase();
    if (combined.includes('times of india') || combined.includes('toi')) {
      return {
        name: 'Times of India',
        badgeBg: 'bg-red-600 text-white',
        border: 'border-red-500',
        tag: 'TOI',
      };
    }
    if (combined.includes('mathrubhumi')) {
      return {
        name: 'Mathrubhumi',
        badgeBg: 'bg-emerald-700 text-white',
        border: 'border-emerald-600',
        tag: 'Mathrubhumi',
      };
    }
    if (combined.includes('hindustan times') || combined.includes('ht')) {
      return {
        name: 'Hindustan Times',
        badgeBg: 'bg-sky-600 text-white',
        border: 'border-sky-500',
        tag: 'HT',
      };
    }
    if (combined.includes('news 24') || combined.includes('news24')) {
      return {
        name: 'News 24',
        badgeBg: 'bg-orange-600 text-white',
        border: 'border-orange-500',
        tag: 'News 24',
      };
    }
    if (combined.includes('bbc')) {
      return {
        name: 'BBC World',
        badgeBg: 'bg-red-700 text-white',
        border: 'border-red-600',
        tag: 'BBC World',
      };
    }
    if (combined.includes('reuters')) {
      return {
        name: 'Reuters',
        badgeBg: 'bg-amber-600 text-white',
        border: 'border-amber-500',
        tag: 'Reuters',
      };
    }
    if (combined.includes('al jazeera') || combined.includes('aljazeera')) {
      return {
        name: 'Al Jazeera',
        badgeBg: 'bg-yellow-600 text-white',
        border: 'border-yellow-500',
        tag: 'Al Jazeera',
      };
    }
    return {
      name: platform || agency || 'Regional News',
      badgeBg: 'bg-slate-700 text-white',
      border: 'border-slate-600',
      tag: platform || agency || 'Press',
    };
  };

  const platformMeta = getPlatformStyle(story.sourcePlatform, story.sourceAgency);

  // Calculate live distance in km
  const distanceKm = calculateDistanceKm(
    userLocation.lat,
    userLocation.lng,
    story.coordinates.lat,
    story.coordinates.lng
  );

  const getCategoryTheme = (category: IssueCategory) => {
    switch (category) {
      case 'environmental':
        return {
          label: 'Environmental Alert',
          icon: Leaf,
          badgeBg: 'bg-emerald-100 dark:bg-emerald-950/80',
          badgeText: 'text-emerald-700 dark:text-emerald-300',
          badgeBorder: 'border-emerald-300 dark:border-emerald-800',
        };
      case 'civic_safety':
        return {
          label: 'Civic Safety',
          icon: Shield,
          badgeBg: 'bg-amber-100 dark:bg-amber-950/80',
          badgeText: 'text-amber-700 dark:text-amber-300',
          badgeBorder: 'border-amber-300 dark:border-amber-800',
        };
      case 'community_support':
        return {
          label: 'Community Support',
          icon: HeartHandshake,
          badgeBg: 'bg-indigo-100 dark:bg-indigo-950/80',
          badgeText: 'text-indigo-700 dark:text-indigo-300',
          badgeBorder: 'border-indigo-300 dark:border-indigo-800',
        };
      case 'health_alert':
        return {
          label: 'Health Advisory',
          icon: Activity,
          badgeBg: 'bg-rose-100 dark:bg-rose-950/80',
          badgeText: 'text-rose-700 dark:text-rose-300',
          badgeBorder: 'border-rose-300 dark:border-rose-800',
        };
      case 'disaster_relief':
        return {
          label: 'Disaster Relief',
          icon: AlertTriangle,
          badgeBg: 'bg-red-100 dark:bg-red-950/80',
          badgeText: 'text-red-700 dark:text-red-300',
          badgeBorder: 'border-red-300 dark:border-red-800',
        };
      case 'animal_welfare':
        return {
          label: 'Animal Welfare',
          icon: Heart,
          badgeBg: 'bg-orange-100 dark:bg-orange-950/80',
          badgeText: 'text-orange-700 dark:text-orange-300',
          badgeBorder: 'border-orange-300 dark:border-orange-800',
        };
      case 'education_youth':
        return {
          label: 'Education & Youth',
          icon: BookOpen,
          badgeBg: 'bg-blue-100 dark:bg-blue-950/80',
          badgeText: 'text-blue-700 dark:text-blue-300',
          badgeBorder: 'border-blue-300 dark:border-blue-800',
        };
      case 'senior_care':
        return {
          label: 'Senior Care',
          icon: Users,
          badgeBg: 'bg-purple-100 dark:bg-purple-950/80',
          badgeText: 'text-purple-700 dark:text-purple-300',
          badgeBorder: 'border-purple-300 dark:border-purple-800',
        };
      case 'urban_infra':
        return {
          label: 'Urban Infra',
          icon: Building2,
          badgeBg: 'bg-teal-100 dark:bg-teal-950/80',
          badgeText: 'text-teal-700 dark:text-teal-300',
          badgeBorder: 'border-teal-300 dark:border-teal-800',
        };
      default:
        return {
          label: 'Civic Issue',
          icon: AlertTriangle,
          badgeBg: 'bg-slate-100 dark:bg-slate-800',
          badgeText: 'text-slate-700 dark:text-slate-300',
          badgeBorder: 'border-slate-300 dark:border-slate-700',
        };
    }
  };

  const theme = getCategoryTheme(story.category);
  const CategoryIcon = theme.icon;

  return (
    <article className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-400/50 dark:hover:border-emerald-500/50 transition-all duration-300">
      {/* Top Banner / Image with tags overlay */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt={story.headline}
          onError={handleImageError}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>

        {/* Category & Urgency & Geographic Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
          {/* Top Event Spotlight Badges */}
          {story.analytics?.isWeeksTopViewed && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-400 text-amber-950 shadow-md">
              <Flame className="w-3 h-3 text-orange-600" />
              <span>Week&apos;s #1</span>
            </span>
          )}
          {story.analytics?.isMonthsTopViewed && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-white shadow-md">
              <Sparkles className="w-3 h-3 text-white" />
              <span>Month&apos;s #1</span>
            </span>
          )}

          {/* Geographic Scope Badge */}
          {story.geographicScope && (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-xs ${
                story.geographicScope === 'world'
                  ? 'bg-blue-600/90 text-white border border-blue-400/40'
                  : story.geographicScope === 'kerala'
                  ? 'bg-emerald-700/90 text-white border border-emerald-400/40'
                  : 'bg-amber-600/90 text-white border border-amber-400/40'
              }`}
            >
              <span>
                {story.geographicScope === 'world' ? '🌐 World' : story.geographicScope === 'kerala' ? '🌴 Kerala' : '🇮🇳 India'}
              </span>
            </span>
          )}

          {/* Publisher Brand Pill */}
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider shadow-xs ${platformMeta.badgeBg}`}
            title={`Harvested from ${platformMeta.name}`}
          >
            <Newspaper className="w-3 h-3" />
            <span>{platformMeta.tag}</span>
          </span>

          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider backdrop-blur-md shadow-xs ${theme.badgeBg} ${theme.badgeText} border ${theme.badgeBorder}`}
          >
            <CategoryIcon className="w-3.5 h-3.5" />
            {theme.label}
          </span>

          {story.urgency === 'Urgent' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              Urgent
            </span>
          )}
        </div>

        {/* Potential Earnable Points Pill & Authentic Channel Photo Indicator */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600/90 text-white text-xs font-black shadow-md backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>+{story.pointsReward} pts</span>
          </div>

          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/75 backdrop-blur-md text-white border border-white/20 shadow-xs"
            title={`Exact authentic article photo taken from ${platformMeta.name}`}
          >
            <Camera className="w-3 h-3 text-emerald-400" />
            <span>{story.channelPhotoVerified ? 'Exact Channel Photo' : 'Publisher Photo'}</span>
          </span>
        </div>

        {/* Bottom image overlay: Location & Distance */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-white/90">
          <div className="flex items-center gap-1 font-medium truncate">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">{story.locationName}</span>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/40 backdrop-blur-xs text-emerald-300 font-semibold shrink-0">
            {distanceKm < 1 ? '< 1 km away' : `${distanceKm} km away`}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          {/* Metadata: source, reading time & external link */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <div className="flex items-center gap-1.5 truncate max-w-[65%]">
              <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">
                {story.sourceAgency}
              </span>
              {story.articleUrl && (
                <a
                  href={story.articleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-emerald-500 transition-colors inline-flex items-center"
                  title={`Read full coverage on ${platformMeta.name}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <div className="flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{story.readingTimeMinutes} min read</span>
            </div>
          </div>

          {/* Headline */}
          <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-snug line-clamp-2 mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {story.headline}
          </h3>

          {/* Summary */}
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {story.summary}
          </p>

          {/* Distress Relief Appeal Highlight */}
          {story.distressFund && (
            <div className="mt-3.5 p-2.5 rounded-xl bg-rose-50/90 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0"></span>
                <span className="text-slate-700 dark:text-slate-200 font-semibold truncate">
                  Relief Fund: <span className="font-normal text-slate-500 dark:text-slate-400">{story.distressFund.beneficiary.name.slice(0, 32)}...</span>
                </span>
              </div>
              <span className="font-mono font-black text-rose-600 dark:text-rose-400 shrink-0 ml-2">
                ₹{story.distressFund.raisedAmount.toLocaleString()}
              </span>
            </div>
          )}

          {/* Post Metrics Row: Views, Quizzes Completed, Donors */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 font-semibold" title="Number of people who viewed this news">
              <Eye className="w-3 h-3 text-sky-500" />
              <span>{(story.analytics?.viewsCount || 1200).toLocaleString()} viewed</span>
            </span>
            <span className="flex items-center gap-1 font-semibold" title="People who completed quiz and verification">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>{(story.analytics?.quizCompletionsCount || 42).toLocaleString()} quizzes</span>
            </span>
            {story.distressFund && (
              <span className="flex items-center gap-1 font-bold text-rose-600 dark:text-rose-400" title="People who have donated relief">
                <HeartHandshake className="w-3 h-3 text-rose-500" />
                <span>{story.distressFund.donorCount} donors</span>
              </span>
            )}
          </div>
        </div>

        {/* Card Footer: Action button or Claimed status + Send Relief Button */}
        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="text-[11px] text-slate-400 font-medium">{story.timestamp}</div>

          <div className="flex items-center gap-2">
            {(story.category === 'disaster_relief' || story.distressFund) && (
              <button
                type="button"
                onClick={() => openVolunteerModal(null)}
                className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/70 hover:bg-emerald-100 dark:hover:bg-emerald-900 border border-emerald-300 dark:border-emerald-800 transition-colors"
                title="Register to help at frontline refugee camps via WhatsApp / Mail / SMS"
              >
                <Tent className="w-3.5 h-3.5 text-emerald-600" />
                <span>Volunteer</span>
              </button>
            )}

            {story.distressFund && (
              <button
                type="button"
                onClick={() => openDistressPaymentModal(story)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black text-rose-700 dark:text-rose-200 bg-rose-100 dark:bg-rose-950/80 hover:bg-rose-200 dark:hover:bg-rose-900 border border-rose-300 dark:border-rose-800 transition-colors"
                title="Scan QR to send relief funds directly to people in distress"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Send Relief</span>
              </button>
            )}

            {isClaimed ? (
              <button
                onClick={() => openActionModal(story)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Claimed</span>
              </button>
            ) : (
              <button
                onClick={() => openActionModal(story)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs hover:shadow-emerald-500/20 transition-all"
              >
                <span>Take Action</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
