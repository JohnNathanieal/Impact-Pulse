import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Send,
  MessageSquare,
  Mail,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Users,
  MapPin,
  Calendar,
  Sparkles,
  Award,
  Phone,
  FileCheck,
  Share2,
  Copy,
  Check,
  Heart,
  Droplet,
  Truck,
  ExternalLink,
} from 'lucide-react';
import { useImpact } from '../context/ImpactContext';
import { RefugeeCamp, VolunteerRegistration } from '../types/impact';
import {
  REFUGEE_CAMPS,
  VOLUNTEER_ROLE_OPTIONS,
  BLOOD_GROUPS,
  buildWhatsAppLink,
  buildEmailLink,
  buildSmsLink,
  buildVolunteerPayloadText,
} from '../data/refugeeCamps';

export const RefugeeCampVolunteerModal: React.FC = () => {
  const {
    isVolunteerModalOpen,
    closeVolunteerModal,
    refugeeCamps,
    selectedCampForVolunteer,
    setSelectedCampForVolunteer,
    registerVolunteer,
    userLocation,
    latestVolunteerRegistration,
  } = useImpact();

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState(userLocation.name.split(',')[0] || 'Thrissur');
  const [selectedCampId, setSelectedCampId] = useState<string>(
    selectedCampForVolunteer?.id || refugeeCamps[0]?.id || ''
  );
  const [selectedRoles, setSelectedRoles] = useState<string[]>([
    'Community Kitchen & Food Packaging',
    'First Aid & Paramedic Assistance',
  ]);
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [availability, setAvailability] = useState<'immediate_24h' | 'weekends' | 'on_call_standby' | 'flexible'>(
    'immediate_24h'
  );
  const [transportSupport, setTransportSupport] = useState(true);

  // Success / Pass view state
  const [confirmedRegistration, setConfirmedRegistration] = useState<VolunteerRegistration | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  // Sync selected camp
  useEffect(() => {
    if (selectedCampForVolunteer) {
      setSelectedCampId(selectedCampForVolunteer.id);
    }
  }, [selectedCampForVolunteer]);

  if (!isVolunteerModalOpen) return null;

  const currentCamp = refugeeCamps.find((c) => c.id === selectedCampId) || refugeeCamps[0] || null;

  const toggleRole = (role: string) => {
    if (selectedRoles.includes(role)) {
      if (selectedRoles.length > 1) {
        setSelectedRoles(selectedRoles.filter((r) => r !== role));
      }
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const handleRegisterAndDispatch = (channel: 'whatsapp' | 'email' | 'sms' | 'direct_portal') => {
    if (!fullName.trim()) {
      alert('Please enter your full name to register.');
      return;
    }
    if (!phone.trim()) {
      alert('Please enter your phone number so camp coordinators can reach you.');
      return;
    }

    const { registration } = registerVolunteer({
      fullName: fullName.trim(),
      phone: phone.trim(),
      whatsappNumber: whatsappNumber.trim() || phone.trim(),
      email: email.trim(),
      city: city.trim(),
      campId: currentCamp?.id || 'general-relief',
      campName: currentCamp?.campName || 'Disaster Relief Refugee Camp Network',
      roles: selectedRoles,
      bloodGroup,
      availability,
      transportSupport,
      channelUsed: channel,
    });

    setConfirmedRegistration(registration);

    // Build payload for external app redirection
    const payloadData = {
      fullName: registration.fullName,
      phone: registration.phone,
      whatsappNumber: registration.whatsappNumber,
      email: registration.email,
      city: registration.city,
      roles: registration.roles,
      bloodGroup: registration.bloodGroup,
      availability: registration.availability,
      transportSupport: registration.transportSupport,
      passId: registration.volunteerPassId,
    };

    if (channel === 'whatsapp') {
      const targetPhone = currentCamp?.coordinator.whatsappNumber || '+919447012345';
      const url = buildWhatsAppLink(targetPhone, currentCamp, payloadData);
      window.open(url, '_blank');
    } else if (channel === 'email') {
      const targetEmail = currentCamp?.coordinator.email || 'reliefdesk@kerala.gov.in';
      const url = buildEmailLink(targetEmail, currentCamp, payloadData);
      window.location.href = url;
    } else if (channel === 'sms') {
      const targetPhone = currentCamp?.coordinator.phone || '+919447012345';
      const url = buildSmsLink(targetPhone, currentCamp, payloadData);
      window.location.href = url;
    }
  };

  const handleCopyText = () => {
    if (!confirmedRegistration && !fullName.trim()) return;
    const text = buildVolunteerPayloadText(currentCamp, {
      fullName: confirmedRegistration?.fullName || fullName,
      phone: confirmedRegistration?.phone || phone,
      whatsappNumber: confirmedRegistration?.whatsappNumber || whatsappNumber || phone,
      email: confirmedRegistration?.email || email,
      city: confirmedRegistration?.city || city,
      roles: confirmedRegistration?.roles || selectedRoles,
      bloodGroup: confirmedRegistration?.bloodGroup || bloodGroup,
      availability: confirmedRegistration?.availability || availability,
      transportSupport: confirmedRegistration ? confirmedRegistration.transportSupport : transportSupport,
      passId: confirmedRegistration?.volunteerPassId || 'VOL-PENDING',
    });

    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
      onClick={closeVolunteerModal}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="relative bg-gradient-to-r from-teal-900 via-emerald-800 to-slate-900 text-white p-5 sm:p-6">
          <button
            onClick={closeVolunteerModal}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-500 text-emerald-950 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-950 animate-ping"></span>
              Humanitarian Aid Force
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/10 text-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Verified Camp Registry
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-snug">
            Disaster Relief & Refugee Camp Volunteer Intake
          </h2>

          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl leading-relaxed">
            Register to assist displaced families in refugee camps with food preparation, emergency first aid, logistics,
            or child care. Fast-track your registration directly via <strong>WhatsApp</strong>, <strong>Mail</strong>, or{' '}
            <strong>Message/SMS</strong>.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* If already confirmed, show the Official Volunteer Pass */}
          {confirmedRegistration ? (
            <div className="space-y-6 animate-in zoom-in-95 duration-200">
              {/* Confirmed Banner */}
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl p-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-emerald-900 dark:text-emerald-200">
                    Registration Successfully Recorded! (+150 Civic Points)
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed">
                    Your details and volunteer pass ID have been assigned. Keep your digital pass ready for check-in at the camp
                    relief desk.
                  </p>
                </div>
              </div>

              {/* Digital Volunteer ID Pass Card */}
              <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white p-6 shadow-xl border-2 border-emerald-500/40 overflow-hidden">
                <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl"></div>

                {/* Card Top */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-black uppercase tracking-wider text-emerald-400">
                        Disaster Response Bureau
                      </span>
                      <span className="text-xs font-extrabold tracking-tight">Refugee Camp Volunteer ID</span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {confirmedRegistration.volunteerPassId}
                  </span>
                </div>

                {/* Card Details Grid */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Volunteer Name</span>
                    <span className="text-sm font-extrabold text-white">{confirmedRegistration.fullName}</span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Blood Group</span>
                    <span className="text-sm font-bold text-rose-400">{confirmedRegistration.bloodGroup}</span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Assigned Camp</span>
                    <span className="font-semibold text-emerald-200 truncate block">
                      {confirmedRegistration.campName}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Availability</span>
                    <span className="font-semibold text-slate-200 capitalize">
                      {confirmedRegistration.availability.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="col-span-2">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Registered Skill Sets
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {confirmedRegistration.roles.map((r, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-white/10 text-emerald-300 border border-white/5 font-medium"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Civic Verification Active
                  </span>
                  <span className="font-mono text-[10px]">
                    Registered via {confirmedRegistration.channelUsed.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Share & Quick Re-Send Actions */}
              <div className="space-y-3">
                <span className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Direct Camp Dispatch Links (Click to Re-send to Coordinator):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    onClick={() => handleRegisterAndDispatch('whatsapp')}
                    className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Send via WhatsApp</span>
                  </button>

                  <button
                    onClick={() => handleRegisterAndDispatch('email')}
                    className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Send via Email</span>
                  </button>

                  <button
                    onClick={() => handleRegisterAndDispatch('sms')}
                    className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-sm"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Send via SMS</span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={handleCopyText}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedText ? 'Registration Payload Copied!' : 'Copy Formatted Text'}</span>
                  </button>

                  <button
                    onClick={() => setConfirmedRegistration(null)}
                    className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Register Another Volunteer
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Registration Form */
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleRegisterAndDispatch('whatsapp');
              }}
              className="space-y-6"
            >
              {/* Step 1: Select Refugee Camp */}
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  1. Select Target Refugee Camp / Relief Center
                </label>
                <select
                  value={selectedCampId}
                  onChange={(e) => {
                    setSelectedCampId(e.target.value);
                    const found = refugeeCamps.find((c) => c.id === e.target.value);
                    if (found) setSelectedCampForVolunteer(found);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {refugeeCamps.map((camp) => (
                    <option key={camp.id} value={camp.id}>
                      {camp.campName} ({camp.activeRefugeesCount} Displaced • {camp.status})
                    </option>
                  ))}
                </select>

                {/* Camp Spotlight Card */}
                {currentCamp && (
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{currentCamp.location}</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                        {currentCamp.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-600 dark:text-slate-300 pt-1">
                      <div>
                        <strong className="block text-slate-900 dark:text-white">Displaced Sheltered:</strong>
                        <span>
                          {currentCamp.activeRefugeesCount} / {currentCamp.capacityMax} people
                        </span>
                      </div>
                      <div>
                        <strong className="block text-slate-900 dark:text-white">Camp Coordinator:</strong>
                        <span>{currentCamp.coordinator.name}</span>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <strong className="block text-slate-900 dark:text-white">Helpline Desk:</strong>
                        <span className="font-mono">{currentCamp.coordinator.phone}</span>
                      </div>
                    </div>

                    <div className="pt-1.5 border-t border-slate-200 dark:border-slate-700/60">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Immediate Volunteer Roles Needed:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {currentCamp.rolesNeeded.map((r, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-medium"
                          >
                            ⚠️ {r.role} ({r.countNeeded})
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 2: Personal Contact Information */}
              <div className="space-y-3">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  2. Your Volunteer Details
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Menon"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Phone Number (Calls & SMS) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98470 XXXXX"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (!whatsappNumber) setWhatsappNumber(e.target.value);
                      }}
                      className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      WhatsApp Number (For Direct Roster Dispatch)
                    </label>
                    <input
                      type="tel"
                      placeholder="Same as phone or WhatsApp contact"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Email Address (Optional for Mail Registry)
                    </label>
                    <input
                      type="email"
                      placeholder="volunteer@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Home City / District *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Thrissur, Ernakulam, Kozhikode"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Blood Group (For Emergency Triage)
                    </label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      {BLOOD_GROUPS.map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 3: Skills & Roles Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    3. Select What You Can Help With in the Camp
                  </label>
                  <span className="text-[11px] text-slate-500">Select all that apply</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {VOLUNTEER_ROLE_OPTIONS.map((role) => {
                    const isSelected = selectedRoles.includes(role);
                    return (
                      <button
                        type="button"
                        key={role}
                        onClick={() => toggleRole(role)}
                        className={`p-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between border transition-all ${
                          isSelected
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span>{role}</span>
                        {isSelected ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 ml-1.5" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 shrink-0 ml-1.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 4: Availability & Transport */}
              <div className="space-y-3 pt-1">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  4. Availability & Mobility
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'immediate_24h' as const, label: 'Immediate (24h)', badge: 'Urgent' },
                    { id: 'weekends' as const, label: 'Weekends Roster', badge: 'Sat/Sun' },
                    { id: 'on_call_standby' as const, label: 'Emergency Standby', badge: 'On-Call' },
                    { id: 'flexible' as const, label: 'Flexible Shifts', badge: 'Part-time' },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setAvailability(item.id)}
                      className={`p-2.5 rounded-xl text-center text-xs font-bold border transition-all flex flex-col items-center justify-center gap-1 ${
                        availability === item.id
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className="text-[10px] font-mono opacity-80">{item.badge}</span>
                    </button>
                  ))}
                </div>

                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={transportSupport}
                    onChange={(e) => setTransportSupport(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">
                      I have my own vehicle / motorcycle / car for camp transit
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Enables emergency supply runs and relief food deliveries across refugee camps.
                    </span>
                  </div>
                </label>
              </div>

              {/* THREE 1-CLICK ACTION BUTTONS: WHATSAPP, EMAIL, SMS */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <span className="block text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  5. Choose How to Send & Register into the Community:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* WhatsApp Register */}
                  <button
                    type="button"
                    onClick={() => handleRegisterAndDispatch('whatsapp')}
                    className="group relative flex flex-col items-center justify-center p-3.5 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white shadow-md shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-center"
                  >
                    <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center mb-1.5 group-hover:rotate-12 transition-transform">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-black">Register via WhatsApp</span>
                    <span className="text-[10px] text-emerald-100 mt-0.5">Pre-filled chat to coordinator</span>
                  </button>

                  {/* Mail / Email Register */}
                  <button
                    type="button"
                    onClick={() => handleRegisterAndDispatch('email')}
                    className="group relative flex flex-col items-center justify-center p-3.5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white shadow-md shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-center"
                  >
                    <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center mb-1.5 group-hover:rotate-12 transition-transform">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-black">Register via Mail</span>
                    <span className="text-[10px] text-blue-100 mt-0.5">Formatted email dispatch</span>
                  </button>

                  {/* SMS / Message Register */}
                  <button
                    type="button"
                    onClick={() => handleRegisterAndDispatch('sms')}
                    className="group relative flex flex-col items-center justify-center p-3.5 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white shadow-md shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-center"
                  >
                    <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center mb-1.5 group-hover:rotate-12 transition-transform">
                      <Smartphone className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-black">Register via SMS</span>
                    <span className="text-[10px] text-indigo-100 mt-0.5">Standard mobile message</span>
                  </button>
                </div>

                {/* Direct Portal Register Alternative */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 text-xs sm:text-sm font-extrabold transition-all shadow-md"
                >
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Register & Generate Official Digital Volunteer Pass (+150 pts)</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
