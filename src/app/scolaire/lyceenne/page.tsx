import type { Metadata } from "next";
import QRCode from "qrcode";
import StudentCard, {
  type StudentInfo,
} from "@/components/scolaire/StudentCard";
import CardButtons from "@/components/scolaire/CardButtons";

export const metadata: Metadata = {
  title: "Carte Scolaire Numérique — Démo Lycéenne | Guifolio",
  description:
    "Exemple de carte scolaire digitale officielle variante émeraude : identité, matricule, QR de vérification. Démo Guifolio.",
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
  photoUrl: "/scolaire/eleve-lyceenne.jpg",
};

export default async function CarteLyceennePage() {
  const qrDataUrl = await QRCode.toDataURL(
    `https://guifolio.com/scolaire/lyceenne?verif=${student.matricule}`,
    { width: 400, margin: 1 }
  );

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-slate-200 px-4 py-10 print:bg-white print:py-0">
      <StudentCard student={student} qrDataUrl={qrDataUrl} variant="emeraude" />
      <CardButtons />
    </main>
  );
}
