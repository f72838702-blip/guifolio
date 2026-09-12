import type { Metadata } from "next";
import QRCode from "qrcode";
import { Users } from "lucide-react";
import StudentCard, {
  type StudentInfo,
} from "@/components/scolaire/StudentCard";
import StudentReport, {
  type GradeLine,
  type SchoolReview,
  type FinalResult,
} from "@/components/scolaire/StudentReport";
import CardButtons from "@/components/scolaire/CardButtons";

export const metadata: Metadata = {
  title: "Carte Scolaire + Bulletin — Démo Lycéen | Guifolio",
  description:
    "Carte scolaire digitale : bulletin de notes (S1/S2 avec coefficients), résultat final au Baccalauréat, avis datés des professeurs et des encadreurs. Démo Guifolio.",
};

const student: StudentInfo = {
  firstName: "Morgan",
  lastName: "Guilavogui",
  school: "Lycée Almamy Samory Touré",
  schoolCity: "Dixinn, Conakry",
  className: "Terminale Sciences Exp. (SE)",
  birthDate: "12/03/2008",
  birthPlace: "Conakry",
  matricule: "AST-2025-08471",
  schoolYear: "2025-2026",
  cardNumber: "CS-2026-01137",
  photoUrl: "/scolaire/eleve-lyceen.jpg",
};

/* Option Sciences Expérimentales — matières et coefficients
   officiels : total 18. */
const grades: GradeLine[] = [
  { subject: "Biologie", coef: 4, s1: "15,50", s2: "16,75", annual: "16,13" },
  { subject: "Physique", coef: 3, s1: "12,75", s2: "13,50", annual: "13,13" },
  { subject: "Chimie", coef: 3, s1: "12,50", s2: "13,25", annual: "12,88" },
  { subject: "Mathématiques", coef: 2, s1: "13,20", s2: "14,50", annual: "13,85" },
  { subject: "Français", coef: 2, s1: "13,50", s2: "14,00", annual: "13,75" },
  { subject: "Anglais", coef: 2, s1: "15,00", s2: "15,50", annual: "15,25" },
  { subject: "Philosophie", coef: 2, s1: "13,00", s2: "13,50", annual: "13,25" },
];

const reviews: SchoolReview[] = [
  {
    name: "M. Thierno Sadou Bah",
    detail: "Mathématiques",
    date: "05/02/2026",
    comment:
      "Élève rigoureux et régulier, progresse vite en analyse et en suites numériques.",
    tone: "positif",
  },
  {
    name: "Mme Kadiatou Diallo",
    detail: "Biologie",
    date: "05/02/2026",
    comment:
      "Excellente maîtrise des chapitres de biologie ; très appliquée en travaux pratiques.",
    tone: "positif",
  },
  {
    name: "M. Ousmane Camara",
    detail: "Chimie",
    date: "28/11/2025",
    comment:
      "Compte-rendus de TP incomplets au 1er semestre ; doit soigner les bilans de réactions.",
    tone: "negatif",
  },
  {
    name: "Mme Aïssatou Barry",
    detail: "Français",
    date: "12/06/2026",
    comment: "Rédactions soignées, participation active aux débats de classe.",
    tone: "positif",
  },
];

const encadreurs: SchoolReview[] = [
  {
    name: "M. Ibrahima Sory Kéïta",
    detail: "Surveillant Général",
    date: "12/06/2026",
    comment:
      "Élève respectueux et ponctuel, bien intégré dans l'établissement.",
    tone: "positif",
  },
  {
    name: "Mme Hadja Mariama Kaba",
    detail: "Conseillère d'Éducation",
    date: "28/11/2025",
    comment:
      "Quelques bavardages répétés en classe ; engagement d'amélioration signé et tenu au 2e semestre.",
    tone: "negatif",
  },
];

const result: FinalResult = {
  decision: "Admis au Baccalauréat unique 2026",
  mention: "Mention Bien",
  average: "14,15",
  rank: "4ᵉ / 52",
  note: "Session de juillet 2026 · Option Sciences Expérimentales · Félicitations du conseil d'établissement.",
};

export default async function CarteLyceenBulletinPage() {
  // QR : redirection directe vers cette page.
  const qrDataUrl = await QRCode.toDataURL(
    "https://guifolio.com/scolaire/lyceen-bulletin",
    { width: 400, margin: 1 }
  );

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-5 bg-slate-200 px-4 py-10 print:bg-white print:py-0">
      <div className="no-print flex w-full max-w-[26rem] items-center gap-2.5 rounded-2xl border border-slate-300 bg-white/70 px-4 py-3 text-xs leading-relaxed text-slate-600 backdrop-blur">
        <Users className="size-4 shrink-0 text-[#1E3A8A]" />
        <p>
          <strong className="text-slate-800">Base de données scolaire publique</strong>{" "}
          — les parents suivent en ligne les notes, résultats et comportement de
          leur enfant à l&apos;école.
        </p>
      </div>

      <StudentCard student={student} qrDataUrl={qrDataUrl} variant="royal" />
      <StudentReport
        variant="royal"
        schoolYear={student.schoolYear}
        track="Option : Sciences Expérimentales — Terminale · Lycée Almamy Samory Touré"
        totalCoef={18}
        grades={grades}
        reviews={reviews}
        encadreurs={encadreurs}
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