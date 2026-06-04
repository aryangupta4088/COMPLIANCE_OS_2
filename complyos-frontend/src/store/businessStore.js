import { create } from 'zustand';

const useBusinessStore = create((set) => ({
  businesses: [],
  currentBusiness: null,
  isLoading: false,
  error: null,

  setBusinesses: (businesses) => set({ businesses }),
  setCurrentBusiness: (business) => set({ currentBusiness: business }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  addBusiness: (business) =>
    set((state) => ({
      businesses: [...state.businesses, business],
    })),

  updateBusiness: (id, updatedBusiness) =>
    set((state) => ({
      businesses: state.businesses.map((b) => (b.id === id ? updatedBusiness : b)),
      currentBusiness: state.currentBusiness?.id === id ? updatedBusiness : state.currentBusiness,
    })),

  deleteBusiness: (id) =>
    set((state) => ({
      businesses: state.businesses.filter((b) => b.id !== id),
      currentBusiness: state.currentBusiness?.id === id ? null : state.currentBusiness,
    })),

  clearError: () => set({ error: null }),
}));

export default useBusinessStore;
