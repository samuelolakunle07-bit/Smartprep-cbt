import { JambCourseRequirement } from '../types';

export const JAMB_BROCHURE_DISCLAIMER =
  'IMPORTANT ADMISSION NOTICE: While these UTME subject combinations are based on standard Joint Admissions and Matriculation Board (JAMB) IBASS Brochure guidelines, specific Nigerian federal, state, and private universities may impose unique faculty requirements or special waivers. Always verify your chosen course and subject combination directly against the current official JAMB e-Brochure and the admission brochure of your target tertiary institution.';

export const JAMB_COURSE_REQUIREMENTS: JambCourseRequirement[] = [
  // ================= MEDICAL & PHARMACEUTICAL SCIENCES =================
  {
    id: 'medicine_surgery',
    faculty: 'Medical & Pharmaceutical Sciences',
    courseName: 'Medicine and Surgery (MBBS)',
    compulsorySubject: 'English Language',
    otherThreeSubjects: ['Biology', 'Chemistry', 'Physics'],
    institutionRequirementsNotice:
      'Most Nigerian Universities require English Language, Biology, Chemistry, and Physics. No alternative is acceptable for MBBS in JAMB UTME.',
  },
  {
    id: 'nursing_science',
    faculty: 'Medical & Pharmaceutical Sciences',
    courseName: 'Nursing Science (B.N.Sc)',
    compulsorySubject: 'English Language',
    otherThreeSubjects: ['Biology', 'Chemistry', 'Physics'],
    institutionRequirementsNotice:
      'Compulsory 4-subject combination: English, Biology, Chemistry, and Physics.',
  },
  {
    id: 'pharmacy',
    faculty: 'Medical & Pharmaceutical Sciences',
    courseName: 'Pharmacy (Pharm.D / B.Pharm)',
    compulsorySubject: 'English Language',
    otherThreeSubjects: ['Biology', 'Chemistry', 'Physics'],
    institutionRequirementsNotice:
      'Standard JAMB requirement: Use of English, Biology, Chemistry, and Physics.',
  },
  {
    id: 'medical_lab_science',
    faculty: 'Medical & Pharmaceutical Sciences',
    courseName: 'Medical Laboratory Science (B.MLS)',
    compulsorySubject: 'English Language',
    otherThreeSubjects: ['Biology', 'Chemistry', 'Physics'],
    institutionRequirementsNotice:
      'Requires English, Biology, Chemistry, and Physics.',
  },
  {
    id: 'dentistry',
    faculty: 'Medical & Pharmaceutical Sciences',
    courseName: 'Dentistry & Dental Surgery (BDS)',
    compulsorySubject: 'English Language',
    otherThreeSubjects: ['Biology', 'Chemistry', 'Physics'],
    institutionRequirementsNotice:
      'Standard requirement: English, Biology, Chemistry, Physics.',
  },
  {
    id: 'radiography',
    faculty: 'Medical & Pharmaceutical Sciences',
    courseName: 'Radiography & Radiation Science',
    compulsorySubject: 'English Language',
    otherThreeSubjects: ['Physics', 'Chemistry', 'Biology'],
    institutionRequirementsNotice:
      'Physics and Chemistry are strict; some institutions require Mathematics instead of Biology.',
  },
  {
    id: 'physiotherapy',
    faculty: 'Medical & Pharmaceutical Sciences',
    courseName: 'Physiotherapy / Medical Rehabilitation',
    compulsorySubject: 'English Language',
    otherThreeSubjects: ['Physics', 'Chemistry', 'Biology'],
    institutionRequirementsNotice:
      'English, Biology, Physics, and Chemistry.',
  },

  // ================= ENGINEERING & TECHNOLOGY =================
  {
    id: 'mechanical_eng',
    faculty: 'Engineering & Technology',
    courseName: 'Mechanical Engineering',
    compulsorySubject: 'English Language',
    otherThreeSubjects: ['Mathematics', 'Physics', 'Chemistry'],
    institutionRequirementsNotice:
      'Compulsory combination across all Nigerian universities: English, Mathematics, Physics, and Chemistry.',
  },
  {
    id: 'civil_eng',
    faculty: 'Engineering & Technology',
    courseName: 'Civil Engineering',
    compulsorySubject: 'English Language',
    otherThreeSubjects: ['Mathematics', 'Physics', 'Chemistry'],
    institutionRequirementsNotice:
      'Compulsory combination: English, Mathematics, Physics, and Chemistry.',
  },
  {
    id: 'electrical_electronics_eng',
    faculty: 'Engineering & Technology',
    courseName: 'Electrical / Electronics Engineering',
    compulsorySubject: 'English Language',
    otherThreeSubjects: ['Mathematics', 'Physics', 'Chemistry'],
    institutionRequirementsNotice:
      'Compulsory combination: English, Mathematics, Physics, and Chemistry.',
  },
  {
    id: 'chemical_eng',
    faculty: 'Engineering & Technology',
    courseName: 'Chemical / Petroleum Engineering',
    compulsorySubject: 'English Language',
    otherThreeSubjects: ['Mathematics', 'Chemistry', 'Physics'],
    institutionRequirementsNotice:
      'Chemistry, Mathematics, and Physics with English are strictly mandatory.',
  },
  {
    id: 'computer_engineering',
    faculty: 'Engineering & Technology',
    courseName: 'Computer Engineering',
    compulsorySubject: 'English Language',
    otherThreeSubjects: ['Mathematics', 'Physics', 'Chemistry'],
    institutionRequirementsNotice:
      'English, Mathematics, Physics, and Chemistry.',
  },

  // ================= SCIENCES =================
  {
    id: 'computer_science',
    faculty: 'Sciences',
    courseName: 'Computer Science',
    compulsorySubject: 'English Language',
    otherThreeSubjects: ['Mathematics', 'Physics', 'Chemistry'],
    acceptableAlternatives: ['Biology', 'Economics', 'Geography'],
    institutionRequirementsNotice:
      'English, Mathematics, Physics, and any of Chemistry, Biology, Economics or Geography. Note: Most top federal universities insist on Chemistry.',
  },
  {
    id: 'biochemistry',
    faculty: 'Sciences',
    courseName: 'Biochemistry',
    compulsorySubject: 'English Language',
    otherThreeSubjects: ['Biology', 'Chemistry', 'Physics'],
    acceptableAlternatives: ['Mathematics'],
    institutionRequirementsNotice:
      'English, Biology, Chemistry, and either Physics or Mathematics.',
  },
  {
    id: 'microbiology',
    faculty: 'Sciences',
    courseName: 'Microbiology',
    compulsorySubject: 'English Language',
    otherThreeSubjects: ['Biology', 'Chemistry', 'Physics'],
    institutionRequirementsNotice:
      'English, Biology, Chemistry, and Physics.',
  },

  // ================= LAW =================
  {
    id: 'law',
    faculty: 'Law',
    courseName: 'Civil Law / Common & Islamic Law (LL.B)',
    compulsorySubject: 'English Language',
    otherThreeSubjects: ['Literature-in-English', 'Government', 'Christian Religious Studies'],
    acceptableAlternatives: ['Islamic Religious Studies', 'History', 'Economics'],
    institutionRequirementsNotice:
      'Literature-in-English is strictly compulsory in virtually all Nigerian Universities offering Law, plus any two Arts or Social Science subjects (Government, CRS/IRS, History, Economics).',
  },

  // ================= SOCIAL & MANAGEMENT SCIENCES =================
  {
    id: 'accounting',
    faculty: 'Social & Management Sciences',
    courseName: 'Accounting / Financial Accounting',
    compulsorySubject: 'English Language',
    otherThreeSubjects: ['Mathematics', 'Economics', 'Commerce'],
    acceptableAlternatives: ['Financial Accounting', 'Government'],
    institutionRequirementsNotice:
      'Mathematics and Economics are compulsory in almost all universities, plus Commerce, Financial Accounting, or Government.',
  },
  {
    id: 'economics',
    faculty: 'Social & Management Sciences',
    courseName: 'Economics (B.Sc)',
    compulsorySubject: 'English Language',
    otherThreeSubjects: ['Mathematics', 'Economics', 'Government'],
    acceptableAlternatives: ['Commerce', 'Geography', 'Financial Accounting'],
    institutionRequirementsNotice:
      'Mathematics and Economics are non-negotiable for Economics. The third subject can be Government, Commerce, or Geography.',
  },
  {
    id: 'business_admin',
    faculty: 'Social & Management Sciences',
    courseName: 'Business Administration / Management',
    compulsorySubject: 'English Language',
    otherThreeSubjects: ['Mathematics', 'Economics', 'Commerce'],
    acceptableAlternatives: ['Government'],
    institutionRequirementsNotice:
      'English, Mathematics, Economics, and one of Commerce or Government.',
  },
  {
    id: 'mass_communication',
    faculty: 'Social & Management Sciences',
    courseName: 'Mass Communication / Media Studies',
    compulsorySubject: 'English Language',
    otherThreeSubjects: ['Literature-in-English', 'Government', 'Christian Religious Studies'],
    acceptableAlternatives: ['Islamic Religious Studies', 'Economics', 'History', 'Yoruba/Igbo/Hausa'],
    institutionRequirementsNotice:
      'English, Literature-in-English, and any other two Arts or Social Science subjects.',
  },
  {
    id: 'political_science',
    faculty: 'Social & Management Sciences',
    courseName: 'Political Science',
    compulsorySubject: 'English Language',
    otherThreeSubjects: ['Government', 'Economics', 'Christian Religious Studies'],
    acceptableAlternatives: ['History', 'Literature-in-English', 'Commerce'],
    institutionRequirementsNotice:
      'Government or History is strictly required, plus two other Social Science or Arts subjects.',
  },

  // ================= AGRICULTURE =================
  {
    id: 'agriculture_general',
    faculty: 'Agriculture',
    courseName: 'Agriculture / Agronomy / Crop Science',
    compulsorySubject: 'English Language',
    otherThreeSubjects: ['Chemistry', 'Agricultural Science', 'Biology'],
    acceptableAlternatives: ['Mathematics', 'Physics'],
    institutionRequirementsNotice:
      'Chemistry and Biology/Agricultural Science are mandatory, plus Mathematics or Physics.',
  },

  // ================= EDUCATION =================
  {
    id: 'education_sciences',
    faculty: 'Education',
    courseName: 'Science Education (Edu/Biology, Edu/Chemistry, Edu/Math)',
    compulsorySubject: 'English Language',
    otherThreeSubjects: ['Mathematics', 'Physics', 'Chemistry'],
    acceptableAlternatives: ['Biology'],
    institutionRequirementsNotice:
      'English and the primary teaching science subject (e.g. Biology, Chemistry, or Math) plus any two other science subjects.',
  },
];
