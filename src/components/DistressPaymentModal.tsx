import React, { useState, useEffect } from 'react';
import {
  X,
  QrCode,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';
import { useImpact } from '../context/ImpactContext';
import { buildUpiPayload, generateQrDataUrl } from '../utils/qrGenerator';
import { DistressDonationRecord } from '../types/impact';

const AMOUNT_PRESETS = [
  { amount: 100, label: '₹100' },
  { amount: 250, label: '₹250' },
  { amount: 500, label: '₹500', recommended: true },
  { amount: 1000, label: '₹1,000' },
  { amount: 2500, label: '₹2,500' },
];

export const DistressPaymentModal: React.FC = () => {
  const {
    isDistressPaymentModalOpen,
    closeDistressPaymentModal,
    activeDistressStory,
    recordDistressDonation,
    addToast,
  } = useImpact();

  const story = activeDistressStory;
  const distressFund = story?.distressFund;

  // Selected Amount
  const [selectedAmount, setSelectedAmount] = useState<number>(500);
  const [isCustomAmount, setIsCustomAmount] = useState<boolean>(false);
  const [customAmountInput, setCustomAmountInput] = useState<string>('500');

  // Generated dynamic QR data URL
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isQrLoading, setIsQrLoading] = useState<boolean>(false);

  // Form fields for payment verification
  const [donorName, setDonorName] = useState<string>('Community Supporter');
  const [upiRef, setUpiRef] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Success receipt state
  const [completedRecord, setCompletedRecord] = useState<DistressDonationRecord | null>(null);

  // Effective amount
  const effectiveAmount = isCustomAmount ? Math.max(10, Number(customAmountInput) || 10) : selectedAmount;

  // Generate UPI QR Code whenever amount, UPI ID or story changes
  useEffect(() => {
    if (!distressFund) return;

    let isMounted = true;
    setIsQrLoading(true);

    const payload = buildUpiPayload({
      upiId: distressFund.upiId,
      recipientName: distressFund.recipientName,
      amount: effectiveAmount,
      note: `Relief: ${distressFund.beneficiary.name.slice(0, 25)}`,
      currency: 'INR',
      transactionRef: `IP-${Date.now().toString().slice(-6)}`,
    });

    generateQrDataUrl(payload)
      .then((url) => {
        if (isMounted) {
          setQrDataUrl(url);
          setIsQrLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsQrLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [distressFund, effectiveAmount]);

  // Reset completed record when modal closes or opens
  useEffect(() => {
    if (!isDistressPaymentModalOpen) {
      setCompletedRecord(null);
    }
  }, [isDistressPaymentModalOpen]);

  if (!isDistressPaymentModalOpen || !story || !distressFund) {
    return null;
  }

  // Handle Preset Selection
  const handleSelectPreset = (amount: number) => {
    setIsCustomAmount(false);
    setSelectedAmount(amount);
    setCustomAmountInput(amount.toString());
  };

  // Copy UPI ID
  const handleCopyUpi = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(distressFund.upiId);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      addToast({
        type: 'success',
        title: 'UPI ID Copied',
        message: `${distressFund.upiId} copied to clipboard.`,
      });
    }
  };

  // Open UPI Deep Link on mobile
  const handleOpenUpiApp = () => {
    const payload = buildUpiPayload({
      upiId: distressFund.upiId,
      recipientName: distressFund.recipientName,
      amount: effectiveAmount,
      note: `Relief: ${distressFund.beneficiary.name.slice(0, 25)}`,
      currency: 'INR',
    });
    window.location.href = payload;
  };

  // Submit and verify payment
  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (effectiveAmount <= 0) {
      addToast({ type: 'warning', title: 'Invalid Amount', message: 'Please enter a valid donation amount.' });
      return;
    }

    const generatedUtr = upiRef.trim() || `UPI-TXN-${Math.floor(100000000000 + Math.random() * 900000000000)}`;

    const { record } = recordDistressDonation({
      storyId: story.id,
      headline: story.headline,
      beneficiaryName: distressFund.beneficiary.name,
      donorName: donorName.trim() || 'Civic Donor',
      amount: effectiveAmount,
      currency: 'INR',
      upiRefOrTxn: generatedUtr,
      paymentMethod: 'upi_qr',
      note: 'Direct emergency relief aid',
    });

    setCompletedRecord(record);
  };

  // Quick instant simulation for testers
  const handleInstantSimulatePayment = () => {
    const mockUtr = `UPI-${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    const { record } = recordDistressDonation({
      storyId: story.id,
      headline: story.headline,
      beneficiaryName: distressFund.beneficiary.name,
      donorName: donorName.trim() || 'Local Guardian',
      amount: effectiveAmount,
      currency: 'INR',
      upiRefOrTxn: mockUtr,
      paymentMethod: 'upi_qr',
      note: 'Instant emergency civic distress contribution',
    });

    setCompletedRecord(record);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="distress-modal-title"
    >
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-r from-rose-900 via-rose-800 to-amber-950 text-white shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500/30 text-rose-200 border border-rose-400/30">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span>
                Direct Relief Aid (UPI)
              </span>
              <h2 id="distress-modal-title" className="text-lg sm:text-xl font-black leading-snug">
                Send Money to {distressFund.recipientName}
              </h2>
              <p className="text-xs text-rose-200/90">
                100% Direct to Beneficiary UPI • Zero Platform Cut
              </p>
            </div>

            <button
              onClick={closeDistressPaymentModal}
              className="p-1.5 rounded-xl text-rose-200 hover:text-white hover:bg-white/10 transition-colors shrink-0"
              aria-label="Close relief payment modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {completedRecord ? (
            /* COMPLETED RECEIPT VIEW */
            <div className="space-y-5 animate-in zoom-in-95 duration-200 text-center py-2">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Payment Verified & Recorded!
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-sm mx-auto">
                  Your direct emergency relief contribution has reached the recipient.
                </p>
              </div>

              {/* Official Receipt Card */}
              <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 text-left space-y-2.5 text-xs">
                <div className="flex justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Beneficiary:</span>
                  <strong className="text-slate-900 dark:text-white text-right font-bold">
                    {completedRecord.beneficiaryName}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Donor Name:</span>
                  <strong className="text-slate-900 dark:text-white">{completedRecord.donorName}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Amount Sent:</span>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                    ₹{completedRecord.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">UPI / Reference:</span>
                  <span className="font-mono text-slate-900 dark:text-white">{completedRecord.upiRefOrTxn}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Civic Points Earned:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    +{completedRecord.pointsEarned} Points
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={closeDistressPaymentModal}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm transition-colors shadow-md"
              >
                Done & Close
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* 1. CONTRIBUTION AMOUNT */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">1</span>
                    <span>Contribution Amount</span>
                  </label>
                  <span className="text-xs text-slate-500 font-mono">
                    Active: <strong className="text-emerald-600 dark:text-emerald-400 font-black text-sm">₹{effectiveAmount.toLocaleString()}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {AMOUNT_PRESETS.map((preset) => {
                    const isSelected = !isCustomAmount && selectedAmount === preset.amount;
                    return (
                      <button
                        key={preset.amount}
                        type="button"
                        onClick={() => handleSelectPreset(preset.amount)}
                        className={`py-2.5 px-2 rounded-2xl border text-center transition-all ${
                          isSelected
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-md font-black scale-[1.02]'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-emerald-400 font-bold'
                        }`}
                      >
                        <div className="text-sm sm:text-base font-black">{preset.label}</div>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Amount option */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsCustomAmount(!isCustomAmount)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                      isCustomAmount
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    Custom Amount
                  </button>

                  {isCustomAmount && (
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs">₹</span>
                      <input
                        type="number"
                        min="10"
                        step="50"
                        value={customAmountInput}
                        onChange={(e) => setCustomAmountInput(e.target.value)}
                        placeholder="Enter amount"
                        className="w-full pl-7 pr-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-white dark:bg-slate-900 border border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* 2. SCAN QR CODE */}
              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <label className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">2</span>
                  <span>Scan QR Code</span>
                </label>

                <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 flex flex-col items-center text-center space-y-4">
                  {/* The QR Box */}
                  <div className="bg-white p-3 rounded-2xl shadow-md border-2 border-slate-200 dark:border-slate-700">
                    {isQrLoading ? (
                      <div className="w-48 h-48 sm:w-56 sm:h-56 flex flex-col items-center justify-center text-slate-400">
                        <RefreshCw className="w-8 h-8 animate-spin text-emerald-500 mb-2" />
                        <span className="text-xs">Generating UPI QR...</span>
                      </div>
                    ) : qrDataUrl ? (
                      <img
                        src={qrDataUrl}
                        alt="Scan UPI QR Code to donate relief funds"
                        className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-lg mx-auto"
                      />
                    ) : (
                      <div className="w-48 h-48 sm:w-56 sm:h-56 flex flex-col items-center justify-center text-slate-400">
                        <QrCode className="w-12 h-12 text-slate-300 mb-1" />
                        <span className="text-xs">QR Code unavailable</span>
                      </div>
                    )}
                    <div className="mt-2 text-xs font-black text-slate-800">
                      Amount: <span className="text-emerald-600 text-sm">₹{effectiveAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* UPI Details & Copy */}
                  <div className="w-full max-w-sm space-y-2">
                    <div className="flex items-center gap-2">
                      <code className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 flex-1 truncate text-center">
                        {distressFund.upiId}
                      </code>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-100 transition-colors shrink-0"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <div className="text-[11px] text-slate-500">
                      Receiver: <strong className="text-slate-800 dark:text-slate-200">{distressFund.recipientName}</strong>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-1 pt-1 text-[10px] text-slate-500 font-semibold">
                      <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">Google Pay</span>
                      <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">PhonePe</span>
                      <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">Paytm</span>
                      <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">BHIM UPI</span>
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenUpiApp}
                      className="w-full mt-2 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open in UPI App (Mobile)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. CONFIRM PAYMENT */}
              <form onSubmit={handleConfirmPayment} className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <label className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">3</span>
                    <span>Confirm Payment</span>
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-600">+200 Civic Points</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      UPI Ref / Transaction ID (Optional)
                    </label>
                    <input
                      type="text"
                      value={upiRef}
                      onChange={(e) => setUpiRef(e.target.value)}
                      placeholder="e.g. 331289104231"
                      className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleInstantSimulatePayment}
                    className="px-3.5 py-3 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700 shrink-0"
                    title="Simulate instant payment for test verification"
                  >
                    Quick Test
                  </button>

                  <button
                    type="submit"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
                  >
                    <span>I Have Paid ₹{effectiveAmount.toLocaleString()} — Confirm Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
