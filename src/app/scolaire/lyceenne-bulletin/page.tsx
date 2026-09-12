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
  title: "Carte Scolaire + Bulletin — Démo Lycéenne | Guifolio",
  description:
    "Carte scolaire digitale variante émeraude : bulletin de notes (S1/S2 avec coefficients), résultat final, avis datés des professeurs et des encadreurs. Démo Guifolio.",
};

const student: StudentInfo = {
  firstName: "Aïssata",
  lastName: "Bah",
  school: "Lycée 2 Octobre",
  schoolCity: "Kaloum, Conakry",
  className: "Première Sciences Exp.",
  birthDate: "25/07/2009",
  birthPlace: "Labé",
  matricule: "L2O-2025-03112",
  schoolYear: "2025-2026",
  cardNumber: "CS-2026-02286",
  photoUrl: "/scolaire/eleve-lyceenne.jpg",
};

/* Option Sciences Expérimentales — matières et coefficients
   officiels : total 18. */
const grades: GradeLine[] = [
  { subject: "Biologie", coef: 4, s1: "16,25", s2: "16,50", annual: "16,38" },
  { subject: "Physique", coef: 3, s1: "13,75", s2: "14,50", annual: "14,13" },
  { subject: "Chimie", coef: 3, s1: "14,00", s2: "14,50", annual: "14,25" },
  { subject: "Mathématiques", coef: 2, s1: "14,50", s2: "15,00", annual: "14,75" },
  { subject: "Français", coef: 2, s1: "15,50", s2: "16,00", annual: "15,75" },
  { subject: "Anglais", coef: 2, s1: "16,00", s2: "16,50", annual: "16,25" },
  { subject: "Philosophie", coef: 2, s1: "14,50", s2: "15,00", annual: "14,75" },
];

const reviews: SchoolReview[] = [
  {
    name: "Mme Mariama Diallo",
    detail: "Biologie",
    date: "05/02/2026",
    comment:
      "Première de la classe, une régularité exemplaire dans le travail et les TP.",
    tone: "positif",
  },
  {
    name: "M. Sékou Condé",
    detail: "Mathématiques",
    date: "12/06/2026",
    comment:
      "Aisance remarquable ; je l'encourage vivement à poursuivre en série Sciences Expérimentales.",
    tone: "positif",
  },
  {
    name: "M. Aboubacar Sylla",
    detail: "Physique",
    date: "28/11/2025",
    comment:
      "Tendance à la distraction en cours magistral au 1er semestre ; l'attention s'est nettement améliorée depuis.",
    tone: "negatif",
  },
  {
    name: "Mme Fatoumata Sylla",
    detail: "Français",
    date: "12/06/2026",
    comment: "Style clair et élégant, une vraie fierté pour le lycée.",
    tone: "positif",
  },
];

const encadreurs: SchoolReview[] = [
  {
    name: "M. Amadou Oury Bah",
    detail: "Surveillant Général",
    date: "12/06/2026",
    comment: "Conduite exemplaire, aucun rappel à l'ordre sur toute l'année.",
    tone: "positif",
  },
  {
    name: "Mme Nènè Kouyaté",
    detail: "Conseillère d'Éducation",
    date: "28/11/2025",
    comment:
      "Deux retards consécutifs en janvier ; corrigés immédiatement, aucune récidive depuis.",
    tone: "negatif",
  },
];

const result: FinalResult = {
  decision: "Promue en Terminale Sciences Expérimentales",
  mention: "Mention Bien",
  average: "15,20",
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
    <main className="flex min-h-dvh flex-col items-center justify-center gap-5 bg-slate-200 px-4 py-10 print:bg-white print:py-0">
      <div className="no-print flex w-full max-w-[26rem] items-center gap-2.5 rounded-2xl border border-slate-300 bg-white/70 px-4 py-3 text-xs leading-relaxed text-slate-600 backdrop-blur">
        <Users className="size-4 shrink-0 text-emerald-700" />
        <p>
          <strong className="text-slate-800">Base de données scolaire publique</strong>{" "}
          — les parents suivent en ligne les notes, résultats et comportement de
          leur enfant à l&apos;école.
        </p>
      </div>

      <StudentCard student={student} qrDataUrl={qrDataUrl} variant="emeraude" />
      <StudentReport
        variant="emeraude"
        schoolYear={student.schoolYear}
        track="Option : Sciences Expérimentales — Première · Lycée 2 Octobre"
        totalCoef={18}
        grades={grades}
        reviews={reviews}
        encadreurs={encadreurs}
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