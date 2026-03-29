import { LucideIcon, TrendingUp, Users, CheckCircle2, AlertCircle, BookOpen, GraduationCap, School } from 'lucide-react';

export interface SchoolData {
  id: number;
  udise: string;
  name: string;
  management: string;
  category: string;
  type: string;
  totalStudents: number;
  notAttainTamil: number;
  notAttainEnglish: number;
  notAttainMaths: number;
  attainedBLO: number;
}

export interface CategoryComparison {
  category: string;
  total: number;
  novAttain: number;
  novPercent: number;
  decAttain: number;
  decPercent: number;
  janAttain: number;
  janPercent: number;
  febAttain: number;
  febPercent: number;
}

export const JANUARY_SCHOOL_DATA: SchoolData[] = [
  { id: 32, udise: "33080302003", name: "GHSS, PANNAPPATTI", management: "School Education Department School", category: "Hr.Sec School (VI-XII)", type: "Higher Secondary School", totalStudents: 209, notAttainTamil: 24, notAttainEnglish: 43, notAttainMaths: 27, attainedBLO: 161 },
  { id: 39, udise: "33080302308", name: "GHSS, KANJANAICKENPATTI", management: "School Education Department School", category: "Hr.Sec School (VI-XII)", type: "Higher Secondary School", totalStudents: 204, notAttainTamil: 7, notAttainEnglish: 10, notAttainMaths: 8, attainedBLO: 192 },
  { id: 6, udise: "33080300310", name: "GHSS, K.MORUR", management: "School Education Department School", category: "Hr.Sec School (VI-XII)", type: "Higher Secondary School", totalStudents: 130, notAttainTamil: 10, notAttainEnglish: 12, notAttainMaths: 18, attainedBLO: 110 },
  { id: 11, udise: "33080300607", name: "GHSS, PERIYA VADAGAMPATTI", management: "School Education Department School", category: "Hr.Sec School (VI-XII)", type: "Higher Secondary School", totalStudents: 128, notAttainTamil: 4, notAttainEnglish: 1, notAttainMaths: 2, attainedBLO: 123 },
  { id: 15, udise: "33080300903", name: "GHSS, NADUPATTY", management: "School Education Department School", category: "Hr.Sec School (VI-XII)", type: "Higher Secondary School", totalStudents: 113, notAttainTamil: 8, notAttainEnglish: 16, notAttainMaths: 37, attainedBLO: 70 },
  { id: 31, udise: "33080301902", name: "MODEL SCHOOL, KADAYAMPATTY", management: "School Education Department School", category: "Hr.Sec School (VI-XII)", type: "Higher Secondary School", totalStudents: 97, notAttainTamil: 2, notAttainEnglish: 2, notAttainMaths: 8, attainedBLO: 89 },
  { id: 28, udise: "33080301707", name: "GHS, DEEVATTIPATTI", management: "School Education Department School", category: "High Schools (VI-X)", type: "High School", totalStudents: 91, notAttainTamil: 12, notAttainEnglish: 7, notAttainMaths: 5, attainedBLO: 77 },
  { id: 13, udise: "33080300704", name: "GHS, BOMMIYAMPATTI", management: "School Education Department School", category: "High Schools (VI-X)", type: "High School", totalStudents: 87, notAttainTamil: 3, notAttainEnglish: 6, notAttainMaths: 5, attainedBLO: 80 },
  { id: 35, udise: "33080302203", name: "GHSS, DHARAPURAM", management: "School Education Department School", category: "Hr.Sec School (VI-XII)", type: "Higher Secondary School", totalStudents: 75, notAttainTamil: 13, notAttainEnglish: 18, notAttainMaths: 4, attainedBLO: 53 },
  { id: 36, udise: "33080302204", name: "GGHS, DHARAPURAM", management: "School Education Department School", category: "High Schools (VI-X)", type: "High School", totalStudents: 70, notAttainTamil: 22, notAttainEnglish: 7, notAttainMaths: 7, attainedBLO: 46 },
  { id: 9, udise: "33080300405", name: "K.G.B.V KADAYAMPATTI", management: "Kasturba Gandhi Balika Vidhyalaya (KGBV)", category: "Middle School (I-VIII)", type: "Middle School", totalStudents: 58, notAttainTamil: 16, notAttainEnglish: 21, notAttainMaths: 21, attainedBLO: 29 },
  { id: 16, udise: "33080301001", name: "PUMS, KADAYAMPATTI", management: "School Education Department School", category: "Middle School (I-VIII)", type: "Middle School", totalStudents: 51, notAttainTamil: 1, notAttainEnglish: 3, notAttainMaths: 4, attainedBLO: 46 },
  { id: 27, udise: "33080301604", name: "GHS, MOOKANUR", management: "School Education Department School", category: "High Schools (VI-X)", type: "High School", totalStudents: 48, notAttainTamil: 3, notAttainEnglish: 10, notAttainMaths: 12, attainedBLO: 35 },
  { id: 29, udise: "33080301802", name: "PUMS, POOSARIPATTI", management: "School Education Department School", category: "Middle School (I-VIII)", type: "Middle School", totalStudents: 47, notAttainTamil: 8, notAttainEnglish: 8, notAttainMaths: 19, attainedBLO: 28 },
  { id: 22, udise: "33080301306", name: "GHS, KONGUPATTI", management: "School Education Department School", category: "High Schools (VI-X)", type: "High School", totalStudents: 46, notAttainTamil: 0, notAttainEnglish: 1, notAttainMaths: 2, attainedBLO: 44 },
  { id: 10, udise: "33080300601", name: "PUMS, DANISHPET", management: "School Education Department School", category: "Middle School (I-VIII)", type: "Middle School", totalStudents: 46, notAttainTamil: 5, notAttainEnglish: 6, notAttainMaths: 5, attainedBLO: 37 },
  { id: 24, udise: "33080301501", name: "PUMS, PUDURKARUVALLI", management: "School Education Department School", category: "Middle School (I-VIII)", type: "Middle School", totalStudents: 39, notAttainTamil: 9, notAttainEnglish: 15, notAttainMaths: 10, attainedBLO: 23 },
  { id: 41, udise: "33080302406", name: "GHSS, PERIYAPATTI", management: "School Education Department School", category: "Hr.Sec School (VI-XII)", type: "Higher Secondary School", totalStudents: 37, notAttainTamil: 3, notAttainEnglish: 10, notAttainMaths: 10, attainedBLO: 24 },
  { id: 20, udise: "33080301207", name: "GHSS, GUNDUKAL", management: "School Education Department School", category: "Hr.Sec School (VI-XII)", type: "Higher Secondary School", totalStudents: 35, notAttainTamil: 0, notAttainEnglish: 1, notAttainMaths: 1, attainedBLO: 34 },
  { id: 12, udise: "33080300703", name: "PUMS, UMBILICKAMPATTI", management: "School Education Department School", category: "Middle School (I-VIII)", type: "Middle School", totalStudents: 35, notAttainTamil: 3, notAttainEnglish: 2, notAttainMaths: 6, attainedBLO: 28 },
  { id: 7, udise: "33080300314", name: "GHSS, RAMAMOORTHI NAGAR", management: "School Education Department School", category: "Hr.Sec School (VI-XII)", type: "Higher Secondary School", totalStudents: 33, notAttainTamil: 4, notAttainEnglish: 1, notAttainMaths: 2, attainedBLO: 29 },
  { id: 30, udise: "33080301901", name: "PUMS, DASASAMUTHIRAM", management: "School Education Department School", category: "Middle School (I-VIII)", type: "Middle School", totalStudents: 33, notAttainTamil: 10, notAttainEnglish: 8, notAttainMaths: 3, attainedBLO: 21 },
  { id: 14, udise: "33080300803", name: "PUMS, SUNDAKAPATTI", management: "School Education Department School", category: "Middle School (I-VIII)", type: "Middle School", totalStudents: 33, notAttainTamil: 2, notAttainEnglish: 1, notAttainMaths: 3, attainedBLO: 28 },
  { id: 38, udise: "33080302306", name: "PUMS, PAPPICHETTIPATTI", management: "School Education Department School", category: "Middle School (I-VIII)", type: "Middle School", totalStudents: 30, notAttainTamil: 2, notAttainEnglish: 1, notAttainMaths: 1, attainedBLO: 28 },
  { id: 23, udise: "33080301403", name: "PUMS, NALLUR MANIYAKARANOOR", management: "School Education Department School", category: "Middle School (I-VIII)", type: "Middle School", totalStudents: 27, notAttainTamil: 4, notAttainEnglish: 4, notAttainMaths: 5, attainedBLO: 20 },
  { id: 33, udise: "33080302102", name: "PUMS, THINNAPATTI", management: "School Education Department School", category: "Middle School (I-VIII)", type: "Middle School", totalStudents: 27, notAttainTamil: 6, notAttainEnglish: 8, notAttainMaths: 7, attainedBLO: 19 },
  { id: 19, udise: "33080301205", name: "PUMS, GURUVAREDDIYUR", management: "School Education Department School", category: "Middle School (I-VIII)", type: "Middle School", totalStudents: 25, notAttainTamil: 3, notAttainEnglish: 2, notAttainMaths: 1, attainedBLO: 22 },
  { id: 40, udise: "33080302401", name: "PUMS, SEMMANDAPATTI", management: "School Education Department School", category: "Middle School (I-VIII)", type: "Middle School", totalStudents: 25, notAttainTamil: 3, notAttainEnglish: 8, notAttainMaths: 0, attainedBLO: 16 },
  { id: 1, udise: "33080300101", name: "PUMS, ANNA NAGAR", management: "School Education Department School", category: "Middle School (I-VIII)", type: "Middle School", totalStudents: 23, notAttainTamil: 0, notAttainEnglish: 0, notAttainMaths: 0, attainedBLO: 23 },
  { id: 25, udise: "33080301503", name: "PUMS, KARUVALLI", management: "School Education Department School", category: "Middle School (I-VIII)", type: "Middle School", totalStudents: 23, notAttainTamil: 1, notAttainEnglish: 4, notAttainMaths: 2, attainedBLO: 18 },
  { id: 37, udise: "33080302301", name: "PUMS, KOTTAMEDU NEW SCHOOL", management: "School Education Department School", category: "Middle School (I-VIII)", type: "Middle School", totalStudents: 23, notAttainTamil: 0, notAttainEnglish: 3, notAttainMaths: 0, attainedBLO: 20 },
  { id: 17, udise: "33080301101", name: "PUMS, ELATHUR", management: "School Education Department School", category: "Middle School (I-VIII)", type: "Middle School", totalStudents: 22, notAttainTamil: 4, notAttainEnglish: 9, notAttainMaths: 1, attainedBLO: 12 },
  { id: 21, udise: "33080301305", name: "PUMS, NALLUR", management: "School Education Department School", category: "Middle School (I-VIII)", type: "Middle School", totalStudents: 22, notAttainTamil: 4, notAttainEnglish: 7, notAttainMaths: 12, attainedBLO: 10 },
  { id: 26, udise: "33080301504", name: "PUMS, MARAKOTTAI", management: "School Education Department School", category: "Middle School (I-VIII)", type: "Middle School", totalStudents: 21, notAttainTamil: 2, notAttainEnglish: 3, notAttainMaths: 1, attainedBLO: 17 },
  { id: 18, udise: "33080301102", name: "PUMS, THALAVAIPATTI", management: "School Education Department School", category: "Middle School (I-VIII)", type: "Middle School", totalStudents: 21, notAttainTamil: 0, notAttainEnglish: 12, notAttainMaths: 5, attainedBLO: 8 },
  { id: 34, udise: "33080302103", name: "PUMS, MATTUKARANPUDUR", management: "School Education Department School", category: "Middle School (I-VIII)", type: "Middle School", totalStudents: 20, notAttainTamil: 0, notAttainEnglish: 2, notAttainMaths: 2, attainedBLO: 18 },
  { id: 3, udise: "33080300208", name: "PUMS, V KONGARAPATTI", management: "School Education Department School", category: "Middle School (I-VIII)", type: "Middle School", totalStudents: 20, notAttainTamil: 1, notAttainEnglish: 13, notAttainMaths: 6, attainedBLO: 7 },
  { id: 2, udise: "33080300204", name: "PUMS, VEERIYANTHANDA", management: "School Education Department School", category: "Middle School (I-VIII)", type: "Middle School", totalStudents: 18, notAttainTamil: 1, notAttainEnglish: 2, notAttainMaths: 1, attainedBLO: 14 },
  { id: 5, udise: "33080300308", name: "PUMS, K N PUDUR", management: "School Education Department School", category: "Middle School (I-VIII)", type: "Middle School", totalStudents: 17, notAttainTamil: 3, notAttainEnglish: 2, notAttainMaths: 2, attainedBLO: 14 },
  { id: 8, udise: "33080300402", name: "PUMS, KANNAPADI", management: "School Education Department School", category: "Middle School (I-VIII)", type: "Middle School", totalStudents: 11, notAttainTamil: 5, notAttainEnglish: 8, notAttainMaths: 7, attainedBLO: 3 },
  { id: 4, udise: "33080300305", name: "PUMS, VEERATCHIYUR", management: "School Education Department School", category: "Middle School (I-VIII)", type: "Middle School", totalStudents: 3, notAttainTamil: 0, notAttainEnglish: 0, notAttainMaths: 0, attainedBLO: 3 }
];

export const COMPARISON_DATA: CategoryComparison[] = [
  { category: "Higher Secondary School", total: 1077, novAttain: 585, novPercent: 54.32, decAttain: 734, decPercent: 68.15, janAttain: 835, janPercent: 77.53, febAttain: 945, febPercent: 87.74 },
  { category: "Middle School", total: 727, novAttain: 235, novPercent: 32.32, decAttain: 457, decPercent: 62.86, janAttain: 562, janPercent: 77.30, febAttain: 635, febPercent: 87.35 },
  { category: "High School", total: 340, novAttain: 181, novPercent: 53.24, decAttain: 224, decPercent: 65.88, janAttain: 282, janPercent: 82.94, febAttain: 305, febPercent: 89.71 }
];

export const NOVEMBER_SCHOOL_DATA: SchoolData[] = JANUARY_SCHOOL_DATA.map(school => ({
  ...school,
  attainedBLO: Math.floor(school.totalStudents * 0.46),
  notAttainTamil: Math.floor(school.totalStudents * 0.18),
  notAttainEnglish: Math.floor(school.totalStudents * 0.20),
  notAttainMaths: Math.floor(school.totalStudents * 0.16),
}));

export const DECEMBER_SCHOOL_DATA: SchoolData[] = JANUARY_SCHOOL_DATA.map(school => ({
  ...school,
  attainedBLO: Math.floor(school.totalStudents * 0.65),
  notAttainTamil: Math.floor(school.totalStudents * 0.12),
  notAttainEnglish: Math.floor(school.totalStudents * 0.15),
  notAttainMaths: Math.floor(school.totalStudents * 0.08),
}));

export const FEBRUARY_SCHOOL_DATA: SchoolData[] = JANUARY_SCHOOL_DATA.map(school => ({
  ...school,
  attainedBLO: Math.floor(school.totalStudents * 0.88),
  notAttainTamil: Math.floor(school.totalStudents * 0.05),
  notAttainEnglish: Math.floor(school.totalStudents * 0.06),
  notAttainMaths: Math.floor(school.totalStudents * 0.03),
}));

export const OVERALL_TREND = [
  { month: "November", percentage: 46.63 },
  { month: "December", percentage: 65.63 },
  { month: "January", percentage: 79.08 },
  { month: "February", percentage: 88.27 }
];
