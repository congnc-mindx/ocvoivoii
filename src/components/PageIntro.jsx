export default function PageIntro({ id, eyebrow, title, description, children }) {
  return (
    <header className="page-intro">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 id={id} className="page-title">{title}</h1>
      {description && <p className="page-intro-description">{description}</p>}
      {children && <div className="page-intro-actions">{children}</div>}
    </header>
  );
}
