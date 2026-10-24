// src/components/PageIntro.jsx
export default function PageIntro({ eyebrow, title, description, children }) {
  return (
    <header className="mb-10 max-w-3xl">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="page-title">{title}</h1>
      {description && (
        <p className="mt-5 text-base leading-8 text-slate-400 sm:text-lg">
          {description}
        </p>
      )}
      {children}
    </header>
  );
}
