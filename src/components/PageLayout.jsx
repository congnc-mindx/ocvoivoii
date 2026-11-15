import PageIntro from "./PageIntro";

export default function PageLayout({
  eyebrow,
  title,
  description,
  actions,
  children,
}) {
  return (
    <section className="page-container content-page" aria-labelledby="page-heading">
      <PageIntro id="page-heading" eyebrow={eyebrow} title={title} description={description}>
        {actions}
      </PageIntro>
      {children}
    </section>
  );
}
