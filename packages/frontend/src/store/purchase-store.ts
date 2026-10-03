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
  coverage?: any;
  insured?: any;
  trip?: any;
  travelers?: any;
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
  setCoverageData: (data: any) => void;
  setInsuredData: (data: any) => void;
  setTripData: (data: any) => void;
  setTravelersData: (data: any) => void;
  calculateQuote: () => Promise<boolean>;
  createQuote: (userId?: string) => Promise<boolean>;
  createOrder: () => Promise<string | null>;
  resetPurchase: () => void;
}

export const usePurchaseStore = create<PurchaseState>()(
  persist(
    (set, _get) => {
      const state: PurchaseState = {
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

        setCoverageData: (data: any) =>
          set((state) => ({
            quoteData: { ...state.quoteData, coverage: data },
          })),

        setInsuredData: (data: any) =>
          set((state) => ({
            quoteData: { ...state.quoteData, insured: data },
          })),

        setTripData: (data: any) =>
          set((state) => ({
            quoteData: { ...state.quoteData, trip: data },
          })),

        setTravelersData: (data: any) =>
          set((state) => ({
            quoteData: { ...state.quoteData, travelers: data },
          })),

        calculateQuote: async () => {
          const { productSlug, vehicle, insurance, customer, coverage, trip, travelers, insured } = state.quoteData;
          if (!productSlug) return false;

          try {
            const dataPayload: Record<string, any> = {};
            if (vehicle) Object.assign(dataPayload, vehicle);
            if (insurance) Object.assign(dataPayload, insurance);
            if (customer) Object.assign(dataPayload, customer);
            if (coverage) Object.assign(dataPayload, coverage);
            if (insured) Object.assign(dataPayload, insured);
            if (trip) Object.assign(dataPayload, trip);
            if (travelers) Object.assign(dataPayload, travelers);

            const response = await api.post(`/products/${productSlug}/calculate`, {
              data: dataPayload,
            });
            const { amount, breakdown } = response.data ?? {};
            set((st) => ({
              quoteData: { ...st.quoteData, amount, breakdown },
              currentStep: 2,
            }));
            return true;
          } catch (error) {
            return false;
          }
        },

        createQuote: async (_userId?: string) => {
          const { productSlug, vehicle, insurance, customer, coverage, trip, travelers, insured, amount, breakdown } =
            state.quoteData;
          if (!productSlug) return false;

          try {
            const dataPayload: Record<string, any> = {};
            if (vehicle) Object.assign(dataPayload, vehicle);
            if (insurance) Object.assign(dataPayload, insurance);
            if (customer) Object.assign(dataPayload, customer);
            if (coverage) Object.assign(dataPayload, coverage);
            if (insured) Object.assign(dataPayload, insured);
            if (trip) Object.assign(dataPayload, trip);
            if (travelers) Object.assign(dataPayload, travelers);

            const body: Record<string, any> = {
              productSlug,
              data: dataPayload,
            };
            if (typeof amount === 'number' && amount > 0) {
              body.amount = amount;
            }
            if (Array.isArray(breakdown) && breakdown.length > 0) {
              body.breakdown = breakdown;
            }

            const response = await api.post('/quotes', body);
            const quoteId = response.data?.quoteId || response.data?.id;
            set((st) => ({
              quoteData: { ...st.quoteData, quoteId },
            }));
            return !!quoteId;
          } catch (error) {
            return false;
          }
        },

        createOrder: async () => {
          const quoteId = state.quoteData.quoteId;
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
      };
      return state;
    },
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
