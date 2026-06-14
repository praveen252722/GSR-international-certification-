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
      <p className="text-sm font-bold uppercase tracking-[0.28em] text-copper">{eyebrow}</p>
      <h2 className={`mt-3 font-display text-4xl font-semibold leading-tight md:text-5xl ${light ? "text-white" : "text-ink"}`}>
        {title}
      </h2>
      {text ? <p className={`mt-5 text-base leading-8 ${light ? "text-white/75" : "text-graphite/75"}`}>{text}</p> : null}
    </div>
  );
}
