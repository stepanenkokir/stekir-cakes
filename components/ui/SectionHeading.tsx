type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  id?: string;
};

export function SectionHeading({
  title,
  subtitle,
  align = "center",
  className = "",
  id,
}: SectionHeadingProps) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`mb-12 max-w-2xl ${alignment} ${className}`}>
      <h2
        id={id}
        className="font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl lg:text-5xl"
      >
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-4 text-lg leading-relaxed text-text-muted">{subtitle}</p>
      ) : null}
    </div>
  );
}
