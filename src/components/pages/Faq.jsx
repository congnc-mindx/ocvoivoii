import { ArrowRight, ChevronDown, Gamepad2, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

const sections = [
  {
    id: "ocvoivoii",
    title: "Ocvoivoii",
    description: "Mấy câu hỏi vui mà Ốc hay được hỏi.",
    Icon: Gamepad2,
    entries: [
      {
        question: "Anh có phải anh hay ăn dưa chuột bốc phét không?",
        answer: <>Dưa chuột thì giòn. Còn chuyện anh kể có bốc phét không, em cứ xem hết clip rồi phán nhé.</>,
      },
      {
        question: "Anh thất nghiệp à? Cần em xin đi làm công ty không?",
        answer: <>Cảm ơn em đã lo cho anh. Còn CV thì cho anh xin thêm một dòng: “Có kinh nghiệm xử lý tình huống 1 chọi 5”.</>,
      },
      {
        question: "Ocvoivoii có đẹp trai không?",
        answer: <>Câu này anh xin nhường quyền chấm điểm cho khán giả. Nhớ tính cả góc máy nhé.</>,
      },
    ],
  },
  {
    id: "oc-thuong-dai",
    title: "Ốc Thượng Đài",
    description: "Đăng ký, thay người và lịch thi đấu.",
    Icon: Trophy,
    entries: [
      {
        question: "Đăng ký tham gia giải đấu Ốc Thượng Đài có mất phí không?",
        answer: <>Hoàn toàn <strong>không mất phí</strong>. Các giải trong chuỗi Ốc Thượng Đài do Ocvoivoii Gaming tổ chức đều mở đăng ký miễn phí để cộng đồng có sân chơi rèn luyện kỹ năng.</>,
      },
      {
        question: "Nếu một thành viên bận đột xuất, đội có được thay người không?",
        answer: <>Có. Ở giải đồng đội, đội trưởng được thay tối đa <strong>01 thành viên</strong> bằng tuyển thủ dự bị đã đăng ký trước đó. Đội trưởng cần báo thay đổi trên Discord và được trọng tài xác nhận chậm nhất <strong>2 tiếng trước giờ thi đấu</strong>.</>,
      },
      {
        question: "Các đội tự thỏa thuận giờ thi đấu hay thi đấu theo lịch cố định?",
        answer: <>Các đội thi đấu theo <strong>lịch cố định do BTC thông báo</strong> để khớp với lịch phát trực tiếp. Đội đến trễ quá <strong>10 phút</strong> so với giờ hẹn sẽ bị xử thua trận đó.</>,
      },
    ],
  },
];

export default function Faq() {
  return (
    <div className="page-container py-12 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <header className="glass-panel relative overflow-hidden p-6 sm:p-10">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.20),transparent_64%)]" />
          <div className="relative">
            <p className="eyebrow">Hỏi Ốc đáp</p>
            <h1 className="page-title mt-3">Câu hỏi thường gặp</h1>
            <p className="mt-4 max-w-xl leading-7 text-slate-300">
              Từ mấy chuyện vui về Ốc đến những điều cần biết trước khi lên sàn Ốc Thượng Đài.
            </p>
            <nav aria-label="Các mục câu hỏi" className="mt-6 flex flex-wrap gap-3">
              {sections.map(({ id, title }) => (
                <Link key={id} to={{ hash: `#${id}` }} className="btn-secondary">
                  {title}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        {sections.map(({ id, title, description, Icon, entries }) => (
          <section key={id} id={id} aria-labelledby={`${id}-title`} className="mt-12 scroll-mt-24">
            <div className="mb-5 flex items-center gap-4">
              <span className="icon-tile shrink-0">
                <Icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <div>
                <h2 id={`${id}-title`} className="text-xl font-bold text-white sm:text-2xl">{title}</h2>
                <p className="mt-1 text-sm text-slate-400">{description}</p>
              </div>
            </div>
            <div className="space-y-3">
              {entries.map(({ question, answer }) => (
                <details key={question} className="group rounded-2xl border border-white/10 bg-slate-900/60 open:border-purple-400/35">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-4 font-semibold text-slate-100 transition hover:text-cyan-200 [&::-webkit-details-marker]:hidden">
                    {question}
                    <ChevronDown aria-hidden="true" className="h-5 w-5 shrink-0 text-cyan-300 transition-transform group-open:rotate-180 motion-reduce:transition-none" />
                  </summary>
                  <div className="mx-5 border-t border-white/10 py-4 leading-7 text-slate-300">
                    {answer}
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}

        <aside className="glass-panel mt-12 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white">Hẹn bạn trên sàn Ốc Thượng Đài</h2>
          <p className="mt-2 max-w-xl leading-7 text-slate-300">
            Vào trang Giải đấu để xem đợt đăng ký, thể thức và lịch thi đấu mới nhất từ BTC.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/register" className="btn-primary">
              Xem giải đấu <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Link to="/rules" className="btn-secondary">Đọc quy chế thi đấu</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
