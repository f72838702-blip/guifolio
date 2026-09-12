import { Award, Quote, UserRound } from "lucide-react";

export type GradeLine = {
  subject: string;
  coef: number;
  s1: string;
  s2: string;
  annual: string;
  /** SVT renforcé en série SE, par ex. */
  note?: string;
};

export type TeacherReview = {
  teacher: string;
  subject: string;
  comment: string;
};

export type FinalResult = {
  decision: string;
  mention: string;
  average: string;
  rank: string;
  note?: string;
};

/**
 * Compléments marketing de la carte scolaire : bulletin de notes
 * (1er / 2e semestre + moyenne annuelle), résultat final et
 * avis des professeurs. Même langage visuel que StudentCard
 * (variants "royal" / "emeraude").
 */
export default function StudentReport({
  variant = "royal",
  schoolYear,
  track,
  grades,
  reviews,
  result,
}: {
  variant?: "royal" | "emeraude";
  schoolYear: string;
  track: string;
  grades: GradeLine[];
  reviews: TeacherReview[];
  result: FinalResult;
}) {
  const royal = variant === "royal";
  const C = royal
    ? {
        border: "border-amber-500",
        head: "bg-gradient-to-r from-[#1E3A8A] to-[#2563EB]",
        headText: "text-amber-400",
        chip: "bg-[#1E3A8A]",
        banner: "from-[#1E3A8A] to-[#2563EB]",
        bannerAccent: "text-amber-300",
        mentionChip: "bg-amber-400 text-slate-900",
        subHead: "bg-[#1E3A8A]/5",
        totalRow: "bg-amber-50",
        sep: "bg-amber-500",
      }
    : {
        border: "border-amber-400",
        head: "bg-gradient-to-r from-emerald-700 to-emerald-500",
        headText: "text-amber-300",
        chip: "bg-emerald-700",
        banner: "from-emerald-700 to-emerald-500",
        bannerAccent: "text-amber-300",
        mentionChip: "bg-amber-300 text-slate-900",
        subHead: "bg-emerald-50",
        totalRow: "bg-amber-50",
        sep: "bg-emerald-600",
      };

  return (
    <div className="flex w-full max-w-[26rem] flex-col gap-5">
      {/* ── Bulletin de notes ─────────────────────────────── */}
      <section className={`print-card overflow-hidden rounded-[1.75rem] border-2 bg-white shadow-xl ${C.border}`}>
        <div className={`flex items-center justify-between px-4 py-3 ${C.head}`}>
          <p className="text-xs font-extrabold uppercase tracking-widest text-white">
            Bulletin de notes
          </p>
          <p className={`text-[10px] font-bold uppercase tracking-wider ${C.headText}`}>
            {schoolYear}
          </p>
        </div>

        <div className="px-4 pb-1 pt-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {track}
          </p>
        </div>

        <div className="overflow-x-auto px-4 pb-4 pt-2">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className={`text-[10px] uppercase tracking-wider text-slate-500 ${C.subHead}`}>
                <th className="rounded-l-lg py-2 pl-3 font-bold">Matière</th>
                <th className="py-2 text-center font-bold">Coef.</th>
                <th className="py-2 text-center font-bold">S1</th>
                <th className="py-2 text-center font-bold">S2</th>
                <th className="rounded-r-lg py-2 pr-3 text-center font-bold">Annuelle</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((g) => (
                <tr key={g.subject} className="border-t border-slate-100">
                  <td className="py-2 pl-3 pr-2 font-semibold text-slate-800">
                    {g.subject}
                    {g.note ? (
                      <span className="ml-1 text-[9px] font-bold uppercase text-slate-400">
                        ({g.note})
                      </span>
                    ) : null}
                  </td>
                  <td className="py-2 text-center text-slate-500">{g.coef}</td>
                  <td className="py-2 text-center text-slate-600">{g.s1}</td>
                  <td className="py-2 text-center text-slate-600">{g.s2}</td>
                  <td className={`py-2 pr-3 text-center font-bold ${gradeColor(g.annual)}`}>
                    {g.annual}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className={`border-t-2 ${C.border}`}>
                <td
                  colSpan={4}
                  className={`rounded-bl-lg py-2.5 pl-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-700 ${C.totalRow}`}
                >
                  Moyenne générale pondérée
                </td>
                <td className={`rounded-br-lg py-2.5 pr-3 text-center text-sm font-extrabold text-slate-900 ${C.totalRow}`}>
                  {result.average}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {/* ── Résultat final ───────────────────────────────── */}
      <section
        className={`print-card rounded-[1.75rem] bg-gradient-to-r p-5 text-center text-white shadow-xl ${C.banner}`}
      >
        <p className="flex items-center justify-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.25em] text-white/70">
          <Award className="size-3.5" /> Résultat final
        </p>
        <h2 className="mt-2 font-display text-lg font-extrabold uppercase leading-snug tracking-wide">
          {result.decision}
        </h2>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <span className={`rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide shadow ${C.mentionChip}`}>
            {result.mention}
          </span>
          <span className="rounded-full border border-white/30 px-3 py-1 text-[11px] font-bold">
            Moyenne {result.average}/20
          </span>
          <span className="rounded-full border border-white/30 px-3 py-1 text-[11px] font-bold">
            {result.rank}
          </span>
        </div>
        {result.note ? (
          <p className="mt-3 text-[10px] leading-relaxed text-white/75">{result.note}</p>
        ) : null}
      </section>

      {/* ── Avis des professeurs ─────────────────────────── */}
      <section className="print-card rounded-[1.75rem] border-2 bg-white p-4 shadow-xl">
        <h3 className="flex items-center gap-2 px-1 pb-3 text-xs font-extrabold uppercase tracking-widest text-slate-700">
          <Quote className={`size-4 ${royal ? "text-[#2563EB]" : "text-emerald-600"}`} />
          Avis des professeurs
        </h3>
        <div className="flex flex-col gap-2.5">
          {reviews.map((r) => (
            <div
              key={r.teacher + r.subject}
              className={`rounded-xl border bg-slate-50 p-3.5 ${C.border} border-opacity-40`}
            >
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <p className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <UserRound className={`size-3.5 ${royal ? "text-[#1E3A8A]" : "text-emerald-700"}`} />
                  {r.teacher}
                </p>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white ${C.chip}`}
                >
                  {r.subject}
                </span>
              </div>
              <p className="mt-2 text-xs italic leading-relaxed text-slate-600">
                « {r.comment} »
              </p>
            </div>
          ))}
        </div>
        <div className={`mx-auto mt-4 h-px w-16 ${C.sep} opacity-60`} />
        <p className="pt-2.5 text-center text-[9px] leading-relaxed text-slate-400">
          Bulletin et appréciations établis par le conseil de classe · {schoolYear}
        </p>
      </section>
    </div>
  );
}

/** Moyenne >= 15 en vert, < 12 en rouge, sinon neutre. */
function gradeColor(annual: string): string {
  const value = Number.parseFloat(annual.replace(",", "."));
  if (Number.isNaN(value)) return "text-slate-800";
  if (value >= 15) return "text-emerald-600";
  if (value < 12) return "text-rose-600";
  return "text-slate-800";
}