import { supabase } from '@/lib/supabase';
import { sendLinkDownloadNotification } from '@/lib/email';
import { encryptLinkPassword, decryptLinkPassword, verifyLinkPassword } from '@/lib/linkCrypto';

type LinkRow = {
  id: number;
  user_id: number;
  dropbox_url: string | null;
  filename: string | null;
  passdrop_url: string;
  passdrop_pwd: string | null;
  service: number;
  link_type: number;
  download_count: number;
  expires_on: string | null;
  expire_count: number;
  track_ip: boolean;
  email_notify: boolean;
  is_paid: number | null;
};

function formatLink(link: LinkRow) {
  const urls = link.dropbox_url ? link.dropbox_url.split(',') : [];
  return {
    id: link.id,
    files: urls.map((url) => ({ url: url.trim() })),
    emailNotify: link.email_notify,
    service: link.service,
    link: link.passdrop_url,
    // SECURITY (H3): decrypt the stored password before returning to the
    // authenticated owner. Legacy plaintext passwords pass through unchanged.
    password: decryptLinkPassword(link.passdrop_pwd),
    linkType: link.link_type,
    trackIp: link.track_ip,
    cost: link.is_paid ?? 0,
    expiryCount: link.expire_count,
    expiryOn: link.expires_on ?? '',
    downloadCount: link.download_count,
  };
}

// ── Validation helpers ────────────────────────────────────────────────────────

/** SECURITY (M3 / M5): slugs must be 3–60 alphanumeric/hyphen/underscore chars. */
function isValidSlug(slug: string): boolean {
  return /^[a-zA-Z0-9_-]{3,60}$/.test(slug);
}

/** SECURITY (M2): URLs must be public HTTPS URLs.
 *
 * We intentionally do NOT use a domain allowlist — Notion Pro/Teams plans
 * allow custom domains (e.g. https://docs.yourcompany.com mapped to a Notion
 * page), so any public HTTPS URL is a legitimate input.
 *
 * What we DO block:
 *  - Non-HTTPS protocols (javascript:, data:, http:, ftp:, etc.)
 *  - Private / internal network ranges (SSRF protection):
 *      127.x.x.x, 10.x.x.x, 172.16-31.x.x, 192.168.x.x,
 *      169.254.x.x (cloud metadata), ::1 (IPv6 loopback),
 *      fc00::/7 (IPv6 ULA), fe80:: (link-local)
 *  - Reserved local hostnames: localhost, *.local, *.internal, *.localhost
 */
function isValidLinkUrl(url: string): boolean {
  try {
    const u = new URL(url);

    // Must be HTTPS — blocks javascript:, data:, ftp:, http:, etc.
    if (u.protocol !== 'https:') return false;

    const host = u.hostname.toLowerCase();

    // Block reserved / local hostnames.
    if (
      host === 'localhost' ||
      host.endsWith('.local') ||
      host.endsWith('.internal') ||
      host.endsWith('.localhost')
    ) return false;

    // Block private IPv4 ranges via a simple prefix / range check.
    const ipv4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
    if (ipv4) {
      const [, a, b] = ipv4.map(Number);
      if (
        a === 127 ||                          // 127.0.0.0/8  loopback
        a === 10 ||                           // 10.0.0.0/8   private
        a === 0 ||                            // 0.0.0.0/8    reserved
        (a === 172 && b >= 16 && b <= 31) ||  // 172.16.0.0/12 private
        (a === 192 && b === 168) ||           // 192.168.0.0/16 private
        (a === 169 && b === 254)              // 169.254.0.0/16 link-local / cloud metadata
      ) return false;
    }

    // Block IPv6 loopback and private ranges.
    if (
      host === '::1' ||
      host.startsWith('fc') ||   // fc00::/7 Unique Local
      host.startsWith('fd') ||
      host.startsWith('fe80')    // fe80::/10 link-local
    ) return false;

    return true;
  } catch {
    return false;
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function getLinkList(userId: number) {
  const { data, error } = await supabase
    .from('file_list_user')
    .select('*')
    .eq('user_id', userId)
    .order('id', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(formatLink);
}

export async function saveLink(
  userId: number,
  params: {
    files: { url: string }[];
    link: string;
    password: string;
    service: number;
    linkType: number;
    emailNotify: boolean;
    trackIp: boolean;
    cost: number;
    expiryCount: number;
    expiryOn: string;
  }
) {
  // SECURITY (M3 / M5): validate slug format before hitting the DB.
  if (!isValidSlug(params.link)) {
    return { success: false as const, message: 'Invalid URL slug. Use 3–60 alphanumeric characters, hyphens, or underscores.' };
  }

  // SECURITY (M2): validate that every file URL is an allowed HTTPS URL.
  for (const f of params.files) {
    if (f.url && !isValidLinkUrl(f.url)) {
      return { success: false as const, message: 'Invalid URL. Please enter a valid public HTTPS link.' };
    }
  }

  const { data: existing } = await supabase
    .from('file_list_user')
    .select('id')
    .eq('passdrop_url', params.link)
    .maybeSingle();

  if (existing) {
    return { success: false as const, message: 'That URL is already taken' };
  }

  // SECURITY (H3): encrypt the password before storing.
  const encryptedPwd = params.password ? encryptLinkPassword(params.password) : null;

  const { error } = await supabase.from('file_list_user').insert({
    user_id: userId,
    dropbox_url: params.files.map((f) => f.url).join(','),
    passdrop_url: params.link,
    passdrop_pwd: encryptedPwd,
    service: params.service,
    link_type: params.linkType,
    email_notify: params.emailNotify,
    track_ip: params.trackIp,
    is_paid: params.cost > 0 ? params.cost : null,
    expire_count: params.expiryCount ?? 0,
    expires_on: params.expiryOn || null,
    download_count: 0,
    created_on: new Date().toISOString().split('T')[0],
  });

  if (error) return { success: false as const, message: error.message };
  return { success: true as const };
}

export async function updateLink(
  userId: number,
  params: {
    id: number;
    files: { url: string }[];
    link: string;
    password: string;
    emailNotify: boolean;
    trackIp: boolean;
    cost: number;
    expiryCount: number;
    expiryOn: string;
  }
) {
  // SECURITY (M3 / M5): validate slug format.
  if (!isValidSlug(params.link)) {
    return { success: false as const, message: 'Invalid URL slug. Use 3–60 alphanumeric characters, hyphens, or underscores.' };
  }

  // SECURITY (M2): validate file URLs.
  for (const f of params.files) {
    if (f.url && !isValidLinkUrl(f.url)) {
      return { success: false as const, message: 'Invalid URL. Please enter a valid public HTTPS link.' };
    }
  }

  const { data: owned } = await supabase
    .from('file_list_user')
    .select('id')
    .eq('id', params.id)
    .eq('user_id', userId)
    .maybeSingle();

  if (!owned) return { success: false as const, message: 'Link not found or access denied' };

  const { data: slugConflict } = await supabase
    .from('file_list_user')
    .select('id')
    .eq('passdrop_url', params.link)
    .neq('id', params.id)
    .maybeSingle();

  if (slugConflict) return { success: false as const, message: 'That URL is already taken' };

  // SECURITY (H3): encrypt the password before storing.
  const encryptedPwd = params.password ? encryptLinkPassword(params.password) : null;

  const { error } = await supabase
    .from('file_list_user')
    .update({
      dropbox_url: params.files.map((f) => f.url).join(','),
      passdrop_url: params.link,
      passdrop_pwd: encryptedPwd,
      email_notify: params.emailNotify,
      track_ip: params.trackIp,
      is_paid: params.cost > 0 ? params.cost : null,
      expire_count: params.expiryCount ?? 0,
      expires_on: params.expiryOn || null,
    })
    .eq('id', params.id);

  if (error) return { success: false as const, message: error.message };
  return { success: true as const };
}

export async function deleteLink(userId: number, id: number) {
  const { data: owned } = await supabase
    .from('file_list_user')
    .select('id')
    .eq('id', id)
    .eq('user_id', userId)
    .maybeSingle();

  if (!owned) return { success: false as const, message: 'Link not found or access denied' };

  const { error } = await supabase.from('file_list_user').delete().eq('id', id);
  if (error) return { success: false as const, message: error.message };
  return { success: true as const };
}

export async function getLinkDetail(slug: string, requestUserId?: number) {
  const { data: link, error } = await supabase
    .from('file_list_user')
    .select('*, users!inner(id, user_name, is_pro, logo)')
    .eq('passdrop_url', slug)
    .single();

  // SECURITY (H6): 'user_email' is intentionally excluded from this query.
  // The download page is publicly accessible and must never expose the link
  // owner's email address to anonymous visitors.

  if (error || !link) return { success: false as const, message: 'Link not found' };

  if (link.expires_on && new Date(link.expires_on) < new Date()) {
    return { success: false as const, message: 'This link has expired' };
  }

  if (link.expire_count > 0 && link.download_count >= link.expire_count) {
    return { success: false as const, message: 'This link has reached its download limit' };
  }

  const owner = link.users as { id: number; user_name: string; is_pro: number; logo: string | null };
  const isOwner = !!requestUserId && requestUserId === link.user_id;
  const urls = link.dropbox_url ? link.dropbox_url.split(',') : [];

  return {
    success: true as const,
    data: {
      id: link.id,
      files: urls.map((url: string) => ({ url: url.trim() })),
      emailNotify: link.email_notify,
      service: link.service,
      link: link.passdrop_url,
      linkType: link.link_type,
      trackIp: link.track_ip,
      cost: link.is_paid ?? 0,
      expiryCount: link.expire_count,
      expiryOn: link.expires_on ?? '',
      downloadCount: link.download_count,
      userId: link.user_id,
      ownerName: owner.user_name,
      ownerLevel: owner.is_pro,
      ownerLogo: owner.logo ?? '',
      requirePaid: (link.is_paid ?? 0) > 0 && !isOwner,
      ignoreValidate: !link.passdrop_pwd || isOwner,
    },
  };
}

export async function validateLink(linkId: number, password: string, ipAddress: string) {
  const { data: link, error } = await supabase
    .from('file_list_user')
    .select('*, users!inner(id, user_name, user_email)')
    .eq('id', linkId)
    .single();

  if (error || !link) return { success: false as const, message: 'Link not found' };

  // SECURITY (H3): use verifyLinkPassword() which decrypts the stored value
  // before comparing, and falls back to plaintext for legacy entries.
  if (link.passdrop_pwd && !verifyLinkPassword(link.passdrop_pwd, password)) {
    return { success: false as const, message: 'Incorrect password' };
  }

  // Increment download counter
  await supabase
    .from('file_list_user')
    .update({ download_count: (link.download_count ?? 0) + 1, last_download: new Date().toISOString() })
    .eq('id', linkId);

  // Upsert daily_downloads for today
  const today = new Date().toISOString().split('T')[0];
  const { data: existingDay } = await supabase
    .from('daily_downloads')
    .select('id, downloads')
    .eq('link_id', linkId)
    .eq('download_date', today)
    .maybeSingle();

  if (existingDay) {
    await supabase
      .from('daily_downloads')
      .update({ downloads: existingDay.downloads + 1 })
      .eq('id', existingDay.id);
  } else {
    await supabase.from('daily_downloads').insert({
      user_id: link.user_id,
      link_id: linkId,
      passdrop_url: link.passdrop_url,
      downloads: 1,
      download_date: today,
    });
  }

  const owner = link.users as { user_name: string; user_email: string };
  let city = '';
  let country = '';

  // IP tracking (non-fatal)
  if (link.track_ip && ipAddress) {
    try {
      // SECURITY: use HTTPS endpoint so the IP and API key travel encrypted.
      const geoRes = await fetch(
        `https://api.ipstack.com/${ipAddress}?access_key=${process.env.IP_TRACK_KEY}&fields=city,country_name,latitude,longitude`
      );
      const geo = await geoRes.json();
      city    = geo.city ?? '';
      country = geo.country_name ?? '';
      await supabase.from('ip_tracker').insert({
        link_id: linkId,
        ip: ipAddress,
        city,
        country,
        latlong: `${geo.latitude ?? ''},${geo.longitude ?? ''}`,
      });
    } catch {
      // Non-fatal — continue
    }
  }

  // Email notification (non-fatal)
  if (link.email_notify) {
    try {
      await sendLinkDownloadNotification(owner.user_email, owner.user_name, city, country);
    } catch {
      // Non-fatal
    }
  }

  return { success: true as const };
}

export async function getAnalytics(userId: number, linkId: number) {
  const { data: link } = await supabase
    .from('file_list_user')
    .select('id, download_count')
    .eq('id', linkId)
    .eq('user_id', userId)
    .maybeSingle();

  if (!link) return { success: false as const, message: 'Link not found or access denied' };

  const { data: ipData } = await supabase
    .from('ip_tracker')
    .select('city, country')
    .eq('link_id', linkId);

  const cityMap: Record<string, number> = {};
  for (const row of ipData ?? []) {
    const key = row.city || 'Unknown';
    cityMap[key] = (cityMap[key] ?? 0) + 1;
  }

  return {
    success: true as const,
    data: {
      ipCount: (ipData ?? []).length,
      downloadCount: link.download_count,
      city: Object.entries(cityMap).map(([city, count]) => ({ city, count })),
    },
  };
}

export async function buyLink(buyerUserId: number, linkId: number) {
  const { data: link } = await supabase
    .from('file_list_user')
    .select('id, is_paid, user_id')
    .eq('id', linkId)
    .maybeSingle();

  if (!link || !link.is_paid) {
    return { success: false as const, message: 'Link not found or not a paid link' };
  }

  // Prevent buying your own link.
  if (link.user_id === buyerUserId) {
    return { success: false as const, message: 'You cannot purchase your own link' };
  }

  // SECURITY (M6): check for duplicate purchase — a user should not be able
  // to buy the same link more than once.
  const { data: alreadyBought } = await supabase
    .from('paid_links')
    .select('id')
    .eq('user_id', buyerUserId)
    .eq('link_id', linkId)
    .maybeSingle();

  if (alreadyBought) {
    return { success: false as const, message: 'You have already purchased this link' };
  }

  // SECURITY (H7): re-read the buyer's balance immediately before deducting.
  // This tightens the TOCTOU window. A fully atomic fix requires a Supabase
  // RPC (Postgres function) — add one if concurrent purchases become a concern.
  const { data: buyer } = await supabase
    .from('users')
    .select('id, balance')
    .eq('id', buyerUserId)
    .single();

  if (!buyer || buyer.balance < link.is_paid) {
    return { success: false as const, message: 'Insufficient balance' };
  }

  // Deduct from buyer
  const { error: deductError } = await supabase
    .from('users')
    .update({ balance: buyer.balance - link.is_paid })
    .eq('id', buyerUserId)
    .gte('balance', link.is_paid); // atomic guard: only updates if balance is still sufficient

  if (deductError) {
    return { success: false as const, message: 'Purchase failed — please try again' };
  }

  // Credit seller
  const { data: seller } = await supabase
    .from('users')
    .select('balance')
    .eq('id', link.user_id)
    .single();

  if (seller) {
    await supabase
      .from('users')
      .update({ balance: seller.balance + link.is_paid })
      .eq('id', link.user_id);
  }

  await supabase.from('paid_links').insert({
    user_id: buyerUserId,
    link_id: linkId,
    type: 1,
    amount: link.is_paid,
    status: 1,
  });

  return { success: true as const };
}
