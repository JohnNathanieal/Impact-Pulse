import { PanchayathContact } from '../types/impact';

export const PANCHAYATH_DIRECTORY: Record<string, PanchayathContact> = {
  kuranchery: {
    panchayathName: 'Wadakkanchery Grama Panchayath',
    wardNumber: 'Ward 12 (Kuranchery)',
    wardMemberName: 'Smt. Bindu Rajesh',
    wardMemberPhone: '+91 94472 81920',
    presidentName: 'Sri. P.K. Radhakrishnan',
    presidentPhone: '+91 98470 12345',
    secretaryName: 'Sri. Mathew John, LSGD',
    secretaryPhone: '+91 94471 67890',
    officeLandline: '04884-232240',
    officeEmail: 'wadakkancherygp.lsgd@kerala.gov.in',
    officeAddress: 'Grama Panchayath Office, Main Road, Wadakkanchery, Thrissur - 680582',
  },
  cherpu: {
    panchayathName: 'Cherpu Grama Panchayath',
    wardNumber: 'Ward 7 (Arattupuzha Bridge & Riverbank)',
    wardMemberName: 'Sri. V.R. Muralidharan',
    wardMemberPhone: '+91 94463 45678',
    presidentName: 'Smt. Sujatha Mohan',
    presidentPhone: '+91 98472 34567',
    secretaryName: 'Smt. K. Mini, LSGD',
    secretaryPhone: '+91 94475 11223',
    officeLandline: '0487-2342231',
    officeEmail: 'cherpugp.lsgd@kerala.gov.in',
    officeAddress: 'Cherpu Grama Panchayath Bhavan, Cherpu PO, Thrissur - 680561',
  },
  meppadi: {
    panchayathName: 'Meppadi Grama Panchayath',
    wardNumber: 'Ward 10 (Chooralmala & Mundakkai Disaster Zone)',
    wardMemberName: 'Sri. K. Babu',
    wardMemberPhone: '+91 94470 99881',
    presidentName: 'Sri. K. Raju',
    presidentPhone: '+91 94470 12345',
    secretaryName: 'Sri. Shaji Thomas, LSGD',
    secretaryPhone: '+91 94471 22334',
    officeLandline: '04936-282230',
    officeEmail: 'meppadigp.lsgd@kerala.gov.in',
    officeAddress: 'Meppadi Grama Panchayath Office, Ooty Road, Meppadi, Wayanad - 673577',
  },
  nedumudi: {
    panchayathName: 'Nedumudi Grama Panchayath',
    wardNumber: 'Ward 4 (Mankombu & Champakulam)',
    wardMemberName: 'Smt. Jollyamma Joseph',
    wardMemberPhone: '+91 94473 12390',
    presidentName: 'Sri. V.C. Varghese',
    presidentPhone: '+91 98471 88990',
    secretaryName: 'Sri. Sunil Kumar, LSGD',
    secretaryPhone: '+91 94472 33445',
    officeLandline: '0477-2762240',
    officeEmail: 'nedumudigp.lsgd@kerala.gov.in',
    officeAddress: 'Nedumudi Grama Panchayath, Moncombu PO, Kuttanad, Alappuzha - 688503',
  },
  ranni: {
    panchayathName: 'Ranni-Perunad Grama Panchayath',
    wardNumber: 'Ward 6 (Pamba Valley)',
    wardMemberName: 'Sri. Biju Abraham',
    wardMemberPhone: '+91 94951 88220',
    presidentName: 'Smt. Latha Madhusoodanan',
    presidentPhone: '+91 94952 34567',
    secretaryName: 'Sri. Rajan Pillai, LSGD',
    secretaryPhone: '+91 94470 44556',
    officeLandline: '04735-226233',
    officeEmail: 'ranniperunadgp.lsgd@kerala.gov.in',
    officeAddress: 'Grama Panchayath Office, Perunad PO, Pathanamthitta - 689711',
  },
  aluva: {
    panchayathName: 'Choornikkara Grama Panchayath',
    wardNumber: 'Ward 9 (Periyar Riverbank & Container Corridor)',
    wardMemberName: 'Sri. K.A. Shaji',
    wardMemberPhone: '+91 94476 54321',
    presidentName: 'Smt. Raji Santhosh',
    presidentPhone: '+91 98473 45678',
    secretaryName: 'Sri. M.K. Pradeep, LSGD',
    secretaryPhone: '+91 94474 88990',
    officeLandline: '0484-2622421',
    officeEmail: 'choornikkaragp.lsgd@kerala.gov.in',
    officeAddress: 'Choornikkara Grama Panchayath Office, Thayikkattukara, Aluva, Ernakulam - 683106',
  },
  general: {
    panchayathName: 'Local Grama Panchayath Civic Administration Desk',
    wardNumber: 'Ward Local Representative',
    wardMemberName: 'Civic Ward Councillor / Member',
    wardMemberPhone: '+91 94470 00000',
    presidentName: 'Panchayath President',
    presidentPhone: '+91 98470 00000',
    secretaryName: 'Secretary, Local Self Government Dept (LSGD)',
    secretaryPhone: '+91 94471 00000',
    officeLandline: '0487-2362424',
    officeEmail: 'panchayath.helpdesk@lsgd.kerala.gov.in',
    officeAddress: 'Grama Panchayath Bhavan & Civic Public Grievance Cell',
  },
};

export function getPanchayathContact(locationOrHeadline: string): PanchayathContact {
  const text = locationOrHeadline.toLowerCase();
  if (text.includes('wadakkanchery') || text.includes('kuranchery') || text.includes('canal')) {
    return PANCHAYATH_DIRECTORY.kuranchery;
  }
  if (text.includes('cherpu') || text.includes('arattupuzha')) {
    return PANCHAYATH_DIRECTORY.cherpu;
  }
  if (text.includes('wayanad') || text.includes('chooralmala') || text.includes('meppadi') || text.includes('landslide')) {
    return PANCHAYATH_DIRECTORY.meppadi;
  }
  if (text.includes('kuttanad') || text.includes('nedumudi') || text.includes('alappuzha') || text.includes('flood')) {
    return PANCHAYATH_DIRECTORY.nedumudi;
  }
  if (text.includes('ranni') || text.includes('pathanamthitta') || text.includes('pamba')) {
    return PANCHAYATH_DIRECTORY.ranni;
  }
  if (text.includes('aluva') || text.includes('periyar') || text.includes('ernakulam') || text.includes('kochi')) {
    return PANCHAYATH_DIRECTORY.aluva;
  }
  return PANCHAYATH_DIRECTORY.general;
}
