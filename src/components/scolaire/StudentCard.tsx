import {
  GraduationCap,
  BookOpen,
  School,
  CalendarDays,
  Hash,
  IdCard,
} from "lucide-react";

export type StudentInfo = {
  firstName: string;
  lastName: string;
  school: string;
  schoolCity: string;
  className: string;
  birthDate: string;
  birthPlace: string;
  matricule: string;
  schoolYear: string;
  cardNumber: string;
  photoUrl?: string;
};

/**
 * Carte scolaire numérique — badge officiel vertical.
 * variant "royal" = copie du design Matam Waraba (bleu royal / or / blanc)
 * variant "emeraude" = variante (émeraude / or, photo rectangulaire)
 */
export default function StudentCard({
  student,
  qrDataUrl,
  variant = "royal",
}: {
  student: StudentInfo;
  qrDataUrl: string;
  variant?: "royal" | "emeraude";
}) {
  const royal = variant === "royal";
  const C = royal
    ? {
        border: "border-amber-500",
        header: "bg-[#1E3A8A]",
        headerText: "text-amber-400",
        headerSub: "text-amber-200/80",
        photoRing: "ring-amber-500",
        photoFallbackBg: "bg-[#2563EB]",
        nameAccent: "text-[#1E3A8A]",
        tileBorder: "border-amber-500/60",
        tileHead: "bg-gradient-to-r from-[#1E3A8A] to-[#2563EB]",
        tileIcon: "text-amber-500",
        sep: "bg-amber-500",
        Emblem: GraduationCap,
      }
    : {
        border: "border-amber-400",
        header: "bg-gradient-to-r from-emerald-800 to-emerald-900",
        headerText: "text-amber-300",
        headerSub: "text-emerald-100/80",
        photoRing: "ring-emerald-600",
        photoFallbackBg: "bg-emerald-700",
        nameAccent: "text-emerald-800",
        tileBorder: "border-amber-400/70",
        tileHead: "bg-gradient-to-r from-emerald-700 to-emerald-500",
        tileIcon: "text-emerald-600",
        sep: "bg-emerald-600",
        Emblem: BookOpen,
      };

  const initials =
    (student.firstName[0] ?? "") + (student.lastName[0] ?? "");
  const Emblem = C.Emblem;

  const stats = [
    { icon: School, label: "Classe", value: student.className },
    { icon: CalendarDays, label: "Né(e) le", value: `${student.birthDate}` },
    { icon: Hash, label: "Matricule", value: student.matricule },
    { icon: IdCard, label: "Année", value: student.schoolYear },
  ];

  return (
    <div
      className={`print-card relative w-full max-w-[26rem] overflow-hidden rounded-[1.75rem] border-2 bg-white text-slate-800 shadow-2xl ${C.border}`}
    >
      {/* Filigrane */}
      <Emblem
        className={`pointer-events-none absolute left-1/2 top-1/2 size-64 -translate-x-1/2 -translate-y-1/2 opacity-[0.05] ${
          royal ? "text-[#1E3A8A]" : "text-emerald-800"
        }`}
        aria-hidden
      />

      {/* En-tête */}
      <div
        className={`relative flex flex-col items-center gap-1.5 px-6 py-5 text-center ${C.header}`}
      >
        <div className="flex size-11 items-center justify-center rounded-full bg-amber-400 shadow">
          <Emblem className="size-6 text-slate-900" />
        </div>
        <p className={`text-sm font-extrabold uppercase tracking-widest ${C.headerText}`}>
          {student.school}
        </p>
        <p className={`text-[10px] uppercase tracking-[0.25em] ${C.headerSub}`}>
          République de Guinée · Carte scolaire officielle
        </p>
      </div>

      {/* Photo */}
      <div className="relative -mt-2 flex justify-center pt-6">
        {student.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={student.photoUrl}
            alt={`${student.firstName} ${student.lastName}`}
            className={`object-cover shadow-lg ring-4 ${C.photoRing} ${
              royal
                ? "size-28 rounded-full border-4 border-amber-400"
                : "h-32 w-28 rounded-2xl border-2 border-amber-400"
            }`}
          />
        ) : (
          <div
            className={`flex items-center justify-center font-display text-3xl font-bold text-white shadow-lg ring-4 ${C.photoRing} ${C.photoFallbackBg} ${
              royal
                ? "size-28 rounded-full border-4 border-amber-400"
                : "h-32 w-28 rounded-2xl border-2 border-amber-400"
            }`}
          >
            {initials}
          </div>
        )}
      </div>

      {/* Identité */}
      <div className="relative px-6 pb-6 pt-4 text-center">
        <h1 className="font-display text-xl font-extrabold uppercase tracking-wide text-slate-900">
          {student.firstName}{" "}
          <span className={C.nameAccent}>{student.lastName}</span>
        </h1>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Élève · {student.schoolCity}
        </p>

        {/* Grille stats */}
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          {stats.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className={`overflow-hidden rounded-xl border ${C.tileBorder}`}
            >
              <div className={`flex items-center gap-1.5 px-3 py-1.5 ${C.tileHead}`}>
                <Icon className="size-3.5 text-amber-300" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-white">
                  {label}
                </span>
              </div>
              <p className="px-3 py-2 text-left text-xs font-semibold text-slate-800">
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* QR + statut */}
        <div className="mt-5 flex items-center justify-center gap-4">
          <div className={`rounded-xl border-2 bg-white p-1.5 ${C.tileBorder}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrDataUrl}
              alt={`QR de vérification — ${student.matricule}`}
              width={104}
              height={104}
              className="rounded-lg"
            />
          </div>
          <div className="text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow">
              <span className="size-1.5 rounded-full bg-white" /> Inscrit(e)
            </span>
            <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Carte N° {student.cardNumber}
            </p>
            <p className="text-[10px] text-slate-400">
              {student.schoolYear}
            </p>
          </div>
        </div>

        {/* Pied */}
        <div className={`mx-auto mt-5 h-px w-24 ${C.sep} opacity-60`} />
        <p className="mt-3 text-[9px] leading-relaxed text-slate-400">
          Carte officielle du {student.school} · {student.schoolCity}
          <br />
          Valide pour l'année scolaire {student.schoolYear} · Toute
          reproduction interdite
        </p>
      </div>
    </div>
  );
}
