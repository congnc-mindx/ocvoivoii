import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { communityError } from "./model";

export default function useCommunitySessions(admin = false) {
  const [state, setState] = useState({
    loading: true,
    items: [],
    error: "",
  });

  useEffect(() => {
    const source = admin
      ? collection(db, "event_sessions")
      : query(collection(db, "event_sessions"), where("visible", "==", true));

    return onSnapshot(
      source,
      { includeMetadataChanges: true },
      (snapshot) => {
        if (snapshot.metadata.fromCache) return;

        const items = snapshot.docs
          .map((document) => ({
            ...document.data(),
            id: document.id,
          }))
          .sort(
            (first, second) =>
              (second.startsAt?.toMillis() ?? 0) -
              (first.startsAt?.toMillis() ?? 0),
          );

        setState({
          loading: false,
          error: "",
          items,
        });
      },
      (error) => {
        setState({
          loading: false,
          items: [],
          error: communityError(error),
        });
      },
    );
  }, [admin]);

  return state;
}
