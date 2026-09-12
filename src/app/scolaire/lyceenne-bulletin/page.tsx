import type { Metadata } from "next";
import QRCode from "qrcode";
import StudentCard, {
  type StudentInfo,
} from "@/components/scolaire/StudentCard";
import StudentReport, {
  type GradeLine,
  type TeacherReview,
  type FinalResult,
} from "@/components/scolaire/StudentReport";
import CardButtons from "@/components/scolaire/CardButtons";

export const metadata: Metadata = {
  title: "Carte Scolaire + Bulletin — Démo Lycéenne | Guifolio",
  description:
    "Carte scolaire digitale officielle variante émeraude avec bulletin de notes (S1/S2), résultat final et avis des professeurs. Démo Guifolio.",
};

const student: StudentInfo = {
  firstName: "Aïssata",
  lastName: "Bah",
  school: "Lycée 2 Octobre",
  schoolCity: "Kaloum, Conakry",
  className: "Première Sciences Nat.",
  birthDate: "25/07/2009",
  birthPlace: "Labé",
  matricule: "L2O-2025-03112",
  schoolYear: "2025-2026",
  cardNumber: "CS-2026-02286",
  // photoUrl: ajouté quand la photo est fournie
};

/* Classe de Première Sciences Naturelles — programme guinéen :
   SVT, Maths, Physique-Chimie, Français, Anglais, Histoire-Géo,
   Éducation Civique et options (Arabe, EPS). */
const grades: GradeLine[] = [
  { subject: "SVT", coef: 4, s1: "16,25", s2: "16,50", annual: "16,38" },
  { subject: "Mathématiques", coef: 3, s1: "14,50", s2: "15,00", annual: "14,75" },
  { subject: "Physique-Chimie", coef: 3, s1: "13,75", s2: "14,50", annual: "14,13" },
  { subject: "Français", coef: 3, s1: "15,50", s2: "16,00", annual: "15,75" },
  { subject: "Anglais", coef: 2, s1: "16,00", s2: "16,50", annual: "16,25" },
  { subject: "Histoire-Géographie", coef: 2, s1: "14,75", s2: "15,00", annual: "14,88" },
  { subject: "Éducation Civique", coef: 1, s1: "15,00", s2: "15,50", annual: "15,25" },
  { subject: "Arabe", coef: 1, s1: "15,50", s2: "16,00", annual: "15,75", note: "option" },
  { subject: "EPS", coef: 1, s1: "17,00", s2: "17,50", annual: "17,25", note: "option" },
];

const reviews: TeacherReview[] = [
  {
    teacher: "Mme Mariama Diallo",
    subject: "SVT",
    comment:
      "Première de la classe, une régularité exemplaire dans le travail et les TP.",
  },
  {
    teacher: "M. Sékou Condé",
    subject: "Mathématiques",
    comment:
      "Aisance remarquable ; je l'encourage vivement à poursuivre en série Sciences Expérimentales.",
  },
  {
    teacher: "Mme Fatoumata Sylla",
    subject: "Français",
    comment: "Style clair et élégant, une vraie fierté pour le lycée.",
  },
  {
    teacher: "M. Aboubacar Sylla",
    subject: "Anglais",
    comment:
      "Excellent niveau oral, candidate idéale pour les concours régionaux.",
  },
];

const result: FinalResult = {
  decision: "Promue en Terminale Sciences Expérimentales",
  mention: "Mention Très Bien",
  average: "17,22",
  rank: "1ʳᵉ / 38",
  note: "Félicitations du conseil de classe · Passage en classe supérieure — session 2025-2026.",
};

export default async function CarteLyceenneBulletinPage() {
  // QR : redirection directe vers cette page.
  const qrDataUrl = await QRCode.toDataURL(
    "https://guifolio.com/scolaire/lyceenne-bulletin",
    { width: 400, margin: 1 }
  );

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-slate-200 px-4 py-10 print:bg-white print:py-0">
      <StudentCard student={student} qrDataUrl={qrDataUrl} variant="emeraude" />
      <StudentReport
        variant="emeraude"
        schoolYear={student.schoolYear}
        track="Classe de Première Sciences Naturelles — Lycée 2 Octobre"
        grades={grades}
        reviews={reviews}
        result={result}
      />
      <CardButtons label="Imprimer la carte et le bulletin" />
      <p className="no-print -mt-3 text-xs text-slate-400">
        <a href="/scolaire/lyceenne" className="underline hover:text-slate-600">
          Voir la carte seule
        </a>
        {" · "}
        <a href="/scolaire/lyceen-bulletin" className="underline hover:text-slate-600">
          Version lycéen
        </a>
      </p>
    </main>
  );
}