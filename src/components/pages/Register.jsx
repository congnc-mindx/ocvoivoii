// src/pages/Register.jsx
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Trophy,
  User,
  Users,
} from "lucide-react";
import { db } from "../../firebase";
import PageIntro from "../PageIntro";
import {
  createInitialRegistration,
  getRegistrationError,
  normalizeRegistration,
  validateRegistration,
} from "../../utils/registration";

function FieldError({ id, message }) {
  return message ? (
    <p id={id} className="mt-2 text-sm leading-6 text-rose-300">
      {message}
    </p>
  ) : null;
}

export default function Register() {
  const [values, setValues] = useState(createInitialRegistration);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const [slowWrite, setSlowWrite] = useState(false);
  const [submitted, setSubmitted] = useState(null);

  const formRef = useRef(null);
  const successRef = useRef(null);
  const errorRef = useRef(null);
  const mountedRef = useRef(true);
  const submittingRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (submitted) successRef.current?.focus();
  }, [submitted]);

  useEffect(() => {
    if (submitError) errorRef.current?.focus();
  }, [submitError]);

  useEffect(() => {
    if (!loading) return undefined;
    const timer = window.setTimeout(() => setSlowWrite(true), 10000);
    return () => window.clearTimeout(timer);
  }, [loading]);

  function handleChange(event) {
    const { name, value } = event.target;

    setValues((current) => ({
      ...current,
      [name]: value,
      ...(name === "type" && value === "solo" ? { teamName: "" } : {}),
    }));

    setErrors((current) => ({
      ...current,
      [name]: undefined,
      ...(name === "type" ? { teamName: undefined } : {}),
    }));

    setSubmitError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submittingRef.current) return;

    const nextErrors = validateRegistration(values);
    setErrors(nextErrors);
    setSubmitError("");

    const firstInvalidField = Object.keys(nextErrors)[0];

    if (firstInvalidField) {
      formRef.current?.querySelector(`[name="${firstInvalidField}"]`)?.focus();
      return;
    }

    if (!db) {
      setSubmitError(
        "Cổng đăng ký chưa sẵn sàng. Vui lòng quay lại sau hoặc liên hệ ban tổ chức.",
      );
      return;
    }

    if (navigator.onLine === false) {
      setSubmitError(
        "Bạn đang ngoại tuyến. Vui lòng kết nối mạng trước khi gửi.",
      );
      return;
    }

    submittingRef.current = true;
    setLoading(true);
    setSlowWrite(false);

    const registration = normalizeRegistration(values);

    try {
      const result = await addDoc(collection(db, "tournament_registrations"), {
        ...registration,
        createdAt: serverTimestamp(),
      });

      if (mountedRef.current) {
        setSubmitted({
          id: result.id,
          fullName: registration.fullName,
          type: registration.type,
          teamName: registration.teamName,
        });
      }
    } catch (error) {
      if (mountedRef.current) {
        setSubmitError(getRegistrationError(error));
      }
    } finally {
      submittingRef.current = false;

      if (mountedRef.current) {
        setLoading(false);
        setSlowWrite(false);
      }
    }
  }

  function resetForm() {
    if (submittingRef.current) return;

    setValues(createInitialRegistration());
    setErrors({});
    setSubmitError("");
    setSubmitted(null);
    setSlowWrite(false);

    window.requestAnimationFrame(() => {
      formRef.current?.querySelector('[name="fullName"]')?.focus();
    });
  }

  return (
    <section className="page-container py-14 lg:py-20">
      <PageIntro
        eyebrow="Ốc Thượng Đài"
        title="Ghi tên lên sàn đấu."
        description="Đánh đơn hay theo đội, hãy để lại thông tin để ban tổ chức liên hệ xác nhận và thông báo chi tiết giải."
      />

      <div className="grid items-start gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
        <aside>
          <div className="glass-panel p-7">
            <span className="icon-tile">
              <Trophy aria-hidden="true" className="h-7 w-7" />
            </span>

            <h2 className="mt-6 text-2xl font-black text-white">
              Một chiếc kèo.
              <br />
              Nhiều khoảnh khắc.
            </h2>

            <p className="mt-4 text-sm leading-8 text-slate-400">
              Đăng ký là bước đầu để gặp những đồng đội và đối thủ mới. Suất
              tham gia được xác nhận khi ban tổ chức liên hệ với bạn.
            </p>

            <ol className="mt-7 space-y-5">
              {[
                "Điền họ tên và thông tin liên hệ.",
                "Chọn đánh đơn hoặc đăng ký theo đội.",
                "Chờ ban tổ chức xác nhận và gửi lịch.",
              ].map((step, index) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-purple-400/25 bg-purple-500/15 text-xs font-bold text-purple-200">
                    {index + 1}
                  </span>
                  <span className="pt-0.5 text-sm leading-6 text-slate-300">
                    {step}
                  </span>
                </li>
              ))}
            </ol>

            <Link to="/rules" className="btn-secondary mt-8 w-full">
              Xem quy chế trước khi đăng ký
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-cyan-400/15 bg-cyan-400/5 p-5">
            <ShieldCheck
              aria-hidden="true"
              className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300"
            />
            <p className="text-sm leading-7 text-slate-400">
              Thông tin liên hệ được gửi đến ban tổ chức để xử lý đăng ký và
              thông báo về giải đấu.
            </p>
          </div>
        </aside>

        <div className="glass-panel min-w-0 p-6 sm:p-8">
          {submitted ? (
            <div
              ref={successRef}
              tabIndex={-1}
              role="status"
              className="flex min-h-[480px] flex-col items-center justify-center rounded-xl py-8 text-center"
            >
              <span className="flex h-20 w-20 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/10 shadow-[0_0_45px_rgba(103,232,249,0.12)]">
                <CheckCircle2
                  aria-hidden="true"
                  className="h-10 w-10 text-cyan-300"
                />
              </span>

              <h2 className="mt-6 text-2xl font-black text-white">
                Đăng ký thành công!
              </h2>

              <p className="mt-4 max-w-md break-words text-sm leading-8 text-slate-300">
                Cảm ơn {submitted.fullName}! Thông tin của bạn đã được ghi nhận.
                Ban tổ chức sẽ liên hệ để xác nhận việc tham gia.
              </p>

              {submitted.type === "team" && (
                <p className="mt-3 max-w-full break-words text-sm text-purple-200">
                  Đội đăng ký: {submitted.teamName}
                </p>
              )}

              <p className="mt-6 w-full break-all rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-xs leading-6 text-slate-400">
                Mã đăng ký:{" "}
                <span className="font-mono text-cyan-200">{submitted.id}</span>
              </p>

              <button
                type="button"
                onClick={resetForm}
                className="btn-primary mt-7"
              >
                Đăng ký thêm
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              noValidate
              aria-busy={loading}
            >
              <h2 className="text-xl font-bold text-white">
                Thông tin đăng ký
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Các mục có dấu <span className="text-rose-300">*</span> là bắt
                buộc.
              </p>

              <fieldset disabled={loading} className="mt-7 min-w-0 space-y-6">
                <legend className="sr-only">Thông tin người tham gia</legend>

                <div>
                  <label htmlFor="fullName" className="field-label">
                    Họ và tên <span className="text-rose-300">*</span>
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    autoComplete="name"
                    maxLength={100}
                    value={values.fullName}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.fullName)}
                    aria-describedby={
                      errors.fullName ? "fullName-error" : undefined
                    }
                    className="field-input"
                  />
                  <FieldError id="fullName-error" message={errors.fullName} />
                </div>

                <div>
                  <label htmlFor="contact" className="field-label">
                    Số điện thoại hoặc Email{" "}
                    <span className="text-rose-300">*</span>
                  </label>
                  <input
                    id="contact"
                    name="contact"
                    type="text"
                    required
                    maxLength={254}
                    autoCapitalize="none"
                    spellCheck={false}
                    value={values.contact}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.contact)}
                    aria-describedby={
                      errors.contact
                        ? "contact-hint contact-error"
                        : "contact-hint"
                    }
                    className="field-input"
                  />
                  <p
                    id="contact-hint"
                    className="mt-2 text-xs leading-6 text-slate-400"
                  >
                    Chỉ cần một số điện thoại hoặc một địa chỉ email bạn thường
                    sử dụng.
                  </p>
                  <FieldError id="contact-error" message={errors.contact} />
                </div>

                <fieldset
                  className="min-w-0"
                  aria-describedby={errors.type ? "type-error" : undefined}
                >
                  <legend className="field-label">
                    Hình thức đăng ký <span className="text-rose-300">*</span>
                  </legend>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      { value: "solo", label: "Đánh đơn", Icon: User },
                      { value: "team", label: "Theo đội", Icon: Users },
                    ].map(({ value, label, Icon }) => (
                      <label key={value} className="registration-option">
                        <input
                          type="radio"
                          name="type"
                          value={value}
                          required
                          checked={values.type === value}
                          onChange={handleChange}
                          aria-invalid={Boolean(errors.type)}
                          className="sr-only"
                        />
                        <span className="registration-option-box">
                          <Icon
                            aria-hidden="true"
                            className="h-5 w-5 shrink-0"
                          />
                          {label}
                          {values.type === value && (
                            <Check
                              aria-hidden="true"
                              className="ml-auto h-4 w-4 shrink-0 text-cyan-300"
                            />
                          )}
                        </span>
                      </label>
                    ))}
                  </div>

                  <FieldError id="type-error" message={errors.type} />
                </fieldset>

                {values.type === "team" && (
                  <div>
                    <label htmlFor="teamName" className="field-label">
                      Tên đội <span className="text-rose-300">*</span>
                    </label>
                    <input
                      id="teamName"
                      name="teamName"
                      type="text"
                      required
                      maxLength={80}
                      value={values.teamName}
                      onChange={handleChange}
                      aria-invalid={Boolean(errors.teamName)}
                      aria-describedby={
                        errors.teamName ? "teamName-error" : undefined
                      }
                      className="field-input"
                    />
                    <FieldError id="teamName-error" message={errors.teamName} />
                  </div>
                )}

                {submitError && (
                  <div
                    ref={errorRef}
                    role="alert"
                    tabIndex={-1}
                    className="flex items-start gap-3 rounded-xl border border-rose-400/25 bg-rose-400/10 p-4 text-sm leading-7 text-rose-200"
                  >
                    <AlertCircle
                      aria-hidden="true"
                      className="mt-1 h-5 w-5 shrink-0"
                    />
                    <p>{submitError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? (
                    <>
                      <Loader2
                        aria-hidden="true"
                        className="h-5 w-5 animate-spin motion-reduce:animate-none"
                      />
                      Đang gửi đăng ký…
                    </>
                  ) : (
                    <>
                      Gửi đăng ký
                      <ArrowRight aria-hidden="true" className="h-5 w-5" />
                    </>
                  )}
                </button>
              </fieldset>

              <div
                role="status"
                aria-live="polite"
                className="mt-4 text-center text-xs leading-6 text-slate-400"
              >
                {loading
                  ? slowWrite
                    ? "Kết nối đang chậm. Vui lòng giữ trang mở và không gửi lại trong khi hệ thống xác nhận."
                    : "Đang chờ hệ thống xác nhận thông tin đăng ký."
                  : "Ban tổ chức sẽ sử dụng thông tin liên hệ bạn cung cấp để xác nhận."}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
