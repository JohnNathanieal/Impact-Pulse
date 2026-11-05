import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  UserCheck,
  MapPin,
  Phone,
  CheckCircle2,
  Share2,
  Copy,
  Check,
  Sparkles,
  Calendar,
  AlertTriangle,
  HeartHandshake,
  Truck,
  Droplet,
} from 'lucide-react';
import { useImpact } from '../context/ImpactContext';
import { getPanchayathContact } from '../data/panchayathContacts';
import { VolunteerRegistration } from '../types/impact';

const ON_SITE_ROLES = [
  { id: 'kitchen', label: 'Community Kitchen & Food Packing', icon: '🍲' },
  { id: 'first_aid', label: 'First Aid & Medical Triage Assist', icon: '🩺' },
  { id: 'debris', label: 'Debris & Flood Water Clearance', icon: '🚜' },
  { id: 'sorting', label: 'Relief Goods Sorting & Packaging', icon: '📦' },
  { id: 'transport', label: 'Logistics & Transport (Vehicle Driver)', icon: '🚚' },
  { id: 'intake', label: 'Refugee Camp Intake & Registry Desk', icon: '⛺' },
];

const BLOOD_GROUPS = ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'];

export const SiteVolunteerModal: React.FC = () => {
  const {
    isSiteVolunteerModalOpen,
    closeSiteVolunteerModal,
    selectedStoryForVolunteer,
    registerVolunteer,
    userLocation,
    addToast,
  } = useImpact();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([
    'Community Kitchen & Food Packing',
    'Relief Goods Sorting & Packaging',
  ]);
  const [availability, setAvailability] = useState<'immediate_24h' | 'weekends' | 'on_call_standby' | 'flexible'>(
    'immediate_24h'
  );
  const [transportSupport, setTransportSupport] = useState(true);

  // Confirmed pass state
  const [confirmedPass, setConfirmedPass] = useState<VolunteerRegistration | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  if (!isSiteVolunteerModalOpen) return null;

  const story = selectedStoryForVolunteer;
  const siteTitle = story?.headline || 'Emergency Community Relief Site';
  const siteLocation = story?.locationName || userLocation.name;
  const panchayath = story?.panchayathContact || getPanchayathContact(siteLocation);

  const toggleRole = (label: string) => {
    if (selectedRoles.includes(label)) {
      if (selectedRoles.length > 1) {
        setSelectedRoles(selectedRoles.filter((r) => r !== label));
      }
    } else {
      setSelectedRoles([...selectedRoles, label]);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      addToast({
        type: 'warning',
        title: 'Name Required',
        message: 'Please provide your full name for the official site pass.',
      });
      return;
    }
    if (!phone.trim()) {
      addToast({
        type: 'warning',
        title: 'Phone Required',
        message: 'Please provide your phone number so the Panchayath desk can coordinate shifts.',
      });
      return;
    }

    const { registration } = registerVolunteer({
      fullName: fullName.trim(),
      phone: phone.trim(),
      whatsappNumber: whatsappNumber.trim() || phone.trim(),
      email: `${fullName.toLowerCase().replace(/\s+/g, '')}@civicvolunteer.org`,
      city: siteLocation.split(',')[0] || userLocation.name,
      campId: story?.id || 'site-emergency-camp',
      campName: `${panchayath.panchayathName} Ground Relief Team - ${siteLocation}`,
      roles: selectedRoles,
      bloodGroup,
      availability,
      transportSupport,
      channelUsed: 'direct_portal',
    });

    setConfirmedPass(registration);
  };

  const handleCopyPass = () => {
    if (!confirmedPass) return;
    const passText = `[GRAMA PANCHAYATH ON-SITE VOLUNTEER PASS]\nPass ID: ${confirmedPass.volunteerPassId}\nVolunteer: ${confirmedPass.fullName}\nSite: ${siteTitle}\nPanchayath: ${panchayath.panchayathName}\nDesk Address: ${panchayath.officeAddress}\nDesk Landline: ${panchayath.officeLandline}\nBlood Group: ${confirmedPass.bloodGroup}\nAssigned Roles: ${confirmedPass.roles.join(', ')}`;
    navigator.clipboard?.writeText(passText);
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
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 font-bold block">
                  Ground Triage & Support Force
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-white">
                  Be a Volunteer at the Site
                </h2>
              </div>
            </div>

            <button
              onClick={closeSiteVolunteerModal}
              className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Context Banner */}
          <div className="mt-4 p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 flex items-center gap-3">
            <MapPin className="w-4 h-4 text-emerald-300 shrink-0" />
            <div className="min-w-0 flex-1 text-xs">
              <strong className="block text-white truncate">{siteTitle}</strong>
              <span className="text-emerald-200 text-[11px]">
                {panchayath.panchayathName} • {panchayath.wardNumber}
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/30 text-emerald-300 font-bold text-[10px] shrink-0">
              +150 pts
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-slate-900 dark:text-slate-100">
          {!confirmedPass ? (
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Panchayath Reporting Desk Info */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 font-bold">
                  <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                    Panchayath Volunteer Command Desk
                  </span>
                  <a href={`tel:${panchayath.officeLandline}`} className="underline font-mono text-[11px]">
                    {panchayath.officeLandline}
                  </a>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Desk Location: {panchayath.officeAddress}
                </p>
                <div className="text-[11px] text-slate-600 dark:text-slate-300 pt-1 border-t border-slate-200 dark:border-slate-700 flex justify-between">
                  <span>Ward Officer: <strong>{panchayath.wardMemberName}</strong></span>
                  <a href={`tel:${panchayath.wardMemberPhone}`} className="text-emerald-600 font-bold underline">
                    {panchayath.wardMemberPhone}
                  </a>
                </div>
              </div>

              {/* Roles Needed Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Select Ground Duties You Can Assist With
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ON_SITE_ROLES.map((role) => {
                    const isSelected = selectedRoles.includes(role.label);
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => toggleRole(role.label)}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center gap-2.5 ${
                          isSelected
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-base">{role.icon}</span>
                        <span className="flex-1">{role.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Volunteer Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Arun Kumar"
                    className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Phone / Contact Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 98470 12345"
                    className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Blood Group
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-emerald-500"
                  >
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Availability
                  </label>
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="immediate_24h">Immediate (24/7 Available)</option>
                    <option value="weekends">Weekends Only</option>
                    <option value="on_call_standby">On-Call Standby</option>
                    <option value="flexible">Flexible Hours</option>
                  </select>
                </div>
              </div>

              {/* Transport Checkbox */}
              <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={transportSupport}
                  onChange={(e) => setTransportSupport(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  I have personal vehicle (2-wheeler / 4-wheeler) for ground mobilization & transport
                </span>
              </label>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm shadow-md shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Enlist & Generate On-Site Volunteer Pass (+150 pts)</span>
                </button>
              </div>
            </form>
          ) : (
            /* Official Pass View */
            <div className="space-y-4">
              <div className="p-5 rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-white via-emerald-50/40 to-white dark:from-slate-800 dark:via-emerald-950/20 dark:to-slate-800 shadow-md space-y-4">
                <div className="flex items-start justify-between border-b border-emerald-200/60 dark:border-emerald-800/40 pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                      OFFICIAL ON-SITE VOLUNTEER PASS
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1">
                      {confirmedPass.fullName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Blood Group: <strong className="text-rose-600 font-bold">{confirmedPass.bloodGroup}</strong> • Phone: {confirmedPass.phone}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-black text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 block">
                      {confirmedPass.volunteerPassId}
                    </span>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                      ✓ LSGD Verified
                    </span>
                  </div>
                </div>

                <div className="text-xs space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900 dark:text-white">Reporting Location:</strong>
                      <span className="text-slate-600 dark:text-slate-300">{panchayath.officeAddress}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900 dark:text-white">Commanding Officer:</strong>
                      <span className="text-slate-600 dark:text-slate-300">
                        {panchayath.wardMemberName} ({panchayath.wardNumber}) • Tel: {panchayath.wardMemberPhone}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Assigned Duties:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {confirmedPass.roles.map((r, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-emerald-100 dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700"
                      >
                        ✓ {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pass Actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyPass}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  <span>{isCopied ? 'Pass Copied' : 'Copy Pass Details'}</span>
                </button>

                <a
                  href={`tel:${panchayath.wardMemberPhone}`}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Officer Desk</span>
                </a>
              </div>

              <button
                type="button"
                onClick={closeSiteVolunteerModal}
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
