import { doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import {
  defaultBrands,
  normalizeBrand,
  validateBrand,
} from "../data/ecosystem";

export async function initializeBrands() {
  if (!db) throw new Error("Kết nối dữ liệu chưa sẵn sàng.");
  return runTransaction(db, async (transaction) => {
    const entries = [];
    for (const brand of defaultBrands) {
      const reference = doc(db, "ecosystem_brands", brand.id);
      const snapshot = await transaction.get(reference);
      entries.push({ brand, reference, exists: snapshot.exists() });
    }
    let count = 0;
    for (const entry of entries) {
      if (entry.exists) continue;
      transaction.set(entry.reference, {
        ...normalizeBrand(entry.brand),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      count += 1;
    }
    return count;
  });
}

export async function saveBrand(brand) {
  if (!db) throw new Error("Kết nối dữ liệu chưa sẵn sàng.");
  const error = validateBrand(brand);
  if (error) throw new Error(error);
  await runTransaction(db, async (transaction) => {
    const reference = doc(db, "ecosystem_brands", brand.id);
    const snapshot = await transaction.get(reference);
    if (
      !snapshot.exists() ||
      !snapshot.data().updatedAt?.isEqual(brand.updatedAt)
    ) {
      throw new Error(
        "Nội dung đã được cập nhật ở nơi khác. Hãy tải lại danh mục trước khi lưu.",
      );
    }
    transaction.update(reference, {
      ...normalizeBrand(brand),
      updatedAt: serverTimestamp(),
    });
  });
}
