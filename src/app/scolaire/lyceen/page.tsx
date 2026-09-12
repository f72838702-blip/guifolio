import type { Metadata } from "next";
import QRCode from "qrcode";
import StudentCard, {
  type StudentInfo,
} from "@/components/scolaire/StudentCard";
import CardButtons from "@/components/scolaire/CardButtons";

export const metadata: Metadata = {
  title: "Carte Scolaire Numérique — Démo Lycéen | Guifolio",
  description:
    "Exemple de carte scolaire digitale officielle : identité, matricule, QR de vérification. Démo Guifolio.",
};

const student: StudentInfo = {
  firstName: "Mamadou Saliou",
  lastName: "Diallo",
  school: "Lycée Almamy Samory Touré",
  schoolCity: "Dixinn, Conakry",
  className: "Terminale Sciences Exp.",
  birthDate: "12/03/2008",
  birthPlace: "Conakry",
  matricule: "AST-2025-08471",
  schoolYear: "2025-2026",
  cardNumber: "CS-2026-01137",
  // photoUrl: ajouté quand la photo est fournie
};

export default async function CarteLyceenPage() {
  const qrDataUrl = await QRCode.toDataURL(
    `https://guifolio.com/scolaire/lyceen?verif=${student.matricule}`,
    { width: 400, margin: 1 }
  );

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-slate-200 px-4 py-10 print:bg-white print:py-0">
      <StudentCard student={student} qrDataUrl={qrDataUrl} variant="royal" />
      <CardButtons />
    </main>
  );
}
