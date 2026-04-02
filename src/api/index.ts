// Browser-facing API functions — call Next.js API routes using relative URLs.
// Server components and route handlers should import from @/lib/db/* directly.

import { createRequest } from '@/api/client';
import * as RequestParams from '@/types/request';

export const getSession = async () => {
  const res = await fetch('/api/session');
  return res.json();
};

// ── Auth ────────────────────────────────────────────────────────────────────

export const signUp = async (params: RequestParams.SignUp) =>
  createRequest({ endpoint: '/api/auth/register', method: 'POST', body: params });

export const forgotPassword = async (email: string) =>
  createRequest({ endpoint: '/api/gateway/forgot-password', method: 'POST', body: { email } });

export const resetPassword = async (token: string, newPassword: string) =>
  createRequest({ endpoint: '/api/gateway/reset-password', method: 'POST', body: { token, newPassword } });

export const changePassword = async (currentPassword: string, newPassword: string) =>
  createRequest({ endpoint: '/api/gateway/change-password', method: 'POST', body: { currentPassword, newPassword } });

// ── Links ────────────────────────────────────────────────────────────────────

export const validateLink = async (linkId: number, password: string) =>
  createRequest({ endpoint: '/api/gateway/validate-link', method: 'POST', body: { linkId, password } });

export const buyLink = async (linkId: number) =>
  createRequest({ endpoint: '/api/gateway/buy-link', method: 'POST', body: { linkId } });

// ── User ─────────────────────────────────────────────────────────────────────

export const upgradePro = async () =>
  createRequest({ endpoint: '/api/gateway/upgrade-pro', method: 'POST', body: {} });

export const cancelPro = async () =>
  createRequest({ endpoint: '/api/gateway/cancel-pro', method: 'GET' });

export const uploadLogo = async (form: FormData) =>
  createRequest({ endpoint: '/api/gateway/upload-logo', method: 'POST', body: form });

export const deleteLogo = async () =>
  createRequest({ endpoint: '/api/gateway/delete-logo', method: 'POST', body: {} });

// ── Admin ─────────────────────────────────────────────────────────────────────

export const updatePaypal = async (paypalEmail: string) =>
  createRequest({ endpoint: '/api/gateway/update-paypal', method: 'POST', body: { paypalEmail } });

export const getEarningLinkList = async (userId: number, period: string) =>
  createRequest({ endpoint: '/api/gateway/get-earning-link-list', method: 'POST', body: { userId, period } });

export const exportActivity = async () =>
  createRequest({ endpoint: '/api/gateway/export-activity', method: 'GET' });

export const getLinkReportList = async (period: string, userName: string, url: string) =>
  createRequest({ endpoint: '/api/gateway/link-report', method: 'POST', body: { period, userName, url } });

export const getUserAnalyticsList = async (userName: string, page: number, rowPerPage: number) =>
  createRequest({ endpoint: '/api/gateway/user-analytics', method: 'POST', body: { userName, page, rowPerPage } });
