'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '@/lib/api';

export type QuoteStep = 0 | 1 | 2 | 3 | 4;

export interface QuoteBreakdown {
  label: string;
  value: number;
}

export interface QuoteData {
  quoteId?: string;
  productSlug?: string;
  vehicle?: any;
  insurance?: any;
  customer?: any;
  amount?: number;
  breakdown?: QuoteBreakdown[];
}

export interface PurchaseState {
  currentStep: QuoteStep;
  quoteData: QuoteData;
  orderId: string | null;
  orderNumber: string | null;
  setStep: (step: QuoteStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  setProduct: (slug: string) => void;
  setVehicleData: (data: any) => void;
  setInsuranceData: (data: any) => void;
  setCustomerData: (data: any) => void;
  calculateQuote: () => Promise<boolean>;
  createQuote: (userId?: string) => Promise<boolean>;
  createOrder: () => Promise<string | null>;
  resetPurchase: () => void;
}

export const usePurchaseStore = create<PurchaseState>()(
  persist(
    (set, get) => ({
      currentStep: 0,
      quoteData: {},
      orderId: null,
      orderNumber: null,

      setStep: (step: QuoteStep) => set({ currentStep: step }),

      nextStep: () =>
        set((state) => ({
          currentStep: (Math.min(state.currentStep + 1, 4) as QuoteStep),
        })),

      prevStep: () =>
        set((state) => ({
          currentStep: (Math.max(state.currentStep - 1, 0) as QuoteStep),
        })),

      setProduct: (slug: string) =>
        set((state) => ({
          quoteData: { ...state.quoteData, productSlug: slug },
        })),

      setVehicleData: (data: any) =>
        set((state) => ({
          quoteData: { ...state.quoteData, vehicle: data },
        })),

      setInsuranceData: (data: any) =>
        set((state) => ({
          quoteData: { ...state.quoteData, insurance: data },
        })),

      setCustomerData: (data: any) =>
        set((state) => ({
          quoteData: { ...state.quoteData, customer: data },
        })),

      calculateQuote: async () => {
        const { productSlug, vehicle, insurance } = get().quoteData;
        if (!productSlug) return false;

        try {
          const response = await api.post(`/products/${productSlug}/calculate`, {
            vehicle,
            insurance,
          });
          const { amount, breakdown } = response.data ?? {};
          set((state) => ({
            quoteData: { ...state.quoteData, amount, breakdown },
            currentStep: 2,
          }));
          return true;
        } catch (error) {
          return false;
        }
      },

      createQuote: async (userId?: string) => {
        const { productSlug, vehicle, insurance, customer, amount, breakdown } = get().quoteData;
        if (!productSlug) return false;

        try {
          const body: Record<string, any> = {
            productSlug,
            data: { vehicle, insurance, customer },
            amount,
            breakdown,
          };
          if (userId) {
            body.userId = userId;
          }

          const response = await api.post('/quotes', body);
          const quoteId = response.data?.quoteId || response.data?.id;
          set((state) => ({
            quoteData: { ...state.quoteData, quoteId },
          }));
          return !!quoteId;
        } catch (error) {
          return false;
        }
      },

      createOrder: async () => {
        const quoteId = get().quoteData.quoteId;
        if (!quoteId) return null;

        try {
          const response = await api.post('/orders', { quoteId });
          const orderId = response.data?.orderId || response.data?.id;
          const orderNumber = response.data?.orderNumber || response.data?.number;
          set({ orderId, orderNumber });
          return orderId ?? null;
        } catch (error) {
          return null;
        }
      },

      resetPurchase: () =>
        set({
          currentStep: 0,
          quoteData: {},
          orderId: null,
          orderNumber: null,
        }),
    }),
    {
      name: 'eban-purchase',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        quoteData: state.quoteData,
        currentStep: state.currentStep,
      }),
    }
  )
);

export default usePurchaseStore;
