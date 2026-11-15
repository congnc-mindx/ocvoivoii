import PageIntro from "../PageIntro";

export default function Articles() {
  return (
    <section className="page-container py-14 lg:py-20">
      <PageIntro eyebrow="Hang Ocvoivoii" title="Bài viết" description="Tin cộng đồng, thông báo và những câu chuyện sau mỗi giải đấu." />
      <p className="glass-panel mt-7 p-6 text-slate-300">Chưa có bài viết được đăng.</p>
    </section>
  );
}
