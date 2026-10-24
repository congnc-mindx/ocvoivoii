import { useEffect, useRef } from "react";
import {
  BrowserRouter,
  Link,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigationType,
} from "react-router-dom";
import { ArrowLeft, Compass } from "lucide-react";
import AuthProvider from "./contexts/AuthProvider";
import RequireAdmin from "./components/auth/RequireAdmin";
import AdminLayout from "./components/admin/AdminLayout";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/pages/Home";
import About from "./components/pages/About";
import Rules from "./components/pages/Rules";
import CommunityPortal from "./components/community/CommunityPortal";
import CommunityAdmin from "./components/community/CommunityAdmin";
import Login from "./components/pages/Login";
import Ecosystem from "./components/pages/Ecosystem";
import AdminDashboard from "./components/pages/AdminDashboard";
import EcosystemAdmin from "./components/pages/admin/EcosystemAdmin";
import { pageTitles } from "./config/site";

function RouteEffects() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const first = useRef(true);
  useEffect(() => {
    const path = location.pathname.replace(/\/+$/, "") || "/";
    document.title = `${pageTitles[path] || "Không tìm thấy trang"} | Ocvoivoii`;
    const initial = first.current;
    first.current = false;
    const frame = window.requestAnimationFrame(() => {
      if (!initial)
        document.querySelector("main")?.focus({ preventScroll: true });
      if (location.hash) {
        try {
          const target = document.getElementById(
            decodeURIComponent(location.hash.slice(1)),
          );
          if (target) {
            target.scrollIntoView({ block: "start" });
            return;
          }
        } catch {
          window.scrollTo({ top: 0, left: 0, behavior: "instant" });
          return;
        }
      }
      if (navigationType !== "POP")
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [location.key, location.pathname, location.hash, navigationType]);
  return null;
}
function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <a href="#main-content" className="skip-link">
        Đi đến nội dung chính
      </a>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="min-w-0 flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
function NotFound() {
  return (
    <section className="page-container flex min-h-[65vh] flex-col items-center justify-center py-20 text-center">
      <span className="icon-tile mb-7">
        <Compass aria-hidden="true" className="h-8 w-8" />
      </span>
      <p className="eyebrow">Lạc đường một chút thôi</p>
      <h1 className="page-title">Không tìm thấy trang</h1>
      <p className="mt-5 max-w-md leading-7 text-slate-400">
        Đường dẫn này không tồn tại hoặc đã được thay đổi. Cùng quay về trang
        chủ để tiếp tục khám phá nhé.
      </p>
      <Link to="/" className="btn-primary mt-8">
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Về trang chủ
      </Link>
    </section>
  );
}
export default function App() {
  const basename = import.meta.env.BASE_URL.replace(/\/+$/, "") || "/";
  return (
    <BrowserRouter basename={basename}>
      <AuthProvider>
        <RouteEffects />
        <Routes>
          <Route element={<SiteLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="rules" element={<Rules />} />
            <Route path="register" element={<CommunityPortal />} />
            <Route path="feedback" element={<CommunityPortal feedback />} />
            <Route path="ecosystem" element={<Ecosystem />} />
            <Route path="login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route element={<RequireAdmin />}>
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="ecosystem" element={<EcosystemAdmin />} />
              <Route path="community" element={<CommunityAdmin />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
