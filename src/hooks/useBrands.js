import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";

export default function useBrands(mode = "public") {
  const [state, setState] = useState({ brands: [], loading: true, error: "" });
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    const finishError = (message) => {
      if (active) setState({ brands: [], loading: false, error: message });
    };
    if (!db) {
      queueMicrotask(() => finishError("Kết nối dữ liệu chưa sẵn sàng."));
      return () => {
        active = false;
      };
    }
    const source =
      mode === "admin"
        ? collection(db, "ecosystem_brands")
        : query(
            collection(db, "ecosystem_brands"),
            where("visible", "==", true),
          );
    let receivedServerData = false;
    const timer = window.setTimeout(() => {
      if (!receivedServerData)
        finishError("Kết nối đang chậm. Vui lòng thử tải lại danh mục.");
    }, 15000);
    const unsubscribe = onSnapshot(
      source,
      { includeMetadataChanges: true },
      (snapshot) => {
        if (snapshot.metadata.hasPendingWrites) return;
        if (!active || (!receivedServerData && snapshot.metadata.fromCache))
          return;
        if (!snapshot.metadata.fromCache) receivedServerData = true;
        window.clearTimeout(timer);
        const brands = snapshot.docs.map((document) => ({
          ...document.data(),
          id: document.id,
        }));
        brands.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
        setState({ brands, loading: false, error: "" });
      },
      () => {
        window.clearTimeout(timer);
        finishError(
          "Không thể tải danh mục. Vui lòng kiểm tra kết nối và quyền truy cập.",
        );
      },
    );
    return () => {
      active = false;
      window.clearTimeout(timer);
      unsubscribe();
    };
  }, [mode, retry]);

  function reload() {
    setState({ brands: [], loading: true, error: "" });
    setRetry((value) => value + 1);
  }
  return { ...state, reload };
}
