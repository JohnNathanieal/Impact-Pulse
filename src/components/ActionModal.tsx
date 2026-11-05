import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  QrCode,
  Phone,
  Mail,
  Building,
  Check,
  ExternalLink,
  Camera,
  Award,
  FileCheck2,
  UserCheck,
  Package,
} from 'lucide-react';
import { useImpact } from '../context/ImpactContext';
import { calculateDistanceKm, evaluateQuiz, checkDailyPointLimit } from '../utils/impactLogic';
import { NewsStory, PanchayathContact } from '../types/impact';
import { getPanchayathContact } from '../data/panchayathContacts';

interface ActionModalContentProps {
  story: NewsStory;
  onClose: () => void;
}

const ActionModalContent: React.FC<ActionModalContentProps> = ({ story, onClose }) => {
  const {
    userLocation,
    wallet,
    claimArticlePoints,
    signPetition,
    openDistressPaymentModal,
    openSiteVolunteerModal,
    openItemDonationModal,
    addToast,
  } = useImpact();

  const isAlreadyClaimed = wallet.claimedArticleIds.includes(story.id);

  // Panchayath contact: use from story or resolved from directory
  const panchayath: PanchayathContact =
    story.panchayathContact ||
    story.distressFund?.panchayathContact ||
    getPanchayathContact(story.locationName + ' ' + story.headline);

  // Petition state
  const isPetitionSigned = wallet.signedPetitionIds.includes(story.helpCommunity.petition?.id || '');
  const [petitionName, setPetitionName] = useState('');
  const [petitionEmail, setPetitionEmail] = useState('');

  // Image handling
  const [modalImgSrc, setModalImgSrc] = useState(story.imageUrl);
  const [proxyRetried, setProxyRetried] = useState(false);

  useEffect(() => {
    setModalImgSrc(story.imageUrl);
    setProxyRetried(false);
  }, [story.imageUrl]);

  const handleModalImageError = () => {
    if (!proxyRetried && modalImgSrc && !modalImgSrc.startsWith('/api/news/image-proxy')) {
      setProxyRetried(true);
      setModalImgSrc(`/api/news/image-proxy?url=${encodeURIComponent(modalImgSrc)}`);
    }
  };

  // 1. Reading Time-Lock (15 seconds)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(() => (isAlreadyClaimed ? 0 : 15));
  const isReadingTimeComplete = secondsRemaining === 0;

  useEffect(() => {
    if (isAlreadyClaimed || secondsRemaining <= 0) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAlreadyClaimed]);

  // 2. Geofence radius
  const realDistanceKm = calculateDistanceKm(
    userLocation.lat,
    userLocation.lng,
    story.coordinates.lat,
    story.coordinates.lng
  );
  const [simulateProximity, setSimulateProximity] = useState(false);
  const isGeofenceVerified =
    realDistanceKm <= story.geofenceRadiusKm || simulateProximity || isAlreadyClaimed;

  // 3. Quiz Guard
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(isAlreadyClaimed);

  const correctAnswersArray = story.quiz.map((q) => q.correctIndex);
  const quizEvaluation = evaluateQuiz(quizAnswers, correctAnswersArray);
  const isQuizPassed = isAlreadyClaimed || (quizSubmitted && quizEvaluation.passed);

  // Rate Limiter
  const todayStr = new Date().toISOString().split('T')[0];
  const rateLimitCheck = checkDailyPointLimit(
    todayStr,
    wallet.dailyPointsDate,
    wallet.dailyPointsEarned,
    story.pointsReward,
    500
  );

  const canClaimPoints =
    !isAlreadyClaimed &&
    isReadingTimeComplete &&
    isGeofenceVerified &&
    isQuizPassed &&
    rateLimitCheck.allowed;

  const handleSignPetitionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!story.helpCommunity.petition) return;
    signPetition(story.id, story.helpCommunity.petition.id);
  };

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    setQuizAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
    setQuizSubmitted(false);
  };

  const handleValidateQuiz = () => {
    setQuizSubmitted(true);
    if (quizEvaluation.passed) {
      addToast({
        type: 'success',
        title: 'Comprehension Verified!',
        message: 'All answers correct. You can now claim your civic reward.',
      });
    } else {
      addToast({
        type: 'warning',
        title: 'Review Answers',
        message: 'Some answers were incorrect. Please review the story.',
      });
    }
  };

  const handleClaim = () => {
    if (!canClaimPoints) return;
    claimArticlePoints(story, ['Panchayath Verification', 'Comprehension Quiz Passed']);
    onClose();
  };

  return (
    <div className="flex flex-col h-full max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
      {/* Top Header */}
      <div className="relative p-5 sm:p-6 bg-slate-900 text-white shrink-0 border-b border-slate-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-wrap items-center gap-2 mb-2 pr-10">
          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-mono">
            {story.category.replace('_', ' ')}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span>{story.locationName}</span>
          </span>
        </div>

        <h2 className="text-lg sm:text-xl font-extrabold text-white leading-snug pr-8">
          {story.headline}
        </h2>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-1.5 font-bold text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>+{story.pointsReward} Civic Points</span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            {isReadingTimeComplete ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" /> Reading Verified
              </span>
            ) : (
              <span className="text-amber-300">Lock: {secondsRemaining}s</span>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable Clean Content */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
        {/* Photo Banner */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-xs">
          <div className="relative h-44 sm:h-52 w-full overflow-hidden">
            <img
              src={modalImgSrc}
              alt={story.headline}
              onError={handleModalImageError}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-2.5 left-3 text-[11px] font-bold text-white flex items-center gap-1">
              <Camera className="w-3.5 h-3.5 text-emerald-400" />
              <span>{story.sourceAgency} Verified Field Image</span>
            </div>
          </div>
        </div>

        {/* Story Brief */}
        <div className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60">
          <p className="font-semibold text-slate-900 dark:text-white">{story.summary}</p>
          {story.fullContent.map((p, idx) => (
            <p key={idx} className="text-slate-600 dark:text-slate-300">
              {p}
            </p>
          ))}
        </div>

        {/* OFFICIAL GRAMA PANCHAYATH CONTACT & CIVIC DESK */}
        <div className="rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-white dark:from-slate-800 dark:via-slate-800 dark:to-slate-800/90 p-5 shadow-xs space-y-4">
          <div className="flex items-start justify-between gap-3 border-b border-emerald-200/80 dark:border-slate-700 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shrink-0">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                  Local Self Government (LSGD)
                </span>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                  {panchayath.panchayathName}
                </h3>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-600 text-white">
              {panchayath.wardNumber}
            </span>
          </div>

          {/* Panchayath Official Contacts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Ward Member */}
            <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Ward Representative</span>
              <strong className="text-slate-900 dark:text-white text-sm block">{panchayath.wardMemberName}</strong>
              <div className="flex items-center justify-between pt-1">
                <span className="font-mono text-slate-600 dark:text-slate-300">{panchayath.wardMemberPhone}</span>
                <a
                  href={`tel:${panchayath.wardMemberPhone}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call</span>
                </a>
              </div>
            </div>

            {/* Panchayath President */}
            <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Panchayath President</span>
              <strong className="text-slate-900 dark:text-white text-sm block">{panchayath.presidentName}</strong>
              <div className="flex items-center justify-between pt-1">
                <span className="font-mono text-slate-600 dark:text-slate-300">{panchayath.presidentPhone}</span>
                <a
                  href={`tel:${panchayath.presidentPhone}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-opacity"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call</span>
                </a>
              </div>
            </div>

            {/* Panchayath Secretary */}
            <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Panchayath Secretary</span>
              <strong className="text-slate-900 dark:text-white text-xs block">{panchayath.secretaryName}</strong>
              <div className="flex items-center justify-between pt-1">
                <span className="font-mono text-[11px] text-slate-600 dark:text-slate-300">{panchayath.secretaryPhone}</span>
                <a
                  href={`tel:${panchayath.secretaryPhone}`}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                >
                  <Phone className="w-2.5 h-2.5" />
                  <span>Call</span>
                </a>
              </div>
            </div>

            {/* Office Landline & Desk */}
            <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Office Landline & Helpdesk</span>
              <strong className="text-slate-900 dark:text-white text-xs block font-mono">{panchayath.officeLandline}</strong>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-500 truncate block">{panchayath.officeEmail}</span>
                <a
                  href={`tel:${panchayath.officeLandline}`}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                >
                  <Phone className="w-2.5 h-2.5" />
                  <span>Call</span>
                </a>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
            📍 Office Address: {panchayath.officeAddress}
          </p>
        </div>

        {/* Emergency Distress Relief Appeal (If present) */}
        {story.distressFund && (
          <div className="rounded-2xl border-2 border-rose-500/30 bg-rose-50/40 dark:bg-rose-950/20 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-rose-700 dark:text-rose-300">
                🚨 Emergency Relief Fund
              </span>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                ₹{story.distressFund.raisedAmount.toLocaleString()} raised of ₹{story.distressFund.targetAmount.toLocaleString()}
              </span>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300">
              {story.distressFund.beneficiary.urgencyReason}
            </p>

            <button
              type="button"
              onClick={() => {
                onClose();
                openDistressPaymentModal(story);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-extrabold text-xs sm:text-sm shadow-md"
            >
              <QrCode className="w-4 h-4" />
              <span>Scan QR & Send Direct Relief to Beneficiary</span>
            </button>

            {/* Below the scan qr and send money: Be a volunteer at the site & Donate item */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-rose-200/50 dark:border-rose-900/40">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openSiteVolunteerModal(story);
                }}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 transition-colors"
                title="Enlist to support relief efforts on the ground"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="truncate">(Be a volunteer at the site)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  openItemDonationModal(story);
                }}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800 transition-colors"
                title="Donate food, clean water, blankets or medical supplies"
              >
                <Package className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span className="truncate">Donate item</span>
              </button>
            </div>
          </div>
        )}

        {/* Digital Petition (If present) */}
        {story.helpCommunity.petition && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                Official Civic Petition: {story.helpCommunity.petition.title}
              </h4>
              <span className="text-[11px] text-slate-500">
                {(story.helpCommunity.petition.currentSignatures + (isPetitionSigned ? 1 : 0)).toLocaleString()} / {story.helpCommunity.petition.targetSignatures.toLocaleString()} signatures
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 italic">
              &ldquo;{story.helpCommunity.petition.statement}&rdquo;
            </p>

            {isPetitionSigned ? (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>You have signed this petition. Verified on civic ledger.</span>
              </div>
            ) : (
              <form onSubmit={handleSignPetitionSubmit} className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Your Full Name"
                  value={petitionName}
                  onChange={(e) => setPetitionName(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white transition-colors"
                >
                  Sign Petition
                </button>
              </form>
            )}
          </div>
        )}

        {/* Comprehension Quiz to Earn Civic Points */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-500" />
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                Quick Verification Quiz (+{story.pointsReward} Points)
              </h4>
            </div>
            {isQuizPassed && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                <Check className="w-3 h-3" /> Passed
              </span>
            )}
          </div>

          <div className="space-y-4">
            {story.quiz.map((q, qIdx) => (
              <div key={qIdx} className="space-y-2">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {qIdx + 1}. {q.question}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = quizAnswers[qIdx] === optIdx;
                    return (
                      <button
                        type="button"
                        key={optIdx}
                        disabled={isAlreadyClaimed}
                        onClick={() => handleAnswerSelect(qIdx, optIdx)}
                        className={`p-2.5 rounded-xl text-left text-xs transition-all border ${
                          isSelected
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 font-bold text-emerald-900 dark:text-emerald-200'
                            : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {!isAlreadyClaimed && !isQuizPassed && (
            <button
              type="button"
              onClick={handleValidateQuiz}
              disabled={Object.keys(quizAnswers).length < story.quiz.length}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 disabled:opacity-50 transition-opacity"
            >
              Verify Quiz Answers
            </button>
          )}
        </div>
      </div>

      {/* Footer Action Bar */}
      <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-between gap-3 shrink-0">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {isAlreadyClaimed ? (
            <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Points Claimed for this story
            </span>
          ) : !isReadingTimeComplete ? (
            <span>Read for {secondsRemaining} more seconds to unlock points</span>
          ) : !isQuizPassed ? (
            <span>Complete quiz above to claim reward</span>
          ) : (
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              ✓ Ready to claim +{story.pointsReward} Civic Points!
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Close
          </button>

          {!isAlreadyClaimed && (
            <button
              onClick={handleClaim}
              disabled={!canClaimPoints}
              className="px-5 py-2 rounded-xl text-xs sm:text-sm font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
            >
              <Award className="w-4 h-4" />
              <span>Claim +{story.pointsReward} pts</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const ActionModal: React.FC = () => {
  const { activeStoryForModal, closeActionModal } = useImpact();

  if (!activeStoryForModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={closeActionModal}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-2xl my-6"
        onClick={(e) => e.stopPropagation()}
      >
        <ActionModalContent story={activeStoryForModal} onClose={closeActionModal} />
      </div>
    </div>
  );
};
