import { apiGet, apiPost, apiPatch } from './client';

export interface PricingPolicy {
  id: string;
  type: 'VISITOR_HOURLY' | 'VISITOR_DAILY' | 'SUBSCRIPTION_STUDENT' | 'SUBSCRIPTION_LECTURER';
  basePrice: number;
  discountPercentage?: number;
  applicableFrom: string;
  applicableUntil?: string;
  description?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionPolicy {
  id: string;
  role: 'student' | 'lecturer';
  durationMonths: number;
  monthlyPrice: number;
  benefits: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QuotaPolicy {
  id: string;
  role: 'lecturer';
  defaultMonthlyQuota: number;
  quotaIncrement: number;
  quotaPricePerIncrement: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export const policyApi = {
  // Pricing Policies
  getPricingPolicies(params?: { active?: boolean }) {
    const searchParams = new URLSearchParams();
    if (params?.active !== undefined) searchParams.set('active', String(params.active));
    return apiGet<PricingPolicy[]>(
      `/api/admin/policy/pricing${searchParams.toString() ? '?' + searchParams.toString() : ''}`
    );
  },

  createPricingPolicy(payload: {
    type: string;
    basePrice: number;
    discountPercentage?: number;
    applicableFrom: string;
    applicableUntil?: string;
    description?: string;
  }) {
    return apiPost<PricingPolicy>('/api/admin/policy/pricing', payload);
  },

  updatePricingPolicy(
    policyId: string,
    data: Partial<{
      basePrice: number;
      discountPercentage?: number;
      applicableUntil?: string;
      description?: string;
      active: boolean;
    }>
  ) {
    return apiPatch<PricingPolicy>(
      `/api/admin/policy/pricing/${encodeURIComponent(policyId)}`,
      data
    );
  },

  // Subscription Policies
  getSubscriptionPolicies(params?: { role?: string; active?: boolean }) {
    const searchParams = new URLSearchParams();
    if (params?.role) searchParams.set('role', params.role);
    if (params?.active !== undefined) searchParams.set('active', String(params.active));
    return apiGet<SubscriptionPolicy[]>(
      `/api/admin/policy/subscription${searchParams.toString() ? '?' + searchParams.toString() : ''}`
    );
  },

  createSubscriptionPolicy(payload: {
    role: 'student' | 'lecturer';
    durationMonths: number;
    monthlyPrice: number;
    benefits?: string[];
  }) {
    return apiPost<SubscriptionPolicy>('/api/admin/policy/subscription', payload);
  },

  updateSubscriptionPolicy(
    policyId: string,
    data: Partial<{
      monthlyPrice: number;
      benefits?: string[];
      active: boolean;
    }>
  ) {
    return apiPatch<SubscriptionPolicy>(
      `/api/admin/policy/subscription/${encodeURIComponent(policyId)}`,
      data
    );
  },

  // Quota Policies
  getQuotaPolicies(params?: { role?: string; active?: boolean }) {
    const searchParams = new URLSearchParams();
    if (params?.role) searchParams.set('role', params.role);
    if (params?.active !== undefined) searchParams.set('active', String(params.active));
    return apiGet<QuotaPolicy[]>(
      `/api/admin/policy/quota${searchParams.toString() ? '?' + searchParams.toString() : ''}`
    );
  },

  createQuotaPolicy(payload: {
    role: 'lecturer';
    defaultMonthlyQuota: number;
    quotaIncrement: number;
    quotaPricePerIncrement: number;
  }) {
    return apiPost<QuotaPolicy>('/api/admin/policy/quota', payload);
  },

  updateQuotaPolicy(
    policyId: string,
    data: Partial<{
      defaultMonthlyQuota: number;
      quotaIncrement: number;
      quotaPricePerIncrement: number;
      active: boolean;
    }>
  ) {
    return apiPatch<QuotaPolicy>(
      `/api/admin/policy/quota/${encodeURIComponent(policyId)}`,
      data
    );
  },

  // Get all active policies
  getActivePolicies() {
    return apiGet<{
      pricing: PricingPolicy[];
      subscription: SubscriptionPolicy[];
      quota: QuotaPolicy[];
    }>('/api/admin/policies/active');
  },
};
