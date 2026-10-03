import type { InsuranceProduct } from './types.js';
import { thirdPartyProduct } from './third-party.js';
import { bodyProduct } from './body.js';
import { lifeProduct } from './life.js';
import { travelProduct } from './travel.js';

export const products: Record<string, InsuranceProduct> = {
  'third-party': thirdPartyProduct,
  body: bodyProduct,
  life: lifeProduct,
  travel: travelProduct,
};

export type { InsuranceProduct, ProductQuoteStep, ProductField, ProductFeature } from './types.js';
export { thirdPartyProduct } from './third-party.js';
export { bodyProduct } from './body.js';
export { lifeProduct } from './life.js';
export { travelProduct } from './travel.js';
