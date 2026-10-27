type SectionHeadingProps = {
  id: string;
  index: string;
  title: string;
  description?: string;
  dark?: boolean;
};

export function SectionHeading({
  id,
  index,
  title,
  description,
  dark = false,
}: SectionHeadingProps) {
  return (
    <div className={`section-heading ${dark ? "section-heading-dark" : ""}`}>
      <span className="section-index">{index}</span>
      <div>
        <h2 id={id}>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
    </div>
  );
}
