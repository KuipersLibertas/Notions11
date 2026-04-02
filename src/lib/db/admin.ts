import { supabase } from '@/lib/supabase';
import * as XLSX from 'xlsx';

export async function getUserList() {
  const { data, error } = await supabase
    .from('users')
    .select('id, user_email, user_name, balance')
    .eq('is_pro', 1)
    .order('id');

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function updatePaypal(userId: number, paypalEmail: string) {
  const { error } = await supabase
    .from('users')
    .update({ paypal_id: paypalEmail })
    .eq('id', userId);

  if (error) return { success: false as const, message: error.message };
  return { success: true as const };
}

export async function getEarningLinkList(targetUserId: number, period: string) {
  let query = supabase
    .from('paid_links')
    .select('id, link_id, user_id, type, amount, status, created_at, file_list_user!inner(passdrop_url)');

  if (period === '1') {
    // Pending only
    query = query.eq('status', 0);
  } else if (period !== '2') {
    // Specific month e.g. "2024-01"
    const [year, month] = period.split('-');
    const start = `${year}-${month}-01`;
    const endDate = new Date(parseInt(year), parseInt(month), 0);
    const end = endDate.toISOString().split('T')[0];
    query = query.gte('created_at', start).lte('created_at', end);
  }

  if (targetUserId) {
    query = query.eq('user_id', targetUserId);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  // Group by link_id
  const grouped: Record<number, { link_id: number; status: number; price: number; total: number; count: number; passdrop_url: string }> = {};
  for (const row of data ?? []) {
    const link = row.file_list_user as { passdrop_url: string };
    if (!grouped[row.link_id]) {
      grouped[row.link_id] = {
        link_id: row.link_id,
        status: row.status,
        price: row.amount,
        total: 0,
        count: 0,
        passdrop_url: link?.passdrop_url ?? '',
      };
    }
    grouped[row.link_id].total += row.amount;
    grouped[row.link_id].count += 1;
  }

  return Object.values(grouped);
}

export async function linkReport(period: string, userName?: string, url?: string) {
  let dateFilter = '';
  const today = new Date().toISOString().split('T')[0];

  if (period === '1') {
    dateFilter = today;
  } else if (period === '2') {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    dateFilter = d.toISOString().split('T')[0];
  } else if (period === '3') {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    dateFilter = d.toISOString().split('T')[0];
  }

  let query = supabase
    .from('daily_downloads')
    .select('link_id, passdrop_url, downloads, download_date, file_list_user!inner(id, expire_count, expires_on, user_id, users!inner(user_name, user_email, is_pro))');

  if (dateFilter) query = query.gte('download_date', dateFilter);
  if (url) query = query.ilike('passdrop_url', `%${url}%`);

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  // Aggregate by link_id
  type LinkAgg = {
    id: number;
    passdrop_url: string;
    period_download_count: number;
    total_download_count: number;
    user_name: string;
    user_email: string;
    is_pro: boolean;
    expiry_count: number;
    expiry_on: string;
  };

  const aggMap: Record<number, LinkAgg> = {};

  for (const row of data ?? []) {
    const link = row.file_list_user as { id: number; expire_count: number; expires_on: string | null; user_id: number; users: { user_name: string; user_email: string; is_pro: number } };
    if (!userName || link.users.user_name?.toLowerCase().includes(userName.toLowerCase())) {
      if (!aggMap[row.link_id]) {
        aggMap[row.link_id] = {
          id: row.link_id,
          passdrop_url: row.passdrop_url,
          period_download_count: 0,
          total_download_count: 0,
          user_name: link.users.user_name,
          user_email: link.users.user_email,
          is_pro: link.users.is_pro === 1,
          expiry_count: link.expire_count,
          expiry_on: link.expires_on ?? '',
        };
      }
      aggMap[row.link_id].period_download_count += row.downloads;
      aggMap[row.link_id].total_download_count += row.downloads;
    }
  }

  return Object.values(aggMap).map((v, i) => ({ sno: i + 1, ...v }));
}

export async function userAnalytics(
  filterName?: string,
  page = 1,
  rowPerPage = 25
) {
  let query = supabase
    .from('users')
    .select('id, user_name, user_email, stripe_id, subscription_id, logo, is_pro, balance', { count: 'exact' });

  if (filterName) query = query.ilike('user_name', `%${filterName}%`);

  const from = (page - 1) * rowPerPage;
  const to = from + rowPerPage - 1;

  const { data: users, count, error } = await query.range(from, to).order('id');
  if (error) throw new Error(error.message);

  // Get link counts and download counts per user
  const userIds = (users ?? []).map((u) => u.id);

  const { data: linkCounts } = await supabase
    .from('file_list_user')
    .select('user_id, download_count')
    .in('user_id', userIds);

  const linkMap: Record<number, { link_count: number; download_count: number }> = {};
  for (const row of linkCounts ?? []) {
    if (!linkMap[row.user_id]) linkMap[row.user_id] = { link_count: 0, download_count: 0 };
    linkMap[row.user_id].link_count += 1;
    linkMap[row.user_id].download_count += row.download_count ?? 0;
  }

  const result = (users ?? []).map((u, i) => ({
    sno: from + i + 1,
    id: u.id,
    user_name: u.user_name,
    user_email: u.user_email,
    stripe_id: u.stripe_id ?? '',
    subscription_id: u.subscription_id ?? '',
    logo: u.logo ?? '',
    is_pro: u.is_pro,
    link_count: linkMap[u.id]?.link_count ?? 0,
    download_count: linkMap[u.id]?.download_count ?? 0,
  }));

  return { data: result, total: count ?? 0 };
}

export async function exportActivity(): Promise<Buffer> {
  const { data: users } = await supabase
    .from('users')
    .select('id, user_name, user_email, is_pro');

  const { data: links } = await supabase
    .from('file_list_user')
    .select('user_id, dropbox_url, passdrop_url, link_type, download_count');

  // Build link count / download count per user
  const userStats: Record<number, { link_count: number; download_count: number }> = {};
  for (const link of links ?? []) {
    if (!userStats[link.user_id]) userStats[link.user_id] = { link_count: 0, download_count: 0 };
    userStats[link.user_id].link_count += 1;
    userStats[link.user_id].download_count += link.download_count ?? 0;
  }

  const userSheet = (users ?? []).map((u) => ({
    user_name: u.user_name,
    user_email: u.user_email,
    is_pro: u.is_pro,
    id: u.id,
    link_count: userStats[u.id]?.link_count ?? 0,
    download_count: userStats[u.id]?.download_count ?? 0,
  }));

  const linkSheet = (links ?? []).map((l) => ({
    user_id: l.user_id,
    notion_url: l.dropbox_url,
    passdrop_url: l.passdrop_url,
    link_type: l.link_type,
  }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(userSheet), 'Users');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(linkSheet), 'Links');

  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}
