export type IssueCategory =
  | 'all'
  | 'environmental'
  | 'civic_safety'
  | 'community_support'
  | 'health_alert'
  | 'disaster_relief'
  | 'animal_welfare'
  | 'education_youth'
  | 'senior_care'
  | 'urban_infra';

export type UrgencyLevel = 'Urgent' | 'High' | 'Moderate';

export interface RefugeeCampCoordinator {
  name: string;
  designation: string;
  phone: string;
  email: string;
  whatsappNumber: string;
}

export interface RefugeeCampRoleRequirement {
  role: string;
  countNeeded: string;
  urgency: 'Critical' | 'Immediate' | 'High';
  description: string;
}

export interface RefugeeCamp {
  id: string;
  campName: string;
  disasterName: string;
  disasterType: 'Landslide' | 'Flooding' | 'Cyclone' | 'Industrial Spill' | 'Earthquake' | 'Fire';
  location: string;
  stateOrRegion: string;
  coordinates: LocationCoordinates;
  activeRefugeesCount: number;
  capacityMax: number;
  coordinator: RefugeeCampCoordinator;
  rolesNeeded: RefugeeCampRoleRequirement[];
  facilities: string[];
  intakeChannels: {
    whatsapp: string;
    email: string;
    sms: string;
  };
  status: 'Critical Intake' | 'Active Intake' | 'Standby';
  lastUpdated: string;
}

export interface VolunteerRegistration {
  id: string;
  fullName: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  city: string;
  campId: string;
  campName: string;
  roles: string[];
  bloodGroup: string;
  availability: 'immediate_24h' | 'weekends' | 'on_call_standby' | 'flexible';
  transportSupport: boolean;
  registeredAt: string;
  channelUsed: 'whatsapp' | 'email' | 'sms' | 'direct_portal';
  volunteerPassId: string;
  verified: boolean;
}

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface CityPreset {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
}

export interface EmergencyContact {
  label: string;
  phone: string;
  actionNote: string;
}

export interface HelpYourselfPlan {
  title: string;
  summary: string;
  checklist: { id: string; text: string; category: string }[];
  emergencyContacts: EmergencyContact[];
}

export interface CommunityPetition {
  id: string;
  title: string;
  department: string;
  currentSignatures: number;
  targetSignatures: number;
  statement: string;
}

export interface VolunteerPledge {
  id: string;
  title: string;
  description: string;
  pledgeOptions: string[];
}

export interface PanchayathContact {
  panchayathName: string;
  wardNumber: string | number;
  wardMemberName: string;
  wardMemberPhone: string;
  presidentName: string;
  presidentPhone: string;
  secretaryName: string;
  secretaryPhone: string;
  officeLandline: string;
  officeEmail: string;
  officeAddress: string;
}

export interface VerifiedHotline {
  title: string;
  number: string;
  whatsappMessage: string;
  description: string;
}

export interface HelpCommunityPlan {
  petition?: CommunityPetition;
  volunteerPledge?: VolunteerPledge;
  verifiedHotline?: VerifiedHotline;
  panchayathContact?: PanchayathContact;
  civicReportTip?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface DistressBeneficiary {
  name: string;
  relationOrRole: string;
  affectedCount: number;
  location: string;
  verifiedBy: string;
  urgencyReason: string;
}

export interface FundCollectorDetails {
  leadCollectorName: string;
  collectorRole: string;
  organizationName: string;
  registrationNumber: string;
  deskLocation: string;
  phone: string;
  email: string;
  auditEntity: string;
  howFundsAreSent: string[];
  disbursementTimeline: string;
  directBeneficiaryRatio: string;
  proofDocumentsAvailable: string[];
}

export interface DistressDonationRecord {
  id: string;
  storyId: string;
  headline: string;
  beneficiaryName: string;
  donorName: string;
  amount: number;
  currency: string;
  upiRefOrTxn: string;
  timestamp: string;
  pointsEarned: number;
  paymentMethod: 'upi_qr' | 'gpay' | 'phonepe' | 'paytm' | 'card_netbanking';
  note?: string;
}

export interface ItemDonationRecord {
  id: string;
  storyId: string;
  headline: string;
  siteName: string;
  donorName: string;
  donorPhone: string;
  items: { itemName: string; quantity: string }[];
  deliveryMethod: 'self_dropoff' | 'volunteer_pickup';
  pickupAddress?: string;
  collectionDeskAddress: string;
  deskPhone: string;
  tokenNumber: string;
  timestamp: string;
  pointsEarned: number;
}

export interface DistressReliefCampaign {
  id: string;
  title: string;
  beneficiary: DistressBeneficiary;
  upiId: string;
  recipientName: string;
  targetAmount: number;
  raisedAmount: number;
  donorCount: number;
  emergencyNeeds: string[];
  bankDetails?: {
    accountNumber: string;
    ifsc: string;
    bankName: string;
    branch?: string;
  };
  collectorDetails?: FundCollectorDetails;
  panchayathContact?: PanchayathContact;
  qrCodeImageUrl?: string;
  verifiedStatus: 'Verified Official' | 'Civic Verified' | 'Emergency Appeal';
  recentDonations?: { donorName: string; amount: number; timeAgo: string }[];
}

export type GeographicScope = 'all' | 'world' | 'india' | 'kerala';

export type NewsSourcePlatform =
  | 'all'
  | 'Times of India'
  | 'Mathrubhumi'
  | 'Hindustan Times'
  | 'News 24'
  | 'BBC World'
  | 'Reuters'
  | 'Al Jazeera'
  | 'Regional Press';

export interface StoryAnalytics {
  viewsCount: number;
  donationsCount: number;
  totalDonationAmount: number;
  quizCompletionsCount: number;
  actionVerificationsCount: number;
  pointsRedeemedCount: number;
  weeklyViews: number;
  monthlyViews: number;
  isWeeksTopViewed?: boolean;
  isMonthsTopViewed?: boolean;
}

export interface NewsStory {
  id: string;
  headline: string;
  category: IssueCategory;
  urgency: UrgencyLevel;
  geographicScope?: 'world' | 'india' | 'kerala';
  countryOrRegion?: string;
  locationName: string;
  coordinates: LocationCoordinates;
  summary: string;
  fullContent: string[];
  sourceAgency: string;
  sourcePlatform?: string;
  articleUrl?: string;
  timestamp: string;
  readingTimeMinutes: number;
  pointsReward: number;
  imageUrl: string;
  publisherPhotoUrl?: string;
  channelPhotoVerified?: boolean;
  thumbnailSource?: 'extracted_media' | 'platform_og' | 'publisher_feed' | 'verified_asset' | 'exact_channel_photo';
  isLiveCollected?: boolean;
  helpYourself: HelpYourselfPlan;
  helpCommunity: HelpCommunityPlan;
  panchayathContact?: PanchayathContact;
  quiz: QuizQuestion[];
  geofenceRadiusKm: number;
  distressFund?: DistressReliefCampaign;
  analytics?: StoryAnalytics;
}

export interface Voucher {
  id: string;
  title: string;
  brand: string;
  category: 'shopping' | 'food' | 'entertainment' | 'transit' | 'eco_charity';
  pointsCost: number;
  valueDisplay: string;
  description: string;
  partnerInfo: string;
  logoColor: string;
  badgeTag: string;
}

export interface RedeemedVoucher {
  id: string;
  voucherId: string;
  title: string;
  brand: string;
  pointsSpent: number;
  valueDisplay: string;
  code: string;
  redeemedAt: string;
  expiryDate: string;
}

export interface ClaimHistoryItem {
  articleId: string;
  articleHeadline: string;
  category: IssueCategory;
  pointsEarned: number;
  claimedAt: string;
  completedTasks: string[];
}

export interface WalletState {
  points: number;
  claimedArticleIds: string[];
  claimHistory: ClaimHistoryItem[];
  redeemedVouchers: RedeemedVoucher[];
  dailyPointsDate: string;
  dailyPointsEarned: number;
  signedPetitionIds: string[];
  volunteerPledges: { storyId: string; optionSelected: string; timestamp: string }[];
  donations: DistressDonationRecord[];
  volunteerRegistrations?: VolunteerRegistration[];
  itemDonations?: ItemDonationRecord[];
}

