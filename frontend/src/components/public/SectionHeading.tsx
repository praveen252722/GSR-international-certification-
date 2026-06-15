export function SectionHeading({
  eyebrow,
  title,
  text,
  light = false
}: {
  eyebrow: string;
  title: string;
  text?: string;
  light?: boolean;
}) {
  return (
    <div className="max-w-3xl">
      <p className={`text-sm font-bold uppercase tracking-[0.28em] ${light ? "text-white/70" : "text-[#0a57d5]"}`}>{eyebrow}</p>
      <h2 className={`mt-3 font-sans text-3xl font-extrabold leading-tight md:text-5xl ${light ? "text-white" : "text-[#08172f]"}`}>
        {title}
      </h2>
      {text ? <p className={`mt-5 text-base leading-8 ${light ? "text-white/75" : "text-slate-600"}`}>{text}</p> : null}
    </div>
  );
}
