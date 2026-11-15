import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { doc, getDocFromServer, runTransaction, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { PROFILE_COLLECTION } from "./profile";

export const playerAuthReady = Boolean(auth && db);

export function observePlayer(listener, error) {
  return onAuthStateChanged(auth, listener, error);
}

export function connectGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  return signInWithPopup(auth, provider);
}

export function disconnectPlayer() { return signOut(auth); }

export async function getPlayerProfile(uid) {
  const snapshot = await getDocFromServer(doc(db, PROFILE_COLLECTION, uid));
  return snapshot.exists() ? snapshot.data() : null;
}

export function savePlayerProfile(uid, data) {
  const profile = doc(db, PROFILE_COLLECTION, uid);
  return runTransaction(db, async transaction => {
    if (auth.currentUser?.uid !== uid) throw Error("account-changed");
    const snapshot = await transaction.get(profile);
    transaction.set(profile, {
      ...data,
      createdAt: snapshot.exists() ? snapshot.get("createdAt") : serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });
}

export function playerError(error) {
  return {
    "auth/popup-closed-by-user": "Bạn đã đóng cửa sổ Google. Bấm lại để tiếp tục.",
    "auth/cancelled-popup-request": "Yêu cầu Google trước đó đã bị hủy. Bạn có thể thử lại.",
    "auth/popup-blocked": "Trình duyệt đang chặn cửa sổ Google. Hãy cho phép pop-up rồi thử lại.",
    "auth/unauthorized-domain": "Tên miền này chưa được phép đăng nhập trong Firebase Authentication.",
    "auth/operation-not-allowed": "Phương thức Google chưa được bật trong Firebase Authentication.",
    "auth/account-exists-with-different-credential": "Email này đã dùng phương thức đăng nhập khác. Vui lòng liên hệ BTC để được hỗ trợ.",
    "auth/network-request-failed": "Không kết nối được với Google. Kiểm tra mạng rồi thử lại.",
    "permission-denied": "Chưa có quyền đọc hoặc lưu hồ sơ. Hãy kiểm tra cấu hình Firestore Rules.",
    unavailable: "Chưa kết nối được Firebase. Kiểm tra mạng rồi thử lại.",
  }[error?.code] ?? "Thao tác chưa hoàn tất. Kiểm tra kết nối rồi thử lại.";
}
