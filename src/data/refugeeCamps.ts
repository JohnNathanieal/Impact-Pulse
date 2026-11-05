import { RefugeeCamp, VolunteerRegistration } from '../types/impact';

export const REFUGEE_CAMPS: RefugeeCamp[] = [
  {
    id: 'camp-wayanad-01',
    campName: 'Meppadi - Chooralmala Landslide Refugee Relief Camp #1',
    disasterName: 'Wayanad Hill Disruption & Landslide Crisis',
    disasterType: 'Landslide',
    location: 'St. Joseph Higher Secondary School Grounds, Meppadi, Wayanad',
    stateOrRegion: 'Wayanad, Kerala',
    coordinates: { lat: 11.5518, lng: 76.1264 },
    activeRefugeesCount: 520,
    capacityMax: 700,
    coordinator: {
      name: 'Dr. Sreeraj Kurup',
      designation: 'District Disaster Response Medical Liaison & Camp Commander',
      phone: '+919447012345',
      whatsappNumber: '+919447012345',
      email: 'wayanad.reliefdesk@kerala.gov.in',
    },
    rolesNeeded: [
      {
        role: 'Community Kitchen & Meal Packaging',
        countNeeded: '14 Volunteers',
        urgency: 'Critical',
        description: 'Prepare hot meals, package 1,500 daily food packets, and distribute water cans.',
      },
      {
        role: 'Paramedic & First Aid Triage Assistant',
        countNeeded: '6 Volunteers',
        urgency: 'Critical',
        description: 'Support doctors in dispensing dressing, blood pressure checks, and prescription sorting.',
      },
      {
        role: 'Child & Psychosocial Trauma Care',
        countNeeded: '8 Volunteers',
        urgency: 'Immediate',
        description: 'Conduct storytelling, safe-space games, and comfort activities for displaced children.',
      },
      {
        role: 'Ration Warehouse & Kit Sorting',
        countNeeded: '10 Volunteers',
        urgency: 'High',
        description: 'Unload supply trucks, sort dry rations, blankets, baby kits, and hygiene kits.',
      },
    ],
    facilities: [
      '24/7 Hot Community Kitchen',
      'First Aid Triage Clinic',
      'Child Safe Haven Tent',
      'Separate Elderly Dormitory',
      'Sanitation & Shower Blocks',
      'Solar Generator Charging Station',
    ],
    intakeChannels: {
      whatsapp: '+919447012345',
      email: 'wayanad.reliefdesk@kerala.gov.in',
      sms: '+919447012345',
    },
    status: 'Critical Intake',
    lastUpdated: 'Updated 18 mins ago by District Control Room',
  },
  {
    id: 'camp-kuttanad-02',
    campName: 'Kuttanad Emergency Monsoon Flood Transit Shelter',
    disasterName: 'Kuttanad Lowland Inundation & Backwater Surge',
    disasterType: 'Flooding',
    location: 'Government Vocational Higher Secondary School, Mankombu, Kuttanad',
    stateOrRegion: 'Alappuzha, Kerala',
    coordinates: { lat: 9.4981, lng: 76.4385 },
    activeRefugeesCount: 380,
    capacityMax: 500,
    coordinator: {
      name: 'Anitha Varma',
      designation: 'Sub-Collectorate Flood Task Force Officer',
      phone: '+919847123456',
      whatsappNumber: '+919847123456',
      email: 'floodrelief.alappuzha@kerala.gov.in',
    },
    rolesNeeded: [
      {
        role: 'Country Boat Transport & Logistics',
        countNeeded: '8 Volunteers (Swimming / Boat Experience)',
        urgency: 'Critical',
        description: 'Navigate small country boats carrying bottled water and food to marooned hamlets.',
      },
      {
        role: 'Drinking Water Chlorine & Hygiene Desk',
        countNeeded: '5 Volunteers',
        urgency: 'Immediate',
        description: 'Distribute ORS packets, chlorine water purification tablets, and mosquito repellents.',
      },
      {
        role: 'Senior Citizen Mobility & Wheelchair Aid',
        countNeeded: '6 Volunteers',
        urgency: 'High',
        description: 'Assist elderly bedridden refugees with movement, medicines, and sanitary care.',
      },
    ],
    facilities: [
      'Elevated Dry Ground Shelter',
      'Water RO Filtration Unit',
      'Emergency Solar Battery Banks',
      'Boat Rescue Docking Point',
      'Medical Dispensary',
    ],
    intakeChannels: {
      whatsapp: '+919847123456',
      email: 'floodrelief.alappuzha@kerala.gov.in',
      sms: '+919847123456',
    },
    status: 'Active Intake',
    lastUpdated: 'Updated 45 mins ago by Alappuzha Disaster Cell',
  },
  {
    id: 'camp-ranni-03',
    campName: 'Pamba Valley Flash Flood Emergency Refuge Center',
    disasterName: 'Pamba River Flash Overtopping & Bridge Damage',
    disasterType: 'Flooding',
    location: 'Ranni Community Parish Auditorium & Sports Pavilion, Pathanamthitta',
    stateOrRegion: 'Pathanamthitta, Kerala',
    coordinates: { lat: 9.3806, lng: 76.7869 },
    activeRefugeesCount: 290,
    capacityMax: 450,
    coordinator: {
      name: 'Mathew George',
      designation: 'Volunteer Brigade Chief & Emergency Relief Convener',
      phone: '+919495234567',
      whatsappNumber: '+919495234567',
      email: 'ranni.shelter@kerala.gov.in',
    },
    rolesNeeded: [
      {
        role: 'Sanitation & Portable Toilet Setup',
        countNeeded: '6 Volunteers',
        urgency: 'Immediate',
        description: 'Maintain hygiene standards, spray disinfectant, and prevent waterborne disease outbreak.',
      },
      {
        role: 'Night Watch & Security Roster',
        countNeeded: '8 Volunteers',
        urgency: 'High',
        description: 'Coordinate overnight check-ins, lighting surveillance, and emergency call lines.',
      },
      {
        role: 'Clothing & Blanket Distribution',
        countNeeded: '5 Volunteers',
        urgency: 'High',
        description: 'Sort freshly laundered clothes and dry sleep mats by age and family size.',
      },
    ],
    facilities: [
      'Covered Main Hall',
      'Medical First Contact Post',
      'Community Dining Facility',
      'Dedicated Women & Infant Area',
    ],
    intakeChannels: {
      whatsapp: '+919495234567',
      email: 'ranni.shelter@kerala.gov.in',
      sms: '+919495234567',
    },
    status: 'Active Intake',
    lastUpdated: 'Updated 1 hour ago',
  },
  {
    id: 'camp-chennai-04',
    campName: 'Chennai Coastal Cyclone Evacuation Center #3',
    disasterName: 'Bay of Bengal Cyclonic Storm Surge & Urban Flooding',
    disasterType: 'Cyclone',
    location: 'Corporation Community Relief Hall, Velachery Bypass, Chennai',
    stateOrRegion: 'Chennai, Tamil Nadu',
    coordinates: { lat: 12.9815, lng: 80.218 },
    activeRefugeesCount: 640,
    capacityMax: 800,
    coordinator: {
      name: 'K. Ramanathan, IAS (Retd)',
      designation: 'State Disaster Response Volunteer Bureau Lead',
      phone: '+919444123890',
      whatsappNumber: '+919444123890',
      email: 'chennai.cycloneaid@tn.gov.in',
    },
    rolesNeeded: [
      {
        role: 'Urban Debris Clearance & Pumping Support',
        countNeeded: '20 Volunteers',
        urgency: 'Critical',
        description: 'Help emergency services operate dewatering pumps and clear fallen tree branches.',
      },
      {
        role: 'Cooked Food Logistics & Dispatch',
        countNeeded: '15 Volunteers',
        urgency: 'Critical',
        description: 'Receive hot food containers and serve hot meals to 600+ sheltered citizens.',
      },
      {
        role: 'Family Registration & Help Desk',
        countNeeded: '8 Volunteers (Tamil / English)',
        urgency: 'Immediate',
        description: 'Log missing family enquiries, tag relief cards, and coordinate welfare tokens.',
      },
    ],
    facilities: [
      'Large High-Ceiling Hall',
      'Heavy-duty Backup Diesel Generators',
      'Doctor On Duty 24/7',
      'Safe Drinking Water Station',
      'Child Recreation Room',
    ],
    intakeChannels: {
      whatsapp: '+919444123890',
      email: 'chennai.cycloneaid@tn.gov.in',
      sms: '+919444123890',
    },
    status: 'Critical Intake',
    lastUpdated: 'Updated 30 mins ago',
  },
  {
    id: 'camp-chamoli-05',
    campName: 'Chamoli Cloudburst & Mountain Flash Flood Relief Base',
    disasterName: 'Himalayan Torrential Cloudburst & River Swell',
    disasterType: 'Flooding',
    location: 'Joshimath Central Sports Complex & Transit Pavilion',
    stateOrRegion: 'Chamoli, Uttarakhand',
    coordinates: { lat: 30.5564, lng: 79.5683 },
    activeRefugeesCount: 410,
    capacityMax: 600,
    coordinator: {
      name: 'Major (Retd.) Rajesh Rawat',
      designation: 'Mountain Rescue Liaison & Civilian Volunteer Chief',
      phone: '+919811234567',
      whatsappNumber: '+919811234567',
      email: 'chamoli.reliefdesk@uk.gov.in',
    },
    rolesNeeded: [
      {
        role: 'Thermal Winter Gear & Tent Rigging',
        countNeeded: '12 Volunteers',
        urgency: 'Critical',
        description: 'Erect insulated waterproof tents, distribute down jackets and thermal sleeping pads.',
      },
      {
        role: 'Mountain Trail Porter & Rucksack Supply',
        countNeeded: '10 Volunteers (Physically fit)',
        urgency: 'Immediate',
        description: 'Carry light emergency medical packs up disrupted pedestrian paths.',
      },
      {
        role: 'Emergency Radio & Satellite Messenger Operator',
        countNeeded: '4 Volunteers',
        urgency: 'High',
        description: 'Manage VHF ham radio updates between isolated ridge hamlets and base camp.',
      },
    ],
    facilities: [
      'Indoor Heated Gymnasium',
      'Helipad Transfer Access Point',
      'Army Paramedic Wing',
      'Warm Soup & Kitchari Kitchen',
    ],
    intakeChannels: {
      whatsapp: '+919811234567',
      email: 'chamoli.reliefdesk@uk.gov.in',
      sms: '+919811234567',
    },
    status: 'Active Intake',
    lastUpdated: 'Updated 2 hours ago',
  },
];

export const VOLUNTEER_ROLE_OPTIONS = [
  'Community Kitchen & Food Packaging',
  'First Aid & Paramedic Assistance',
  'Child Care & Safe Space Support',
  'Senior Citizen Mobility & Care',
  'Ration Sorting & Warehouse Logistics',
  'Sanitation, Bio-Toilets & Disinfection',
  'Drinking Water & Chlorine Tablet Delivery',
  'Rescue & Vehicle / Boat Transportation',
  'Help Desk, Intake & Language Translation',
  'Electrician, Solar & Generator Maintenance',
];

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

/**
 * Builds formatted text payload for registration
 */
export function buildVolunteerPayloadText(
  camp: RefugeeCamp | null,
  reg: {
    fullName: string;
    phone: string;
    whatsappNumber: string;
    email: string;
    city: string;
    roles: string[];
    bloodGroup: string;
    availability: string;
    transportSupport: boolean;
    passId: string;
  }
): string {
  const campName = camp ? camp.campName : 'Any Disaster Camp in Critical Need';
  const rolesList = reg.roles.length > 0 ? reg.roles.join(', ') : 'General Emergency Volunteer';
  const availMap: Record<string, string> = {
    immediate_24h: 'Immediate Deployment (Within 24 Hours)',
    weekends: 'Weekends Roster (Sat/Sun)',
    on_call_standby: 'On-Call Emergency Standby',
    flexible: 'Flexible Schedule',
  };

  return `🚨 *DISASTER RELIEF & REFUGEE CAMP VOLUNTEER REGISTRATION* 🚨

👤 *Volunteer Name:* ${reg.fullName}
📞 *Phone:* ${reg.phone}
💬 *WhatsApp:* ${reg.whatsappNumber || reg.phone}
✉️ *Email:* ${reg.email || 'Not provided'}
🩸 *Blood Group:* ${reg.bloodGroup || 'Not specified'}
📍 *Home City / District:* ${reg.city}

🏕️ *Target Refugee Camp:* ${campName}
🛠️ *Selected Volunteer Skills / Roles:*
${reg.roles.map((r) => `  • ${r}`).join('\n')}

⏱️ *Availability:* ${availMap[reg.availability] || reg.availability}
🚗 *Vehicle / Transport Available:* ${reg.transportSupport ? 'Yes (Can assist with mobility)' : 'No (Public / relief transit required)'}

🆔 *Official Volunteer Digital Pass ID:* ${reg.passId}
📅 *Timestamp:* ${new Date().toLocaleString()}

I hereby confirm my willingness to volunteer for disaster relief and humanitarian camp operations under civilian command. Please acknowledge my intake and assign deployment shift.`;
}

/**
 * Builds direct WhatsApp URL
 */
export function buildWhatsAppLink(
  phoneNumber: string,
  camp: RefugeeCamp | null,
  reg: {
    fullName: string;
    phone: string;
    whatsappNumber: string;
    email: string;
    city: string;
    roles: string[];
    bloodGroup: string;
    availability: string;
    transportSupport: boolean;
    passId: string;
  }
): string {
  const cleanedPhone = phoneNumber.replace(/[^0-9]/g, '');
  const text = buildVolunteerPayloadText(camp, reg);
  return `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * Builds mailto: URL for Email client
 */
export function buildEmailLink(
  emailRecipient: string,
  camp: RefugeeCamp | null,
  reg: {
    fullName: string;
    phone: string;
    whatsappNumber: string;
    email: string;
    city: string;
    roles: string[];
    bloodGroup: string;
    availability: string;
    transportSupport: boolean;
    passId: string;
  }
): string {
  const campName = camp ? camp.campName : 'Emergency Refugee Camps';
  const subject = `Disaster Volunteer Registration: ${reg.fullName} - ${campName} [${reg.passId}]`;
  const body = buildVolunteerPayloadText(camp, reg);
  return `mailto:${emailRecipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Builds sms: URL for standard phone messaging
 */
export function buildSmsLink(
  phoneNumber: string,
  camp: RefugeeCamp | null,
  reg: {
    fullName: string;
    phone: string;
    whatsappNumber: string;
    email: string;
    city: string;
    roles: string[];
    bloodGroup: string;
    availability: string;
    transportSupport: boolean;
    passId: string;
  }
): string {
  const cleanedPhone = phoneNumber.replace(/[^0-9+]/g, '');
  const campName = camp ? camp.campName : 'Emergency Camp';
  // Concise SMS message body to avoid SMS length fragmentation while keeping critical data
  const smsBody = `DISASTER VOLUNTEER REGISTRATION
Name: ${reg.fullName}
Phone: ${reg.phone}
Blood: ${reg.bloodGroup || 'N/A'}
City: ${reg.city}
Camp: ${campName}
Roles: ${reg.roles.slice(0, 2).join(', ')}
Pass ID: ${reg.passId}
Ready for deployment.`;

  return `sms:${cleanedPhone}?body=${encodeURIComponent(smsBody)}`;
}
