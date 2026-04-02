import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

import * as authDb from '@/lib/db/auth';
import * as linksDb from '@/lib/db/links';
import * as userDb from '@/lib/db/user';
import * as adminDb from '@/lib/db/admin';

// GET /api/gateway/[path]
export async function GET(
  _: Request,
  { params }: { params: { path: string } }
) {
  const session = await getServerSession(authOptions);

  const guardedPaths = ['cancel-pro', 'export-activity', 'get-user-list', 'user-subscription'];
  if (guardedPaths.includes(params.path) && !session) {
    return NextResponse.json({ success: false, message: 'Authentication is required' }, { status: 401 });
  }

  const userId: number = session?.user?.id as number;

  switch (params.path) {
    case 'cancel-pro': {
      const result = await userDb.cancelPro(userId);
      return NextResponse.json(result);
    }

    case 'user-subscription': {
      const result = await userDb.getSubscription(userId);
      return NextResponse.json(result);
    }

    case 'get-user-list': {
      const data = await adminDb.getUserList();
      return NextResponse.json(data);
    }

    case 'export-activity': {
      try {
        const buffer = await adminDb.exportActivity();
        return new Response(buffer, {
          headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename="UserDataExport.xlsx"',
          },
        });
      } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message });
      }
    }

    default:
      return NextResponse.json({ success: false, message: 'Unknown endpoint' }, { status: 404 });
  }
}

// POST /api/gateway/[path]
export async function POST(
  request: Request,
  { params }: { params: { path: string } }
) {
  const session = await getServerSession(authOptions);

  const guardedPaths = [
    'delete-link',
    'update-link',
    'link-analytics',
    'change-password',
    'upgrade-pro',
    'update-paypal',
    'get-earning-link-list',
    'link-report',
    'user-analytics',
    'buy-link',
    'upload-logo',
  ];

  if (guardedPaths.includes(params.path) && !session) {
    return NextResponse.json({ success: false, message: 'Authentication is required' }, { status: 401 });
  }

  const userId: number = session?.user?.id as number;

  // Handle multipart form data for file uploads separately
  if (params.path === 'upload-logo') {
    const formData = await request.formData();
    const file = formData.get('logo') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file provided' });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await userDb.uploadLogo(userId, buffer, file.type);
    return NextResponse.json(result);
  }

  // All other POST routes expect JSON
  let req: Record<string, any> = {};
  try {
    req = await request.json();
  } catch {
    // Ignore empty body
  }

  switch (params.path) {
    // ── Auth ──────────────────────────────────────────────────────────────────
    case 'forgot-password': {
      const result = await authDb.forgotPassword(req.email);
      return NextResponse.json(result);
    }

    case 'reset-password': {
      const result = await authDb.resetPassword(req.token, req.newPassword);
      return NextResponse.json(result);
    }

    case 'change-password': {
      const result = await authDb.changePassword(userId, req.currentPassword, req.newPassword);
      return NextResponse.json(result);
    }

    // ── Links ─────────────────────────────────────────────────────────────────
    case 'save-link': {
      const result = await linksDb.saveLink(userId, req as any);
      return NextResponse.json(result);
    }

    case 'update-link': {
      const result = await linksDb.updateLink(userId, req as any);
      return NextResponse.json(result);
    }

    case 'delete-link': {
      const result = await linksDb.deleteLink(userId, req.id);
      return NextResponse.json(result);
    }

    case 'link-analytics': {
      const result = await linksDb.getAnalytics(userId, req.id ?? req.linkId);
      return NextResponse.json(result);
    }

    case 'validate-link': {
      const ip =
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
        request.headers.get('x-real-ip') ??
        '';
      const result = await linksDb.validateLink(req.linkId, req.password, ip);
      return NextResponse.json(result);
    }

    case 'buy-link': {
      const result = await linksDb.buyLink(userId, req.linkId);
      return NextResponse.json(result);
    }

    // ── User ──────────────────────────────────────────────────────────────────
    case 'upgrade-pro': {
      const result = await userDb.upgradePro(userId);
      return NextResponse.json(result);
    }

    case 'delete-logo': {
      if (!session) {
        return NextResponse.json({ success: false, message: 'Authentication is required' }, { status: 401 });
      }
      const result = await userDb.deleteLogo(userId);
      return NextResponse.json(result);
    }

    // ── Admin ─────────────────────────────────────────────────────────────────
    case 'update-paypal': {
      const result = await adminDb.updatePaypal(userId, req.paypalEmail);
      return NextResponse.json(result);
    }

    case 'get-earning-link-list': {
      const result = await adminDb.getEarningLinkList(req.userId, req.period);
      return NextResponse.json(result);
    }

    case 'link-report': {
      const result = await adminDb.linkReport(req.period, req.userName, req.url);
      return NextResponse.json(result);
    }

    case 'user-analytics': {
      const result = await adminDb.userAnalytics(req.userName, req.page, req.rowPerPage);
      return NextResponse.json(result);
    }

    default:
      return NextResponse.json({ success: false, message: 'Unknown endpoint' }, { status: 404 });
  }
}
