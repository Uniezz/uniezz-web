import { api } from './client';

export async function getMyInviteCode() {
  const { data } = await api.GET('/auth/invites/me');
  return data!;
}

export async function redeemInvite(code: string) {
  const { data } = await api.POST('/auth/invites/redeem', { body: { code } });
  return data!;
}
