import React, { useState } from 'react';
import {
  X,
  Package,
  MapPin,
  ShieldCheck,
  Check,
  Copy,
  Phone,
  Plus,
  Minus,
  Sparkles,
  Truck,
  Building,
  CheckCircle2,
} from 'lucide-react';
import { useImpact } from '../context/ImpactContext';
import { getPanchayathContact } from '../data/panchayathContacts';
import { ItemDonationRecord } from '../types/impact';

interface ReliefNeedItem {
  id: string;
  name: string;
  defaultUnit: string;
  icon: string;
  category: string;
}

const ESSENTIAL_ITEMS: ReliefNeedItem[] = [
  { id: 'rice', name: 'Dry Rations (Rice / Wheat / Dal)', defaultUnit: 'kg', icon: '🌾', category: 'Food' },
  { id: 'water', name: 'Packaged Drinking Water (20L Cans / Boxes)', defaultUnit: 'cans', icon: '💧', category: 'Water' },
  { id: 'blankets', name: 'Warm Blankets & Bedding Sheets', defaultUnit: 'pieces', icon: '🛏️', category: 'Shelter' },
  { id: 'first_aid', name: 'First Aid, Antiseptics & ORS Packets', defaultUnit: 'kits', icon: '💊', category: 'Medical' },
  { id: 'tarpaulin', name: 'Heavy Duty Tarpaulin Sheets (Waterproof)', defaultUnit: 'sheets', icon: '⛺', category: 'Shelter' },
  { id: 'hygiene', name: 'Hygiene & Sanitary Kits (Soaps, Pads)', defaultUnit: 'kits', icon: '🧼', category: 'Hygiene' },
  { id: 'clothes', name: 'Fresh / Clean Clothes & Rainwear', defaultUnit: 'sets', icon: '👕', category: 'Clothing' },
  { id: 'torch', name: 'Emergency Torches & Power Banks', defaultUnit: 'units', icon: '🔦', category: 'Utilities' },
];

export const ItemDonationModal: React.FC = () => {
  const {
    isItemDonationModalOpen,
    closeItemDonationModal,
    selectedStoryForItemDonation,
    recordItemDonation,
    userLocation,
    addToast,
  } = useImpact();

  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'self_dropoff' | 'volunteer_pickup'>('self_dropoff');
  const [pickupAddress, setPickupAddress] = useState('');
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>({
    rice: 5,
    water: 2,
    blankets: 2,
  });

  const [confirmedDonation, setConfirmedDonation] = useState<ItemDonationRecord | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  if (!isItemDonationModalOpen) return null;

  const story = selectedStoryForItemDonation;
  const siteTitle = story?.headline || 'Emergency Community Relief Site';
  const siteLocation = story?.locationName || userLocation.name;
  const panchayath = story?.panchayathContact || getPanchayathContact(siteLocation);

  const updateQuantity = (itemId: string, delta: number) => {
    setItemQuantities((prev) => {
      const current = prev[itemId] || 0;
      const updated = Math.max(0, current + delta);
      return { ...prev, [itemId]: updated };
    });
  };

  const selectedItemsList = Object.entries(itemQuantities)
    .filter(([_, qty]) => qty > 0)
    .map(([id, qty]) => {
      const itemDef = ESSENTIAL_ITEMS.find((i) => i.id === id);
      return {
        itemName: itemDef?.name || id,
        quantity: `${qty} ${itemDef?.defaultUnit || 'units'}`,
      };
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedItemsList.length === 0) {
      addToast({
        type: 'warning',
        title: 'Select Items',
        message: 'Please choose at least one item and quantity to donate.',
      });
      return;
    }

    if (!donorName.trim()) {
      addToast({
        type: 'warning',
        title: 'Name Required',
        message: 'Please provide your name for the donation intake token.',
      });
      return;
    }

    if (!donorPhone.trim()) {
      addToast({
        type: 'warning',
        title: 'Phone Required',
        message: 'Please provide your mobile number so intake volunteers can coordinate with you.',
      });
      return;
    }

    if (deliveryMethod === 'volunteer_pickup' && !pickupAddress.trim()) {
      addToast({
        type: 'warning',
        title: 'Address Required',
        message: 'Please enter your pickup address and landmark for volunteer collection.',
      });
      return;
    }

    const { record } = recordItemDonation({
      storyId: story?.id || 'site-relief-items',
      headline: siteTitle,
      siteName: `${panchayath.panchayathName} Relief Counter - ${siteLocation}`,
      donorName: donorName.trim(),
      donorPhone: donorPhone.trim(),
      items: selectedItemsList,
      deliveryMethod,
      pickupAddress: deliveryMethod === 'volunteer_pickup' ? pickupAddress.trim() : undefined,
      collectionDeskAddress: panchayath.officeAddress,
      deskPhone: panchayath.officeLandline,
    });

    setConfirmedDonation(record);
  };

  const handleCopyToken = () => {
    if (!confirmedDonation) return;
    const text = `[MATERIAL RELIEF DONATION TOKEN]\nToken: ${confirmedDonation.tokenNumber}\nDonor: ${confirmedDonation.donorName}\nSite: ${confirmedDonation.siteName}\nCollection Desk: ${panchayath.officeAddress}\nDesk Phone: ${panchayath.officeLandline}\nItems: ${confirmedDonation.items.map((i) => `${i.quantity} ${i.itemName}`).join(', ')}\nDelivery: ${confirmedDonation.deliveryMethod === 'self_dropoff' ? 'Self Drop-off at Panchayath Desk' : 'Volunteer Pickup'}`;
    navigator.clipboard?.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div
        className="w-full max-w-xl my-6 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-900 via-stone-900 to-slate-900 text-white shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/30 border border-amber-400/40 flex items-center justify-center text-amber-300">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold block">
                  Material Aid & Essential Goods
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-white">
                  Donate Item & Relief Supplies
                </h2>
              </div>
            </div>

            <button
              onClick={closeItemDonationModal}
              className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Context Banner */}
          <div className="mt-4 p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 flex items-center gap-3">
            <MapPin className="w-4 h-4 text-amber-300 shrink-0" />
            <div className="min-w-0 flex-1 text-xs">
              <strong className="block text-white truncate">{siteTitle}</strong>
              <span className="text-amber-200 text-[11px]">
                Intake Desk: {panchayath.panchayathName} • {panchayath.wardNumber}
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-amber-500/30 text-amber-300 font-bold text-[10px] shrink-0">
              +75 pts
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-slate-900 dark:text-slate-100">
          {!confirmedDonation ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Panchayath Intake Desk Notice */}
              <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-amber-900 dark:text-amber-200">
                  <span className="flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    Panchayath Material Relief Counter
                  </span>
                  <a href={`tel:${panchayath.officeLandline}`} className="underline font-mono text-[11px]">
                    {panchayath.officeLandline}
                  </a>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                  Intake Location: {panchayath.officeAddress} (Open 8:00 AM – 8:00 PM Daily)
                </p>
              </div>

              {/* Essential Items List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Choose Essential Items to Donate
                  </label>
                  <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400">
                    {selectedItemsList.length} items chosen
                  </span>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {ESSENTIAL_ITEMS.map((item) => {
                    const qty = itemQuantities[item.id] || 0;
                    return (
                      <div
                        key={item.id}
                        className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                          qty > 0
                            ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-400/80 dark:border-amber-800'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <span className="text-lg shrink-0">{item.icon}</span>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {item.name}
                            </h4>
                            <span className="text-[10px] text-slate-400">Unit: {item.defaultUnit}</span>
                          </div>
                        </div>

                        {/* Quantity Counter */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={qty === 0}
                            className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold disabled:opacity-30"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center font-mono font-bold text-xs text-slate-900 dark:text-white">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-7 h-7 rounded-lg bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center font-bold shadow-xs"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery / Drop-off Method Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Delivery / Collection Method
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('self_dropoff')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-2.5 ${
                      deliveryMethod === 'self_dropoff'
                        ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-500 text-amber-900 dark:text-amber-200 font-bold'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Building className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block">Self Drop-off</strong>
                      <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
                        Deliver directly to Panchayath Relief Counter
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('volunteer_pickup')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-2.5 ${
                      deliveryMethod === 'volunteer_pickup'
                        ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-500 text-amber-900 dark:text-amber-200 font-bold'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Truck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block">Volunteer Pick-up</strong>
                      <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
                        Ward team collects items from your home
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Pickup Address (If Selected) */}
              {deliveryMethod === 'volunteer_pickup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Your Pickup Address & Landmark *
                  </label>
                  <input
                    type="text"
                    required
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    placeholder="House name, street, nearby landmark"
                    className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              )}

              {/* Donor Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="e.g. Meera Nair"
                    className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    placeholder="e.g. 94471 23456"
                    className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white font-extrabold text-sm shadow-md shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  <Package className="w-4 h-4" />
                  <span>Confirm Relief Item Donation (+75 pts)</span>
                </button>
              </div>
            </form>
          ) : (
            /* Official Donation Token Confirmation */
            <div className="space-y-4">
              <div className="p-5 rounded-3xl border-2 border-amber-500/40 bg-gradient-to-br from-white via-amber-50/40 to-white dark:from-slate-800 dark:via-amber-950/20 dark:to-slate-800 shadow-md space-y-4">
                <div className="flex items-start justify-between border-b border-amber-200/60 dark:border-amber-800/40 pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-600 text-white">
                      OFFICIAL MATERIAL RELIEF TOKEN
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1">
                      {confirmedDonation.donorName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Donor Phone: {confirmedDonation.donorPhone} • Handover: {confirmedDonation.deliveryMethod === 'self_dropoff' ? 'Self Drop-off' : 'Volunteer Pickup'}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-black text-xs sm:text-sm text-amber-700 dark:text-amber-400 block">
                      {confirmedDonation.tokenNumber}
                    </span>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-bold">
                      ✓ Registered
                    </span>
                  </div>
                </div>

                {/* Items Summary */}
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Donated Items & Quantities:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {confirmedDonation.items.map((it, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-slate-700 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 flex items-center gap-1"
                      >
                        <Check className="w-3 h-3 text-amber-600" />
                        <span>{it.quantity} {it.itemName}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-xs space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700/60">
                  <div className="flex items-start gap-2">
                    <Building className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900 dark:text-white">Panchayath Intake Counter:</strong>
                      <span className="text-slate-600 dark:text-slate-300">{panchayath.officeAddress}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900 dark:text-white">Intake Officer Landline:</strong>
                      <a href={`tel:${panchayath.officeLandline}`} className="text-amber-700 dark:text-amber-300 font-bold underline">
                        {panchayath.officeLandline}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyToken}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  <span>{isCopied ? 'Token Copied' : 'Copy Token Slip'}</span>
                </button>

                <a
                  href={`tel:${panchayath.officeLandline}`}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Intake Desk</span>
                </a>
              </div>

              <button
                type="button"
                onClick={closeItemDonationModal}
                className="w-full py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors text-center"
              >
                Close & View Relief Directory
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
