import PageLayout from "../PageLayout";

export default function Articles() {
  return (
    <PageLayout
      eyebrow="Hang Ocvoivoii"
      title="Bài viết"
      description="Tin cộng đồng, thông báo và những câu chuyện sau mỗi giải đấu."
    >
      <p className="glass-panel p-6 text-slate-300">Chưa có bài viết được đăng.</p>
    </PageLayout>
  );
}
