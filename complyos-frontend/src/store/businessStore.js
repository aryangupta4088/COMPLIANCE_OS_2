import { create } from "zustand";

const useBusinessStore = create((set) => ({
  profile: null,
  profileComplete: false,
  
  setProfile: (profile) => set({ 
    profile, 
    profileComplete: profile?.aria_profile_complete || false 
  }),
  
  updateProfile: (updates) => set((state) => ({
    profile: { ...state.profile, ...updates }
  })),

  clearProfile: () => set({ profile: null, profileComplete: false }),
}));

export default useBusinessStore;
