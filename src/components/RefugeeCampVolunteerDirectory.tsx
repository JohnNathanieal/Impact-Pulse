import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  HeartHandshake,
  MessageSquare,
  Mail,
  Smartphone,
  CheckCircle2,
  Phone,
  Sparkles,
  ArrowRight,
  Search,
  Filter,
  Calendar,
  Clock,
  Award,
  ChevronRight,
  Tent,
  FileCheck,
  Building,
} from 'lucide-react';
import { useImpact } from '../context/ImpactContext';
import { RefugeeCamp } from '../types/impact';
import {
  buildWhatsAppLink,
  buildEmailLink,
  buildSmsLink,
} from '../data/refugeeCamps';

export const RefugeeCampVolunteerDirectory: React.FC = () => {
  const {
    refugeeCamps,
    openVolunteerModal,
    wallet,
    userLocation,
  } = useImpact();

  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Metrics
  const totalDisplaced = refugeeCamps.reduce((acc, c) => acc + c.activeRefugeesCount, 0);
  const totalCapacity = refugeeCamps.reduce((acc, c) => acc + c.capacityMax, 0);
  const totalRolesNeeded = refugeeCamps.reduce((acc, c) => acc + c.rolesNeeded.length, 0);
  const userRegistrations = wallet.volunteerRegistrations || [];

  const filteredCamps = refugeeCamps.filter((camp) => {
    if (selectedStateFilter !== 'all') {
      if (!camp.stateOrRegion.toLowerCase().includes(selectedStateFilter.toLowerCase())) {
        return false;
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = camp.campName.toLowerCase().includes(q);
      const matchDisaster = camp.disasterName.toLowerCase().includes(q);
      const matchLoc = camp.location.toLowerCase().includes(q);
      const matchRoles = camp.rolesNeeded.some((r) => r.role.toLowerCase().includes(q));
      return matchName || matchDisaster || matchLoc || matchRoles;
    }
    return true;
  });

  const handleDirectQuickDispatch = (camp: RefugeeCamp, channel: 'whatsapp' | 'email' | 'sms') => {
    // Open full registration modal with camp selected for complete data and point award
    openVolunteerModal(camp);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 text-white p-6 sm:p-8 overflow-hidden shadow-xl border border-emerald-800/40">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500 text-emerald-950 shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-950 animate-ping"></span>
              Civic Disaster Volunteer Registry
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-xs text-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Direct Coordinator Hotline (WhatsApp / Mail / SMS)
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Refugee Camp Support & Disaster Volunteer Intake
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-2xl">
            When flash floods, landslides, or cyclonic surges strike, local refugee transit shelters require urgent
            assistance. Enlist into the disaster relief community by sending an immediate registration via{' '}
            <strong>WhatsApp</strong>, <strong>Mail</strong>, or <strong>SMS</strong> to camp commanders.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => openVolunteerModal(null)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold bg-white text-emerald-950 hover:bg-emerald-50 shadow-lg shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <HeartHandshake className="w-4 h-4 text-emerald-600" />
              <span>Register for Refugee Camp Volunteering (+150 pts)</span>
            </button>
          </div>
        </div>

        {/* Global Impact Summary Counter */}
        <div className="mt-8 pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center sm:text-left">
          <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-emerald-300">
              Displaced Citizens Sheltered
            </span>
            <span className="text-xl sm:text-2xl font-black text-white tabular-nums">
              {totalDisplaced.toLocaleString()} Souls
            </span>
          </div>

          <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-emerald-300">
              Active Refugee Camps
            </span>
            <span className="text-xl sm:text-2xl font-black text-amber-300 tabular-nums">
              {refugeeCamps.length} Centers
            </span>
          </div>

          <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-emerald-300">
              Critical Volunteer Roles
            </span>
            <span className="text-xl sm:text-2xl font-black text-rose-300 tabular-nums">
              {totalRolesNeeded} Open Shifts
            </span>
          </div>

          <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-emerald-300">
              Intake Response Time
            </span>
            <span className="text-xl sm:text-2xl font-black text-teal-300">
              &lt; 15 Mins
            </span>
          </div>
        </div>
      </div>

      {/* User's Active Volunteer Passes (If registered) */}
      {userRegistrations.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-300 dark:border-emerald-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                Your Active Disaster Volunteer Pass
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-600 text-white">
              {userRegistrations[0].volunteerPassId}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Volunteer</span>
              <strong className="text-slate-900 dark:text-white text-sm">{userRegistrations[0].fullName}</strong>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block">
                Blood Group: {userRegistrations[0].bloodGroup}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Deployed Camp</span>
              <strong className="text-slate-900 dark:text-white truncate block">{userRegistrations[0].campName}</strong>
              <span className="text-[11px] text-slate-500 block capitalize">
                Availability: {userRegistrations[0].availability.replace('_', ' ')}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Status</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Civilian Standby
                </span>
              </div>
              <button
                onClick={() => openVolunteerModal(null)}
                className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                View Pass ID
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search refugee camps, districts, skills, or disaster relief causes..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Region Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Regions 🌍' },
            { id: 'kerala', label: 'Kerala 🌴' },
            { id: 'tamil nadu', label: 'Tamil Nadu 🌊' },
            { id: 'uttarakhand', label: 'Uttarakhand 🏔️' },
          ].map((scope) => (
            <button
              key={scope.id}
              onClick={() => setSelectedStateFilter(scope.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedStateFilter === scope.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {scope.label}
            </button>
          ))}
        </div>
      </div>

      {/* Refugee Camps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCamps.map((camp) => {
          const occupancyPercent = Math.min(100, Math.round((camp.activeRefugeesCount / camp.capacityMax) * 100));

          return (
            <div
              key={camp.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-400/50 dark:hover:border-emerald-500/50 transition-all flex flex-col justify-between"
            >
              {/* Card Header */}
              <div className="p-5 sm:p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                        🚨 {camp.disasterType} Crisis
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        {camp.status}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-lg text-slate-900 dark:text-white leading-snug">
                      {camp.campName}
                    </h3>
                  </div>
                </div>

                {/* Location & Disaster */}
                <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>{camp.location}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 pl-5">
                    Trigger Event: <strong>{camp.disasterName}</strong>
                  </div>
                </div>

                {/* Occupancy Bar */}
                <div className="space-y-1.5 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{camp.activeRefugeesCount} Displaced People Sheltered</span>
                    </span>
                    <span className="text-slate-500 font-mono text-[11px]">
                      {occupancyPercent}% (Cap: {camp.capacityMax})
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        occupancyPercent > 80 ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${occupancyPercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Urgent Roles Needed */}
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Urgent Volunteer Roles Needed:
                  </span>
                  <div className="space-y-1.5">
                    {camp.rolesNeeded.map((r, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-2"
                      >
                        <div>
                          <strong className="text-slate-900 dark:text-white block font-bold">
                            {r.role}
                          </strong>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                            {r.description}
                          </span>
                        </div>
                        <span className="shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                          {r.countNeeded}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Coordinator Info */}
                <div className="text-[11px] text-slate-600 dark:text-slate-300 pt-1 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span>
                    Coordinator: <strong>{camp.coordinator.name}</strong> ({camp.coordinator.designation.split('&')[0]})
                  </span>
                  <span className="text-[10px] text-slate-400">{camp.lastUpdated}</span>
                </div>
              </div>

              {/* Action Buttons: 3 Instant Dispatch Channels + Full Form */}
              <div className="p-5 sm:p-6 pt-0 space-y-2">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Register Into Community via Direct Channels:
                </span>

                <div className="grid grid-cols-3 gap-2">
                  {/* WhatsApp Quick */}
                  <button
                    type="button"
                    onClick={() => handleDirectQuickDispatch(camp, 'whatsapp')}
                    className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 transition-colors"
                    title={`Send registration via WhatsApp to ${camp.coordinator.whatsappNumber}`}
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </button>

                  {/* Mail Quick */}
                  <button
                    type="button"
                    onClick={() => handleDirectQuickDispatch(camp, 'email')}
                    className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-800 transition-colors"
                    title={`Send registration via Email to ${camp.coordinator.email}`}
                  >
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    <span>Mail</span>
                  </button>

                  {/* SMS Quick */}
                  <button
                    type="button"
                    onClick={() => handleDirectQuickDispatch(camp, 'sms')}
                    className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-800 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-800 transition-colors"
                    title={`Send registration via SMS to ${camp.coordinator.phone}`}
                  >
                    <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
                    <span>SMS</span>
                  </button>
                </div>

                {/* Primary Button */}
                <button
                  type="button"
                  onClick={() => openVolunteerModal(camp)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                  <HeartHandshake className="w-4 h-4" />
                  <span>Enlist in this Camp's Volunteer Roster (+150 pts)</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
