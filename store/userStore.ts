import { create } from "zustand"
import { persist } from "zustand/middleware"

type UserStoreType = {
  subscriptionKey: string | null;
  setSubscriptionKey: (key: string | null) => void;
};

export const UserStore = create<UserStoreType>()(
  persist(
    (set) => ({
      subscriptionKey: null,
      setSubscriptionKey: (key) => set({ subscriptionKey: key }),
    }),
    {
      name: 'user-store',
      getStorage: () => localStorage,
    }
  )
)