import { useCallback, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase";
import AuthContext from "./AuthContext";

export default function AuthProvider({ children }) {
  const [session, setSession] = useState({
    user: null,
    adminProfile: null,
    loading: Boolean(auth && db),
    error: auth && db ? "" : "Kết nối Firebase chưa sẵn sàng.",
  });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!auth || !db) return undefined;
    let disposed = false;
    let generation = 0;
    let roleListener;
    let timer;
    const stopRole = () => {
      roleListener?.();
      roleListener = null;
      window.clearTimeout(timer);
    };
    const stopAuth = onAuthStateChanged(
      auth,
      (user) => {
        if (disposed) return;
        const version = ++generation;
        stopRole();
        if (!user) {
          setSession({
            user: null,
            adminProfile: null,
            loading: false,
            error: "",
          });
          return;
        }
        setSession({ user, adminProfile: null, loading: true, error: "" });
        timer = window.setTimeout(() => {
          if (!disposed && version === generation)
            setSession({
              user,
              adminProfile: null,
              loading: false,
              error:
                "Chưa thể xác minh quyền quản trị. Vui lòng kiểm tra mạng và thử lại.",
            });
        }, 15000);
        roleListener = onSnapshot(
          doc(db, "admin_users", user.uid),
          { includeMetadataChanges: true },
          (snapshot) => {
            if (
              disposed ||
              generation !== version ||
              snapshot.metadata.fromCache
            )
              return;
            window.clearTimeout(timer);
            const data = snapshot.exists() ? snapshot.data() : null;
            setSession({
              user,
              adminProfile: data
                ? { role: data.role, active: data.active === true }
                : null,
              loading: false,
              error: "",
            });
          },
          (error) => {
            if (disposed || generation !== version) return;
            window.clearTimeout(timer);
            setSession({
              user,
              adminProfile: null,
              loading: false,
              error:
                error.code === "permission-denied"
                  ? "Không thể đọc quyền tài khoản. Vui lòng kiểm tra Firestore Rules."
                  : "Không thể xác minh quyền quản trị. Vui lòng thử lại.",
            });
          },
        );
      },
      () => {
        if (disposed) return;
        generation += 1;
        stopRole();
        setSession({
          user: null,
          adminProfile: null,
          loading: false,
          error: "Không thể kiểm tra phiên đăng nhập.",
        });
      },
    );
    return () => {
      disposed = true;
      generation += 1;
      stopAuth();
      stopRole();
    };
  }, [attempt]);
  const retrySession = useCallback(() => {
    if (!auth || !db) return;
    setSession({
      user: auth.currentUser,
      adminProfile: null,
      loading: true,
      error: "",
    });
    setAttempt((value) => value + 1);
  }, []);
  const logout = useCallback(async () => {
    if (!auth) throw new Error("Đăng nhập chưa sẵn sàng.");
    await signOut(auth);
    setSession({ user: null, adminProfile: null, loading: false, error: "" });
  }, []);
  const isAdmin =
    !session.loading &&
    !session.error &&
    session.adminProfile?.role === "admin" &&
    session.adminProfile?.active === true;
  const value = useMemo(
    () => ({ ...session, isAdmin, logout, retrySession }),
    [session, isAdmin, logout, retrySession],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
