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
  title: "Carte Scolaire + Bulletin — Démo Lycéen | Guifolio",
  description:
    "Carte scolaire digitale officielle avec bulletin de notes (S1/S2), résultat final au Baccalauréat et avis des professeurs. Démo Guifolio.",
};

const student: StudentInfo = {
  firstName: "Mamadou Saliou",
  lastName: "Diallo",
  school: "Lycée Almamy Samory Touré",
  schoolCity: "Dixinn, Conakry",
  className: "Terminale Sciences Exp. (SE)",
  birthDate: "12/03/2008",
  birthPlace: "Conakry",
  matricule: "AST-2025-08471",
  schoolYear: "2025-2026",
  cardNumber: "CS-2026-01137",
  // photoUrl: ajouté quand la photo est fournie
};

/* Série Sciences Expérimentales (SE) — programme guinéen :
   SVT renforcé, Physique-Chimie, Maths, Français, Anglais
   + Histoire-Géo, Philosophie et options. */
const grades: GradeLine[] = [
  { subject: "SVT", coef: 5, s1: "15,50", s2: "16,75", annual: "16,13", note: "renforcé" },
  { subject: "Mathématiques", coef: 4, s1: "13,20", s2: "14,50", annual: "13,85" },
  { subject: "Physique-Chimie", coef: 4, s1: "12,75", s2: "13,50", annual: "13,13" },
  { subject: "Français", coef: 3, s1: "13,50", s2: "14,00", annual: "13,75" },
  { subject: "Anglais", coef: 2, s1: "15,00", s2: "15,50", annual: "15,25" },
  { subject: "Histoire-Géographie", coef: 2, s1: "12,50", s2: "13,00", annual: "12,75" },
  { subject: "Philosophie", coef: 2, s1: "13,00", s2: "13,50", annual: "13,25" },
  { subject: "Arabe", coef: 1, s1: "14,75", s2: "15,50", annual: "15,13", note: "option" },
  { subject: "EPS", coef: 1, s1: "16,00", s2: "17,00", annual: "16,50", note: "option" },
];

const reviews: TeacherReview[] = [
  {
    teacher: "M. Thierno Sadou Bah",
    subject: "Mathématiques",
    comment:
      "Élève rigoureux et régulier, progresse vite en analyse et en suites numériques.",
  },
  {
    teacher: "Mme Kadiatou Diallo",
    subject: "SVT",
    comment:
      "Excellente maîtrise des chapitres de biologie ; très appliquée lors des travaux pratiques.",
  },
  {
    teacher: "M. Ousmane Camara",
    subject: "Physique-Chimie",
    comment:
      "Travail sérieux et méthodique ; encore un effort sur l'optique pour viser la mention Très Bien.",
  },
  {
    teacher: "Mme Aïssatou Barry",
    subject: "Français",
    comment: "Rédactions soignées, participation active aux débats de classe.",
  },
];

const result: FinalResult = {
  decision: "Admis au Baccalauréat unique 2026",
  mention: "Mention Bien",
  average: "14,33",
  rank: "4ᵉ / 52",
  note: "Session de juillet 2026 · Série Sciences Expérimentales (SE) · Félicitations du conseil d'établissement.",
};

export default async function CarteLyceenBulletinPage() {
  // QR : redirection directe vers cette page.
  const qrDataUrl = await QRCode.toDataURL(
    "https://guifolio.com/scolaire/lyceen-bulletin",
    { width: 400, margin: 1 }
  );

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-slate-200 px-4 py-10 print:bg-white print:py-0">
      <StudentCard student={student} qrDataUrl={qrDataUrl} variant="royal" />
      <StudentReport
        variant="royal"
        schoolYear={student.schoolYear}
        track="Série Sciences Expérimentales (SE) — Lycée Almamy Samory Touré"
        grades={grades}
        reviews={reviews}
        result={result}
      />
      <CardButtons label="Imprimer la carte et le bulletin" />
      <p className="no-print -mt-3 text-xs text-slate-400">
        <a href="/scolaire/lyceen" className="underline hover:text-slate-600">
          Voir la carte seule
        </a>
        {" · "}
        <a href="/scolaire/lyceenne-bulletin" className="underline hover:text-slate-600">
          Version lycéenne
        </a>
      </p>
    </main>
  );
}