export async function signOut() {
  // Not in the backend schema: the session proxy answers it by clearing the session cookie.
  const response = await fetch('/api/auth/logout', { method: 'POST' });
  if (!response.ok) throw new Error('Sign-out failed');
}
