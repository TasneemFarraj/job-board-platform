import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BookmarksState {
  bookmarkedIds: string[];
  isBookmarked: (jobId: string) => boolean;
  toggleBookmark: (jobId: string) => void;
  removeBookmark: (jobId: string) => void;
}

export const useBookmarksStore = create<BookmarksState>()(
  persist(
    (set, get) => ({
      bookmarkedIds: [],

      isBookmarked: (jobId) => get().bookmarkedIds.includes(jobId),

      toggleBookmark: (jobId) =>
        set((state) => ({
          bookmarkedIds: state.bookmarkedIds.includes(jobId)
            ? state.bookmarkedIds.filter((id) => id !== jobId)
            : [...state.bookmarkedIds, jobId],
        })),

      removeBookmark: (jobId) =>
        set((state) => ({
          bookmarkedIds: state.bookmarkedIds.filter((id) => id !== jobId),
        })),
    }),
    { name: "jobbr-bookmarks" }
  )
);
